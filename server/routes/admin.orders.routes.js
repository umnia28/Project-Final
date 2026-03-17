import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

// helper: restock base products (simple version)
async function restockOrderItems(client, orderId) {
  const { rows } = await client.query(
    `SELECT product_id, qty FROM order_item WHERE order_id=$1`,
    [orderId]
  );

  for (const r of rows) {
    await client.query(
      `UPDATE product SET product_count = product_count + $1 WHERE product_id=$2`,
      [r.qty, r.product_id]
    );
  }
}

/* =========================
   GET ALL ORDERS FOR ADMIN
   GET /api/admin/orders
========================= */
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const ordersRes = await pool.query(
        `
        WITH latest_status AS (
          SELECT DISTINCT ON (os.order_id)
            os.order_id,
            os.status_type,
            os.status_time
          FROM order_status os
          ORDER BY os.order_id, os.status_time DESC
        )
        SELECT
          o.order_id,
          o.customer_id,
          o.address_id,
          o.delivery_man_id,
          o.date_added,
          o.payment_method,
          o.payment_status,
          o.delivery_charge,
          o.discount_amount,
          o.total_price,
          o.transaction_id,
          o.delivery_time,
          o.reason_for_cancellation,

          COALESCE(ls.status_type, 'placed') AS latest_status,

          cu.username AS customer_username,
          cu.full_name AS customer_full_name,
          cu.email AS customer_email,

          sa.address AS shipping_address,
          sa.city,
          sa.shipping_state,
          sa.zip_code,
          sa.country,

          dmu.username AS delivery_man_username,
          dmu.full_name AS delivery_man_full_name

        FROM "order" o
        LEFT JOIN latest_status ls ON ls.order_id = o.order_id
        LEFT JOIN users cu ON cu.user_id = o.customer_id
        LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
        LEFT JOIN users dmu ON dmu.user_id = o.delivery_man_id
        ORDER BY o.date_added DESC
        `
      );

      const itemsRes = await pool.query(
        `
        SELECT
          oi.order_item_id,
          oi.order_id,
          oi.product_id,
          oi.qty,
          oi.price,
          oi.discount_amount,
          oi.seller_status,
          oi.delivery_status,
          oi.cancelled_by,
          p.product_name
        FROM order_item oi
        JOIN product p ON p.product_id = oi.product_id
        ORDER BY oi.order_id DESC, oi.order_item_id ASC
        `
      );

      const itemsByOrder = {};
      for (const item of itemsRes.rows) {
        if (!itemsByOrder[item.order_id]) {
          itemsByOrder[item.order_id] = [];
        }
        itemsByOrder[item.order_id].push(item);
      }

      const orders = ordersRes.rows.map((order) => ({
        ...order,
        items: itemsByOrder[order.order_id] || [],
      }));

      return res.json({ orders });
    } catch (err) {
      console.error("GET ADMIN ORDERS ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* =========================
   GET ALL DELIVERY MEN
   GET /api/admin/orders/delivery-men
========================= */
router.get(
  "/delivery-men",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          d.user_id,
          u.username,
          u.full_name,
          u.email,
          u.contact_no,
          u.status,
          d.joining_date,
          d.salary,
          d.total_orders
        FROM delivery_man d
        JOIN users u ON u.user_id = d.user_id
        ORDER BY d.total_orders ASC, u.username ASC
        `
      );

      return res.json({ deliveryMen: result.rows });
    } catch (err) {
      console.error("GET ALL DELIVERY MEN ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

/* =========================
   ASSIGN DELIVERY MAN TO ORDER
   PATCH /api/admin/orders/:orderId/assign-delivery
   body: { delivery_man_id }
========================= */
router.patch(
  "/:orderId/assign-delivery",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const adminUserId = req.user.user_id;
      const orderId = Number(req.params.orderId);
      const { delivery_man_id } = req.body;

      if (!orderId || Number.isNaN(orderId)) {
        return res.status(400).json({ message: "Valid orderId is required" });
      }

      if (!delivery_man_id) {
        return res.status(400).json({ message: "delivery_man_id is required" });
      }

      await client.query("BEGIN");

      const orderRes = await client.query(
        `
        SELECT o.order_id, o.delivery_man_id
        FROM "order" o
        WHERE o.order_id = $1
        FOR UPDATE
        `,
        [orderId]
      );

      if (orderRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order not found" });
      }

      const previousDeliveryManId = orderRes.rows[0].delivery_man_id;

      const latestStatusRes = await client.query(
        `
        SELECT status_type
        FROM order_status
        WHERE order_id = $1
        ORDER BY status_time DESC
        LIMIT 1
        `,
        [orderId]
      );

      const currentStatus =
        latestStatusRes.rows[0]?.status_type?.toLowerCase() || "placed";

      if (currentStatus === "delivered" || currentStatus === "cancelled") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Cannot assign delivery man to delivered or cancelled order",
        });
      }

      const itemStatsRes = await client.query(
        `
        SELECT
          COUNT(*) AS total_items,
          COUNT(*) FILTER (WHERE seller_status = 'pending') AS pending_items,
          COUNT(*) FILTER (WHERE seller_status = 'confirmed') AS confirmed_items,
          COUNT(*) FILTER (WHERE seller_status = 'cancelled') AS cancelled_items
        FROM order_item
        WHERE order_id = $1
        `,
        [orderId]
      );

      const stats = itemStatsRes.rows[0];

      const totalItems = Number(stats.total_items || 0);
      const pendingItems = Number(stats.pending_items || 0);
      const confirmedItems = Number(stats.confirmed_items || 0);

      if (totalItems === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Order has no items" });
      }

      if (pendingItems > 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message:
            "Cannot assign delivery man until all items are processed by sellers",
        });
      }

      if (confirmedItems === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "No confirmed items available for delivery",
        });
      }

      const deliveryManRes = await client.query(
        `
        SELECT d.user_id, u.username, u.full_name, u.status
        FROM delivery_man d
        JOIN users u ON u.user_id = d.user_id
        WHERE d.user_id = $1
        `,
        [delivery_man_id]
      );

      if (deliveryManRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Delivery man not found" });
      }

      if (deliveryManRes.rows[0].status !== "active") {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Delivery man account is not active",
        });
      }

      if (
        previousDeliveryManId &&
        String(previousDeliveryManId) === String(delivery_man_id)
      ) {
        await client.query("COMMIT");
        return res.json({
          message: "This delivery man is already assigned to the order",
          order_id: orderId,
          delivery_man_id,
        });
      }

      await client.query(
        `
        UPDATE "order"
        SET delivery_man_id = $1
        WHERE order_id = $2
        `,
        [delivery_man_id, orderId]
      );

      const statusToInsert =
        previousDeliveryManId &&
        String(previousDeliveryManId) !== String(delivery_man_id)
          ? "reassigned"
          : "assigned";

      await client.query(
        `
        INSERT INTO order_status (order_id, status_type, updated_by)
        VALUES ($1, $2, $3)
        `,
        [orderId, statusToInsert, adminUserId]
      );

      await client.query(
        `
        INSERT INTO notification (user_id, notification_description)
        VALUES ($1, $2)
        `,
        [
          delivery_man_id,
          `Order #${orderId} has been assigned to you.`,
        ]
      );

      if (
        previousDeliveryManId &&
        String(previousDeliveryManId) !== String(delivery_man_id)
      ) {
        await client.query(
          `
          INSERT INTO notification (user_id, notification_description)
          VALUES ($1, $2)
          `,
          [
            previousDeliveryManId,
            `Order #${orderId} has been reassigned to another delivery man.`,
          ]
        );
      }

      await client.query("COMMIT");

      return res.json({
        message: "Delivery man assigned successfully",
        order_id: orderId,
        delivery_man_id,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("ASSIGN DELIVERY MAN ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  }
);

/**
 * PATCH /api/admin/orders/:orderId/out-for-delivery
 */
router.patch(
  "/:orderId/out-for-delivery",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const adminId = req.user.user_id;
      const orderId = Number(req.params.orderId);

      if (!orderId || Number.isNaN(orderId)) {
        return res.status(400).json({ message: "Valid orderId is required" });
      }

      await client.query("BEGIN");

      const orderRes = await client.query(
        `
        SELECT order_id, delivery_man_id
        FROM "order"
        WHERE order_id = $1
        FOR UPDATE
        `,
        [orderId]
      );

      if (orderRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order not found" });
      }

      const order = orderRes.rows[0];

      if (!order.delivery_man_id) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Assign a delivery man first" });
      }

      const latestStatusRes = await client.query(
        `
        SELECT status_type
        FROM order_status
        WHERE order_id = $1
        ORDER BY status_time DESC
        LIMIT 1
        `,
        [orderId]
      );

      const currentStatus =
        latestStatusRes.rows[0]?.status_type?.toLowerCase() || "placed";

      if (currentStatus === "cancelled" || currentStatus === "refunded") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Cancelled/refunded order cannot be delivered" });
      }

      if (currentStatus === "delivered") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Order already delivered" });
      }

      await client.query(
        `
        UPDATE "order"
        SET delivery_time = NOW()
        WHERE order_id = $1
        `,
        [orderId]
      );

      await client.query(
        `
        UPDATE order_item
        SET delivery_status = 'out_for_delivery'
        WHERE order_id = $1
          AND seller_status = 'confirmed'
          AND cancelled_by IS NULL
        `,
        [orderId]
      );

      await client.query(
        `
        INSERT INTO order_status (order_id, status_type, updated_by)
        VALUES ($1, 'out_for_delivery', $2)
        `,
        [orderId, adminId]
      );

      await client.query("COMMIT");

      return res.json({
        message: "Order marked as out for delivery",
        order_id: orderId,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("OUT FOR DELIVERY ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  }
);

/**
 * PATCH /api/admin/orders/:orderId/delivered
 */
router.patch(
  "/:orderId/delivered",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const adminId = req.user.user_id;
      const orderId = Number(req.params.orderId);

      if (!orderId || Number.isNaN(orderId)) {
        return res.status(400).json({ message: "Valid orderId is required" });
      }

      await client.query("BEGIN");

      const orderRes = await client.query(
        `
        SELECT order_id
        FROM "order"
        WHERE order_id = $1
        FOR UPDATE
        `,
        [orderId]
      );

      if (orderRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order not found" });
      }

      const latestStatusRes = await client.query(
        `
        SELECT status_type
        FROM order_status
        WHERE order_id = $1
        ORDER BY status_time DESC
        LIMIT 1
        `,
        [orderId]
      );

      const currentStatus =
        latestStatusRes.rows[0]?.status_type?.toLowerCase() || "placed";

      if (currentStatus === "cancelled" || currentStatus === "refunded") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Cancelled/refunded order cannot be delivered" });
      }

      if (currentStatus === "delivered") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Order already delivered" });
      }

      await client.query(
        `
        UPDATE order_item
        SET delivery_status = 'delivered'
        WHERE order_id = $1
          AND seller_status = 'confirmed'
          AND cancelled_by IS NULL
        `,
        [orderId]
      );

      await client.query(
        `
        INSERT INTO order_status (order_id, status_type, updated_by)
        VALUES ($1, 'delivered', $2)
        `,
        [orderId, adminId]
      );

      await client.query("COMMIT");

      return res.json({
        message: "Order marked as delivered",
        order_id: orderId,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("DELIVERED ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  }
);

/**
 * POST /api/admin/orders/:orderId/cancel
 * body: { reason? }
 */
router.post("/:orderId/cancel", verifyToken, requireRole("admin"), async (req, res) => {
  const client = await pool.connect();
  try {
    const adminId = req.user.user_id;
    const orderId = Number(req.params.orderId);
    const reason = req.body?.reason || "Cancelled by admin";

    await client.query("BEGIN");

    const o = await client.query(
      `SELECT order_id, payment_status FROM "order" WHERE order_id=$1 FOR UPDATE`,
      [orderId]
    );
    if (o.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    const already = await client.query(
      `SELECT 1 FROM order_status WHERE order_id=$1 AND status_type='cancelled' LIMIT 1`,
      [orderId]
    );
    if (already.rowCount > 0) {
      await client.query("COMMIT");
      return res.json({ message: "Already cancelled", order_id: orderId });
    }

    await client.query(
      `UPDATE "order" SET reason_for_cancellation=$1 WHERE order_id=$2`,
      [reason, orderId]
    );

    await client.query(
      `INSERT INTO order_status(order_id, status_type, updated_by) VALUES ($1,'cancelled',$2)`,
      [orderId, adminId]
    );

    await restockOrderItems(client, orderId);

    await client.query("COMMIT");
    res.json({ message: "Order cancelled ✅", order_id: orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ADMIN CANCEL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * POST /api/admin/orders/:orderId/refund
 * body: { reason? }
 */
router.post("/:orderId/refund", verifyToken, requireRole("admin"), async (req, res) => {
  const client = await pool.connect();

  try {
    const adminId = req.user.user_id;
    const orderId = Number(req.params.orderId);
    const reason = req.body?.reason || "Refunded by admin";

    await client.query("BEGIN");

    const orderRes = await client.query(
      `
      SELECT
        o.order_id,
        o.payment_status,
        o.total_price,
        o.refunded_amount,
        o.delivery_charge
      FROM "order" o
      WHERE o.order_id = $1
      FOR UPDATE
      `,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    if (!["paid", "partially_refunded"].includes(order.payment_status)) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Only paid or partially refunded orders can be refunded",
      });
    }

    const cancelledItemsRes = await client.query(
      `
      SELECT
        oi.order_item_id,
        oi.qty,
        oi.price,
        oi.discount_amount,
        oi.refund_status,
        oi.cancelled_by
      FROM order_item oi
      WHERE oi.order_id = $1
        AND oi.seller_status = 'cancelled'
        AND oi.refund_status = 'not_refunded'
      FOR UPDATE
      `,
      [orderId]
    );

    if (cancelledItemsRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "No cancelled items available for refund",
      });
    }

    const allItemsStatsRes = await client.query(
      `
      SELECT
        COUNT(*) AS total_items,
        COUNT(*) FILTER (WHERE seller_status = 'confirmed') AS confirmed_items,
        COUNT(*) FILTER (WHERE seller_status = 'pending') AS pending_items,
        COUNT(*) FILTER (WHERE seller_status = 'cancelled') AS cancelled_items
      FROM order_item
      WHERE order_id = $1
      `,
      [orderId]
    );

    const stats = allItemsStatsRes.rows[0];
    const totalItems = Number(stats.total_items || 0);
    const confirmedItems = Number(stats.confirmed_items || 0);
    const pendingItems = Number(stats.pending_items || 0);
    const cancelledItems = Number(stats.cancelled_items || 0);

    let cancelledItemsRefund = 0;

    for (const item of cancelledItemsRes.rows) {
      const lineTotal = Number(item.price) * Number(item.qty);
      const lineDiscount = Number(item.discount_amount || 0);
      const refundableLineAmount = lineTotal - lineDiscount;
      cancelledItemsRefund += refundableLineAmount;
    }

    const alreadyRefunded = Number(order.refunded_amount || 0);
    const orderTotal = Number(order.total_price || 0);

    let refundAmount = cancelledItemsRefund;

    const wholeOrderCancelled =
      totalItems > 0 &&
      confirmedItems === 0 &&
      pendingItems === 0 &&
      cancelledItems === totalItems;

    if (wholeOrderCancelled) {
      const remainingToFullRefund = orderTotal - alreadyRefunded;
      refundAmount = remainingToFullRefund;
    }

    if (refundAmount <= 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "No refundable amount found",
      });
    }

    for (const item of cancelledItemsRes.rows) {
      const lineTotal = Number(item.price) * Number(item.qty);
      const lineDiscount = Number(item.discount_amount || 0);
      const refundableLineAmount = lineTotal - lineDiscount;

      await client.query(
        `
        UPDATE order_item
        SET refund_status = 'refunded',
            refunded_amount = $2,
            refunded_at = NOW()
        WHERE order_item_id = $1
        `,
        [item.order_item_id, refundableLineAmount]
      );
    }

    const newRefundedAmount = alreadyRefunded + refundAmount;

    let nextPaymentStatus = "partially_refunded";
    if (newRefundedAmount >= orderTotal) {
      nextPaymentStatus = "refunded";
    }

    await client.query(
      `
      UPDATE "order"
      SET payment_status = $1,
          refunded_amount = $2,
          reason_for_cancellation = $3
      WHERE order_id = $4
      `,
      [nextPaymentStatus, newRefundedAmount, reason, orderId]
    );

    await client.query(
      `
      INSERT INTO order_status (order_id, status_type, updated_by)
      VALUES ($1, $2, $3)
      `,
      [orderId, nextPaymentStatus === "refunded" ? "refunded" : "partially_refunded", adminId]
    );

    await client.query("COMMIT");

    return res.json({
      message:
        nextPaymentStatus === "refunded"
          ? "Full refund processed successfully"
          : "Partial refund processed successfully",
      order_id: orderId,
      refund_amount: refundAmount,
      refunded_amount_total: newRefundedAmount,
      payment_status: nextPaymentStatus,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ADMIN REFUND ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;