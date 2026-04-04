import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/* =========================
   HELPER: calculate item share
========================= */
const calculateItemShares = (items, orderTotal) => {
  const activeItems = items.filter(
    (item) => String(item.seller_status || "pending").toLowerCase() !== "cancelled"
  );

  const baseItems = activeItems.map((item) => {
    const base =
      Number(item.price || 0) * Number(item.qty || 0) -
      Number(item.discount_amount || 0);

    return {
      ...item,
      base: Math.max(0, base),
    };
  });

  const totalBase = baseItems.reduce((sum, i) => sum + i.base, 0);

  if (baseItems.length === 0 || totalBase <= 0) {
    return baseItems.map((item) => ({ ...item, share: 0 }));
  }

  const rawShares = baseItems.map((item) => ({
    ...item,
    share: (item.base / totalBase) * Number(orderTotal || 0),
  }));

  const roundedShares = rawShares.map((item) => ({
    ...item,
    share: Math.round(item.share * 100) / 100,
  }));

  const roundedSum = roundedShares.reduce((sum, item) => sum + item.share, 0);
  const diff = Math.round((Number(orderTotal || 0) - roundedSum) * 100) / 100;

  if (roundedShares.length > 0 && diff !== 0) {
    roundedShares[roundedShares.length - 1].share =
      Math.round((roundedShares[roundedShares.length - 1].share + diff) * 100) / 100;
  }

  return roundedShares;
};

/**
 * =========================
 * GET /api/orders
 * customer: list my orders
 * =========================
 */
router.get("/", verifyToken, requireRole("customer"), async (req, res) => {
  try {
    const customerId = req.user.user_id;

    const { rows } = await pool.query(
      `
      SELECT
        o.order_id,
        o.address_id,
        o.date_added,
        o.payment_status,
        o.payment_method,
        COALESCE(o.total_price, 0) AS total_price,
        COALESCE(o.discount_amount, 0) AS discount_amount,
        COALESCE(o.delivery_charge, 0) AS delivery_charge,
        COALESCE(o.refunded_amount, 0) AS refunded_amount,
        sa.address AS shipping_address,
        sa.city,
        sa.shipping_state,
        sa.zip_code,
        sa.country
      FROM "order" o
      LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
      WHERE o.customer_id = $1
      ORDER BY o.date_added DESC
      `,
      [customerId]
    );

    res.json({ orders: rows });
  } catch (e) {
    console.error("GET CUSTOMER ORDERS ERROR:", e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * GET /api/orders/:id
 * customer: order details + items + timeline
 * =========================
 */
router.get("/:id", verifyToken, requireRole("customer"), async (req, res) => {
  try {
    const customerId = req.user.user_id;
    const orderId = Number(req.params.id);

    const orderRes = await pool.query(
      `
      SELECT
        o.*,
        COALESCE(o.total_price, 0) AS total_price,
        COALESCE(o.discount_amount, 0) AS discount_amount,
        COALESCE(o.delivery_charge, 0) AS delivery_charge,
        COALESCE(o.refunded_amount, 0) AS refunded_amount,
        sa.address AS shipping_address,
        sa.city,
        sa.shipping_state,
        sa.zip_code,
        sa.country
      FROM "order" o
      LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
      WHERE o.order_id = $1
        AND o.customer_id = $2
      `,
      [orderId, customerId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const timelineRes = await pool.query(
      `
      SELECT
        status_type,
        status_time
      FROM order_status
      WHERE order_id = $1
      ORDER BY status_time ASC
      `,
      [orderId]
    );

    const itemsRes = await pool.query(
      `
      SELECT
        oi.order_item_id,
        oi.product_id,
        oi.qty,
        oi.price,
        COALESCE(oi.discount_amount, 0) AS discount_amount,
        COALESCE(oi.refunded_amount, 0) AS refunded_amount,
        oi.refund_status,
        oi.refunded_at,
        (oi.price * oi.qty) AS line_total,
        ((oi.price * oi.qty) + COALESCE(oi.discount_amount, 0)) AS original_line_total,
        oi.seller_status,
        oi.seller_confirmed_at,
        oi.seller_cancelled_at,
        oi.customer_cancelled_at,
        oi.cancelled_by,
        oi.cancel_reason,
        oi.delivery_status,
        p.product_name,
        s.store_name
      FROM order_item oi
      JOIN product p ON p.product_id = oi.product_id
      JOIN store s ON s.store_id = p.store_id
      WHERE oi.order_id = $1
      ORDER BY oi.order_item_id
      `,
      [orderId]
    );

    const trackerRes = await pool.query(
      `
      SELECT
        tracker_description,
        progress,
        estimated_delivery_date
      FROM tracker
      WHERE order_id = $1
      `,
      [orderId]
    );

    res.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
      timeline: timelineRes.rows,
      tracker: trackerRes.rows[0] || null,
    });
  } catch (e) {
    console.error("GET CUSTOMER ORDER DETAILS ERROR:", e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * =========================
 * PATCH /api/orders/:orderItemId/cancel
 * customer can cancel only when:
 * - seller_status === 'pending'
 * - delivery_status === 'not_ready'
 * =========================
 */
router.patch(
  "/:orderItemId/cancel",
  verifyToken,
  requireRole("customer"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const customerId = req.user.user_id;
      const orderItemId = Number(req.params.orderItemId);
      const { reason } = req.body;

      if (!orderItemId || Number.isNaN(orderItemId)) {
        return res.status(400).json({ message: "Invalid order item id" });
      }

      await client.query("BEGIN");

      const itemRes = await client.query(
        `
        SELECT
          oi.order_item_id,
          oi.order_id,
          oi.product_id,
          oi.qty,
          oi.price,
          COALESCE(oi.discount_amount, 0) AS discount_amount,
          oi.seller_status,
          oi.delivery_status,
          oi.cancelled_by,
          o.customer_id,
          COALESCE(o.total_price, 0) AS total_price,
          COALESCE(o.refunded_amount, 0) AS refunded_amount,
          o.payment_status
        FROM order_item oi
        JOIN "order" o ON o.order_id = oi.order_id
        WHERE oi.order_item_id = $1
          AND o.customer_id = $2
        FOR UPDATE
        `,
        [orderItemId, customerId]
      );

      if (itemRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order item not found" });
      }

      const item = itemRes.rows[0];

      if (item.cancelled_by) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Order item already cancelled" });
      }

      if (
        item.seller_status !== "pending" ||
        item.delivery_status !== "not_ready"
      ) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "This item can no longer be cancelled by customer",
        });
      }

      const allItemsRes = await client.query(
        `
        SELECT
          order_item_id,
          order_id,
          product_id,
          qty,
          price,
          COALESCE(discount_amount, 0) AS discount_amount,
          COALESCE(seller_status, 'pending') AS seller_status
        FROM order_item
        WHERE order_id = $1
        FOR UPDATE
        `,
        [item.order_id]
      );

      const shares = calculateItemShares(allItemsRes.rows, Number(item.total_price || 0));
      const target = shares.find((i) => Number(i.order_item_id) === Number(orderItemId));
      const reduction = Math.round(Number(target?.share || 0) * 100) / 100;

      const isPaidLike = ["paid", "partially_refunded", "refunded"].includes(
        String(item.payment_status || "").toLowerCase()
      );

      const refundAdd = isPaidLike ? reduction : 0;
      const refundStatus = refundAdd > 0 ? "refunded" : "not_refunded";
      const refundedAt = refundAdd > 0 ? new Date() : null;

      await client.query(
        `
        UPDATE order_item
        SET seller_status = 'cancelled',
            cancelled_by = 'customer',
            customer_cancelled_at = NOW(),
            cancel_reason = $2,
            delivery_status = 'not_ready',
            refunded_amount = $3,
            refund_status = $4,
            refunded_at = $5
        WHERE order_item_id = $1
        `,
        [
          orderItemId,
          reason || "Cancelled by customer",
          refundAdd,
          refundStatus,
          refundedAt,
        ]
      );

      await client.query(
        `
        UPDATE product
        SET product_count = COALESCE(product_count, 0) + $1
        WHERE product_id = $2
        `,
        [item.qty, item.product_id]
      );

      const newTotal = Math.max(
        0,
        Math.round((Number(item.total_price || 0) - reduction) * 100) / 100
      );

      const newRefund =
        Math.round((Number(item.refunded_amount || 0) + refundAdd) * 100) / 100;

      let newPaymentStatus = item.payment_status;
      if (newRefund > 0 && newTotal <= 0) {
        newPaymentStatus = "refunded";
      } else if (
        newRefund > 0 &&
        ["paid", "partially_refunded", "refunded"].includes(
          String(item.payment_status || "").toLowerCase()
        )
      ) {
        newPaymentStatus = "partially_refunded";
      }

      await client.query(
        `
        UPDATE "order"
        SET total_price = $1,
            refunded_amount = $2,
            payment_status = $3
        WHERE order_id = $4
        `,
        [newTotal, newRefund, newPaymentStatus, item.order_id]
      );

      await client.query("COMMIT");

      res.json({
        message: "Order item cancelled successfully",
        order_item_id: orderItemId,
        cancelled_item_share: reduction,
        refunded_amount: refundAdd,
        new_order_total: newTotal,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      console.error("CUSTOMER CANCEL ERROR:", e);
      res.status(500).json({ message: e.message || "Server error" });
    } finally {
      client.release();
    }
  }
);

export default router;

// import express from "express";
// import pool from "../db.js";
// import { verifyToken } from "../middleware/verifyToken.js";
// import { requireRole } from "../middleware/requireRole.js";

// const router = express.Router();

// /* =========================
//    HELPER: calculate item share
// ========================= */
// const calculateItemShares = (items, orderTotal) => {
//   const activeItems = items.filter(
//     (item) => String(item.seller_status || "pending").toLowerCase() !== "cancelled"
//   );

//   const baseItems = activeItems.map((item) => {
//     const base =
//       Number(item.price || 0) * Number(item.qty || 0) -
//       Number(item.discount_amount || 0);

//     return {
//       ...item,
//       base: Math.max(0, base),
//     };
//   });

//   const totalBase = baseItems.reduce((sum, i) => sum + i.base, 0);

//   if (baseItems.length === 0 || totalBase <= 0) {
//     return baseItems.map((item) => ({ ...item, share: 0 }));
//   }

//   const rawShares = baseItems.map((item) => ({
//     ...item,
//     share: (item.base / totalBase) * Number(orderTotal || 0),
//   }));

//   const roundedShares = rawShares.map((item) => ({
//     ...item,
//     share: Math.round(item.share * 100) / 100,
//   }));

//   const roundedSum = roundedShares.reduce((sum, item) => sum + item.share, 0);
//   const diff = Math.round((Number(orderTotal || 0) - roundedSum) * 100) / 100;

//   if (roundedShares.length > 0 && diff !== 0) {
//     roundedShares[roundedShares.length - 1].share =
//       Math.round((roundedShares[roundedShares.length - 1].share + diff) * 100) / 100;
//   }

//   return roundedShares;
// };

// /**
//  * =========================
//  * GET /api/orders
//  * customer: list my orders
//  * =========================
//  */
// router.get("/", verifyToken, requireRole("customer"), async (req, res) => {
//   try {
//     const customerId = req.user.user_id;

//     const { rows } = await pool.query(
//       `
//       SELECT
//         o.order_id,
//         o.address_id,
//         o.date_added,
//         o.payment_status,
//         o.payment_method,
//         COALESCE(o.total_price, 0) AS total_price,
//         COALESCE(o.discount_amount, 0) AS discount_amount,
//         COALESCE(o.delivery_charge, 0) AS delivery_charge,
//         COALESCE(o.refunded_amount, 0) AS refunded_amount,

//         sa.address AS shipping_address,
//         sa.city,
//         sa.shipping_state,
//         sa.zip_code,
//         sa.country

//       FROM "order" o
//       LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
//       WHERE o.customer_id = $1
//       ORDER BY o.date_added DESC
//       `,
//       [customerId]
//     );

//     res.json({ orders: rows });
//   } catch (e) {
//     console.error("GET CUSTOMER ORDERS ERROR:", e);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * =========================
//  * GET /api/orders/:id
//  * customer: order details + items + timeline
//  * =========================
//  */
// router.get("/:id", verifyToken, requireRole("customer"), async (req, res) => {
//   try {
//     const customerId = req.user.user_id;
//     const orderId = Number(req.params.id);

//     const orderRes = await pool.query(
//       `
//       SELECT
//         o.*,
//         COALESCE(o.total_price, 0) AS total_price,
//         COALESCE(o.discount_amount, 0) AS discount_amount,
//         COALESCE(o.delivery_charge, 0) AS delivery_charge,
//         COALESCE(o.refunded_amount, 0) AS refunded_amount,

//         sa.address AS shipping_address,
//         sa.city,
//         sa.shipping_state,
//         sa.zip_code,
//         sa.country

//       FROM "order" o
//       LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
//       WHERE o.order_id = $1
//         AND o.customer_id = $2
//       `,
//       [orderId, customerId]
//     );

//     if (orderRes.rows.length === 0) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const timelineRes = await pool.query(
//       `
//       SELECT
//         status_type,
//         status_time
//       FROM order_status
//       WHERE order_id = $1
//       ORDER BY status_time ASC
//       `,
//       [orderId]
//     );

//     const itemsRes = await pool.query(
//       `
//       SELECT
//         oi.order_item_id,
//         oi.product_id,
//         oi.qty,
//         oi.price,
//         COALESCE(oi.discount_amount, 0) AS discount_amount,
//         COALESCE(oi.refunded_amount, 0) AS refunded_amount,
//         oi.refund_status,
//         oi.refunded_at,

//         (oi.price * oi.qty) AS line_total,
//         ((oi.price * oi.qty) + COALESCE(oi.discount_amount, 0)) AS original_line_total,

//         oi.seller_status,
//         oi.seller_confirmed_at,
//         oi.seller_cancelled_at,
//         oi.customer_cancelled_at,
//         oi.cancelled_by,
//         oi.cancel_reason,
//         oi.delivery_status,

//         p.product_name,
//         s.store_name

//       FROM order_item oi
//       JOIN product p ON p.product_id = oi.product_id
//       JOIN store s ON s.store_id = p.store_id
//       WHERE oi.order_id = $1
//       ORDER BY oi.order_item_id
//       `,
//       [orderId]
//     );

//     const trackerRes = await pool.query(
//       `
//       SELECT
//         tracker_description,
//         progress,
//         estimated_delivery_date
//       FROM tracker
//       WHERE order_id = $1
//       `,
//       [orderId]
//     );

//     res.json({
//       order: orderRes.rows[0],
//       items: itemsRes.rows,
//       timeline: timelineRes.rows,
//       tracker: trackerRes.rows[0] || null,
//     });
//   } catch (e) {
//     console.error("GET CUSTOMER ORDER DETAILS ERROR:", e);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * =========================
//  * PATCH /api/orders/:orderItemId/cancel
//  * customer can cancel only when:
//  * - seller_status === 'pending'
//  * - delivery_status === 'not_ready'
//  * =========================
//  */
// router.patch(
//   "/:orderItemId/cancel",
//   verifyToken,
//   requireRole("customer"),
//   async (req, res) => {
//     const client = await pool.connect();

//     try {
//       const customerId = req.user.user_id;
//       const orderItemId = Number(req.params.orderItemId);
//       const { reason } = req.body;

//       if (!orderItemId || Number.isNaN(orderItemId)) {
//         return res.status(400).json({ message: "Invalid order item id" });
//       }

//       await client.query("BEGIN");

//       const itemRes = await client.query(
//         `
//         SELECT
//           oi.order_item_id,
//           oi.order_id,
//           oi.product_id,
//           oi.qty,
//           oi.price,
//           COALESCE(oi.discount_amount, 0) AS discount_amount,
//           oi.seller_status,
//           oi.delivery_status,
//           oi.cancelled_by,

//           o.customer_id,
//           COALESCE(o.total_price, 0) AS total_price,
//           COALESCE(o.refunded_amount, 0) AS refunded_amount,
//           o.payment_status

//         FROM order_item oi
//         JOIN "order" o ON o.order_id = oi.order_id
//         WHERE oi.order_item_id = $1
//           AND o.customer_id = $2
//         FOR UPDATE
//         `,
//         [orderItemId, customerId]
//       );

//       if (itemRes.rows.length === 0) {
//         await client.query("ROLLBACK");
//         return res.status(404).json({ message: "Order item not found" });
//       }

//       const item = itemRes.rows[0];

//       if (item.cancelled_by) {
//         await client.query("ROLLBACK");
//         return res.status(400).json({ message: "Order item already cancelled" });
//       }

//       if (
//         item.seller_status !== "pending" ||
//         item.delivery_status !== "not_ready"
//       ) {
//         await client.query("ROLLBACK");
//         return res.status(400).json({
//           message: "This item can no longer be cancelled by customer",
//         });
//       }

//       const allItemsRes = await client.query(
//         `
//         SELECT
//           order_item_id,
//           order_id,
//           product_id,
//           qty,
//           price,
//           COALESCE(discount_amount, 0) AS discount_amount,
//           COALESCE(seller_status, 'pending') AS seller_status
//         FROM order_item
//         WHERE order_id = $1
//         FOR UPDATE
//         `,
//         [item.order_id]
//       );

//       const shares = calculateItemShares(allItemsRes.rows, Number(item.total_price || 0));
//       const target = shares.find((i) => Number(i.order_item_id) === Number(orderItemId));
//       const reduction = Number(target?.share || 0);

//       const isPaidLike = ["paid", "partially_refunded", "refunded"].includes(
//         String(item.payment_status || "").toLowerCase()
//       );

//       const refundAdd = isPaidLike ? reduction : 0;

//       await client.query(
//         `
//         UPDATE order_item
//         SET seller_status = 'cancelled',
//             cancelled_by = 'customer',
//             customer_cancelled_at = NOW(),
//             cancel_reason = $2,
//             delivery_status = 'not_ready',
//             refunded_amount = $3,
//             refund_status = CASE
//               WHEN $3 > 0 THEN 'refunded'
//               ELSE COALESCE(refund_status, 'not_refunded')
//             END,
//             refunded_at = CASE
//               WHEN $3 > 0 THEN NOW()
//               ELSE refunded_at
//             END
//         WHERE order_item_id = $1
//         `,
//         [orderItemId, reason || "Cancelled by customer", refundAdd]
//       );

//       await client.query(
//         `
//         UPDATE product
//         SET product_count = COALESCE(product_count, 0) + $1
//         WHERE product_id = $2
//         `,
//         [item.qty, item.product_id]
//       );

//       const newTotal = Math.max(
//         0,
//         Math.round((Number(item.total_price || 0) - reduction) * 100) / 100
//       );

//       const newRefund = Math.round(
//         (Number(item.refunded_amount || 0) + refundAdd) * 100
//       ) / 100;

//       await client.query(
//         `
//         UPDATE "order"
//         SET total_price = $1,
//             refunded_amount = $2,
//             payment_status = CASE
//               WHEN $2 > 0 AND $1 <= 0 THEN 'refunded'
//               WHEN $2 > 0 AND LOWER(COALESCE(payment_status, '')) IN ('paid', 'partially_refunded', 'refunded')
//                 THEN 'partially_refunded'
//               ELSE payment_status
//             END
//         WHERE order_id = $3
//         `,
//         [newTotal, newRefund, item.order_id]
//       );

//       await client.query("COMMIT");

//       res.json({
//         message: "Order item cancelled successfully",
//         order_item_id: orderItemId,
//         cancelled_item_share: reduction,
//         refunded_amount: refundAdd,
//         new_order_total: newTotal,
//       });
//     } catch (e) {
//       await client.query("ROLLBACK");
//       console.error("CUSTOMER CANCEL ERROR:", e);
//       res.status(500).json({ message: "Server error" });
//     } finally {
//       client.release();
//     }
//   }
// );

// export default router;



// // import express from "express";
// // import pool from "../db.js";
// // import { verifyToken } from "../middleware/verifyToken.js";
// // import { requireRole } from "../middleware/requireRole.js";

// // const router = express.Router();

// // /**
// //  * =========================
// //  * GET /api/orders
// //  * customer: list my orders
// //  * =========================
// //  */
// // router.get("/", verifyToken, requireRole("customer"), async (req, res) => {
// //   try {
// //     const customerId = req.user.user_id;

// //     const { rows } = await pool.query(
// //       `
// //       SELECT
// //         o.order_id,
// //         o.address_id,
// //         o.date_added,
// //         o.payment_status,
// //         o.payment_method,
// //         o.total_price,
// //         o.discount_amount,
// //         o.delivery_charge,

// //         sa.address AS shipping_address,
// //         sa.city,
// //         sa.shipping_state,
// //         sa.zip_code,
// //         sa.country

// //       FROM "order" o
// //       LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
// //       WHERE o.customer_id = $1
// //       ORDER BY o.date_added DESC
// //       `,
// //       [customerId]
// //     );

// //     res.json({ orders: rows });
// //   } catch (e) {
// //     console.error("GET CUSTOMER ORDERS ERROR:", e);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // /**
// //  * =========================
// //  * GET /api/orders/:id
// //  * customer: order details + items + timeline
// //  * =========================
// //  */
// // router.get("/:id", verifyToken, requireRole("customer"), async (req, res) => {
// //   try {
// //     const customerId = req.user.user_id;
// //     const orderId = Number(req.params.id);

// //     const orderRes = await pool.query(
// //       `
// //       SELECT
// //         o.*,

// //         sa.address AS shipping_address,
// //         sa.city,
// //         sa.shipping_state,
// //         sa.zip_code,
// //         sa.country

// //       FROM "order" o
// //       LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
// //       WHERE o.order_id = $1
// //         AND o.customer_id = $2
// //       `,
// //       [orderId, customerId]
// //     );

// //     if (orderRes.rows.length === 0) {
// //       return res.status(404).json({ message: "Order not found" });
// //     }

// //     // const itemsRes = await pool.query(
// //     //   `
// //     //   SELECT
// //     //     oi.order_item_id,
// //     //     oi.product_id,
// //     //     oi.qty,
// //     //     oi.price,
// //     //     oi.discount_amount,
// //     //     oi.seller_status,
// //     //     oi.seller_confirmed_at,
// //     //     oi.seller_cancelled_at,
// //     //     oi.customer_cancelled_at,
// //     //     oi.cancelled_by,
// //     //     oi.cancel_reason,
// //     //     oi.delivery_status,
// //     //     p.product_name,
// //     //     s.store_name
// //     //   FROM order_item oi
// //     //   JOIN product p ON p.product_id = oi.product_id
// //     //   JOIN store s ON s.store_id = p.store_id
// //     //   WHERE oi.order_id = $1
// //     //   ORDER BY oi.order_item_id
// //     //   `,
// //     //   [orderId]
// //     // );

// //     // const timelineRes = await pool.query(
// //     //   `
// //     //   SELECT
// //     //     status_type,
// //     //     status_time
// //     //   FROM order_status
// //     //   WHERE order_id = $1
// //     //   ORDER BY status_time ASC
// //     //   `,
// //     //   [orderId]
// //     // );
    
    
// //     const itemsRes = await pool.query(
// //       `
// //       SELECT
// //         oi.order_item_id,
// //         oi.product_id,
// //         oi.qty,
// //         oi.price,
// //         COALESCE(oi.discount_amount, 0) AS discount_amount,

// //         (oi.price * oi.qty) AS line_total,
// //         ((oi.price * oi.qty) + COALESCE(oi.discount_amount, 0)) AS original_line_total,

// //         oi.seller_status,
// //         oi.seller_confirmed_at,
// //         oi.seller_cancelled_at,
// //         oi.customer_cancelled_at,
// //         oi.cancelled_by,
// //         oi.cancel_reason,
// //         oi.delivery_status,

// //         p.product_name,
// //         s.store_name

// //       FROM order_item oi
// //       JOIN product p ON p.product_id = oi.product_id
// //       JOIN store s ON s.store_id = p.store_id
// //       WHERE oi.order_id = $1
// //       ORDER BY oi.order_item_id
// //       `,
// //       [orderId]
// //     );

// //     const trackerRes = await pool.query(
// //       `
// //       SELECT
// //         tracker_description,
// //         progress,
// //         estimated_delivery_date
// //       FROM tracker
// //       WHERE order_id = $1
// //       `,
// //       [orderId]
// //     );

// //     res.json({
// //       order: orderRes.rows[0],
// //       items: itemsRes.rows,
// //       timeline: timelineRes.rows,
// //       tracker: trackerRes.rows[0] || null,
// //     });
// //   } catch (e) {
// //     console.error("GET CUSTOMER ORDER DETAILS ERROR:", e);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // /**
// //  * =========================
// //  * PATCH /api/orders/:orderItemId/cancel
// //  * =========================
// //  */
// // router.patch(
// //   "/:orderItemId/cancel",
// //   verifyToken,
// //   requireRole("customer"),
// //   async (req, res) => {
// //     const client = await pool.connect();

// //     try {
// //       const customerId = req.user.user_id;
// //       const orderItemId = Number(req.params.orderItemId);
// //       const { reason } = req.body;

// //       if (!orderItemId) {
// //         return res.status(400).json({ message: "Invalid order item id" });
// //       }

// //       await client.query("BEGIN");

// //       const { rows } = await client.query(
// //         `
// //         SELECT
// //           oi.order_item_id,
// //           oi.product_id,
// //           oi.qty,
// //           oi.seller_status,
// //           oi.delivery_status,
// //           oi.cancelled_by,
// //           o.customer_id
// //         FROM order_item oi
// //         JOIN "order" o ON o.order_id = oi.order_id
// //         WHERE oi.order_item_id = $1
// //           AND o.customer_id = $2
// //         `,
// //         [orderItemId, customerId]
// //       );

// //       if (rows.length === 0) {
// //         await client.query("ROLLBACK");
// //         return res.status(404).json({ message: "Order item not found" });
// //       }

// //       const item = rows[0];

// //       if (item.cancelled_by) {
// //         await client.query("ROLLBACK");
// //         return res.status(400).json({ message: "Order item already cancelled" });
// //       }

// //       if (
// //         item.seller_status !== "pending" ||
// //         item.delivery_status !== "not_ready"
// //       ) {
// //         await client.query("ROLLBACK");
// //         return res.status(400).json({
// //           message: "This item can no longer be cancelled by customer",
// //         });
// //       }

// //       await client.query(
// //         `
// //         UPDATE order_item
// //         SET seller_status = 'cancelled',
// //             cancelled_by = 'customer',
// //             customer_cancelled_at = NOW(),
// //             cancel_reason = $2,
// //             delivery_status = 'not_ready'
// //         WHERE order_item_id = $1
// //         `,
// //         [orderItemId, reason || "Cancelled by customer"]
// //       );

// //       await client.query(
// //         `
// //         UPDATE product
// //         SET product_count = COALESCE(product_count, 0) + $1
// //         WHERE product_id = $2
// //         `,
// //         [item.qty, item.product_id]
// //       );

// //       await client.query("COMMIT");

// //       res.json({ message: "Order item cancelled successfully" });
// //     } catch (e) {
// //       await client.query("ROLLBACK");
// //       console.error("CUSTOMER CANCEL ERROR:", e);
// //       res.status(500).json({ message: "Server error" });
// //     } finally {
// //       client.release();
// //     }
// //   }
// // );

// // export default router;


// // // import express from "express";
// // // import pool from "../db.js";
// // // import { verifyToken } from "../middleware/verifyToken.js";
// // // import { requireRole } from "../middleware/requireRole.js";

// // // const router = express.Router();

// // // /**
// // //  * GET /api/orders
// // //  * customer: list my orders
// // //  */
// // // router.get("/", verifyToken, requireRole("customer"), async (req, res) => {
// // //   try {
// // //     const customerId = req.user.user_id;

// // //     const { rows } = await pool.query(
// // //       `
// // //       SELECT
// // //         order_id,
// // //         date_added,
// // //         payment_status,
// // //         payment_method,
// // //         total_price,
// // //         discount_amount
// // //       FROM "order"
// // //       WHERE customer_id = $1
// // //       ORDER BY date_added DESC
// // //       `,
// // //       [customerId]
// // //     );

// // //     res.json({ orders: rows });
// // //   } catch (e) {
// // //     console.error("GET CUSTOMER ORDERS ERROR:", e);
// // //     res.status(500).json({ message: "Server error" });
// // //   }
// // // });

// // // /**
// // //  * GET /api/orders/:id
// // //  * customer: order details + items + timeline
// // //  */
// // // router.get("/:id", verifyToken, requireRole("customer"), async (req, res) => {
// // //   try {
// // //     const customerId = req.user.user_id;
// // //     const orderId = Number(req.params.id);

// // //     const orderRes = await pool.query(
// // //       `
// // //       SELECT o.*
// // //       FROM "order" o
// // //       WHERE o.order_id = $1
// // //         AND o.customer_id = $2
// // //       `,
// // //       [orderId, customerId]
// // //     );

// // //     if (orderRes.rows.length === 0) {
// // //       return res.status(404).json({ message: "Order not found" });
// // //     }

// // //     const itemsRes = await pool.query(
// // //       `
// // //       SELECT
// // //         oi.order_item_id,
// // //         oi.product_id,
// // //         oi.qty,
// // //         oi.price,
// // //         oi.discount_amount,
// // //         oi.seller_status,
// // //         oi.seller_confirmed_at,
// // //         oi.seller_cancelled_at,
// // //         oi.customer_cancelled_at,
// // //         oi.cancelled_by,
// // //         oi.cancel_reason,
// // //         oi.delivery_status,
// // //         p.product_name,
// // //         s.store_name
// // //       FROM order_item oi
// // //       JOIN product p ON p.product_id = oi.product_id
// // //       JOIN store s ON s.store_id = p.store_id
// // //       WHERE oi.order_id = $1
// // //       ORDER BY oi.order_item_id
// // //       `,
// // //       [orderId]
// // //     );

// // //     const timelineRes = await pool.query(
// // //       `
// // //       SELECT
// // //         status_type,
// // //         status_time
// // //       FROM order_status
// // //       WHERE order_id = $1
// // //       ORDER BY status_time ASC
// // //       `,
// // //       [orderId]
// // //     );

// // //     const trackerRes = await pool.query(
// // //       `
// // //       SELECT
// // //         tracker_description,
// // //         progress,
// // //         estimated_delivery_date
// // //       FROM tracker
// // //       WHERE order_id = $1
// // //       `,
// // //       [orderId]
// // //     );

// // //     res.json({
// // //       order: orderRes.rows[0],
// // //       items: itemsRes.rows,
// // //       timeline: timelineRes.rows,
// // //       tracker: trackerRes.rows[0] || null,
// // //     });
// // //   } catch (e) {
// // //     console.error("GET CUSTOMER ORDER DETAILS ERROR:", e);
// // //     res.status(500).json({ message: "Server error" });
// // //   }
// // // });

// // // /**
// // //  * PATCH /api/orders/:orderItemId/cancel
// // //  * customer: cancel own order item if still pending and not ready
// // //  */
// // // router.patch(
// // //   "/:orderItemId/cancel",
// // //   verifyToken,
// // //   requireRole("customer"),
// // //   async (req, res) => {
// // //     const client = await pool.connect();

// // //     try {
// // //       const customerId = req.user.user_id;
// // //       const orderItemId = Number(req.params.orderItemId);
// // //       const { reason } = req.body;

// // //       if (!orderItemId) {
// // //         return res.status(400).json({ message: "Invalid order item id" });
// // //       }

// // //       await client.query("BEGIN");

// // //       const { rows } = await client.query(
// // //         `
// // //         SELECT
// // //           oi.order_item_id,
// // //           oi.product_id,
// // //           oi.qty,
// // //           oi.seller_status,
// // //           oi.delivery_status,
// // //           oi.cancelled_by,
// // //           o.customer_id
// // //         FROM order_item oi
// // //         JOIN "order" o ON o.order_id = oi.order_id
// // //         WHERE oi.order_item_id = $1
// // //           AND o.customer_id = $2
// // //         `,
// // //         [orderItemId, customerId]
// // //       );

// // //       if (rows.length === 0) {
// // //         await client.query("ROLLBACK");
// // //         return res.status(404).json({ message: "Order item not found" });
// // //       }

// // //       const item = rows[0];

// // //       if (item.cancelled_by) {
// // //         await client.query("ROLLBACK");
// // //         return res.status(400).json({ message: "Order item already cancelled" });
// // //       }

// // //       if (
// // //         item.seller_status !== "pending" ||
// // //         item.delivery_status !== "not_ready"
// // //       ) {
// // //         await client.query("ROLLBACK");
// // //         return res.status(400).json({
// // //           message: "This item can no longer be cancelled by customer",
// // //         });
// // //       }

// // //       await client.query(
// // //         `
// // //         UPDATE order_item
// // //         SET seller_status = 'cancelled',
// // //             cancelled_by = 'customer',
// // //             customer_cancelled_at = NOW(),
// // //             cancel_reason = $2,
// // //             delivery_status = 'not_ready'
// // //         WHERE order_item_id = $1
// // //         `,
// // //         [orderItemId, reason || "Cancelled by customer"]
// // //       );

// // //       await client.query(
// // //         `
// // //         UPDATE product
// // //         SET product_count = COALESCE(product_count, 0) + $1
// // //         WHERE product_id = $2
// // //         `,
// // //         [item.qty, item.product_id]
// // //       );

// // //       await client.query("COMMIT");

// // //       res.json({ message: "Order item cancelled successfully" });
// // //     } catch (e) {
// // //       await client.query("ROLLBACK");
// // //       console.error("CUSTOMER CANCEL ERROR:", e);
// // //       res.status(500).json({ message: "Server error" });
// // //     } finally {
// // //       client.release();
// // //     }
// // //   }
// // // );

// // // export default router;