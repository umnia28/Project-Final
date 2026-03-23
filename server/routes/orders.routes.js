import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:orderId/timeline", verifyToken, async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);

    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const orderRes = await pool.query(
      `
      SELECT
        o.order_id,
        o.date_added,
        o.delivery_time,
        o.payment_status
      FROM "order" o
      WHERE o.order_id = $1
      `,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    const statusRes = await pool.query(
      `
      SELECT
        os.order_status_id,
        os.status_type,
        os.status_time,
        os.updated_by,
        u.username AS updated_by_username
      FROM order_status os
      LEFT JOIN users u ON u.user_id = os.updated_by
      WHERE os.order_id = $1
      ORDER BY os.status_time ASC
      `,
      [orderId]
    );

    const itemsRes = await pool.query(
      `
      SELECT
        oi.order_item_id,
        COALESCE(oi.seller_status, 'pending') AS seller_status,
        COALESCE(oi.delivery_status, 'not_ready') AS delivery_status,
        oi.cancelled_by
      FROM order_item oi
      WHERE oi.order_id = $1
      `,
      [orderId]
    );

    const timeline = [...statusRes.rows];

    const existingStatuses = new Set(
      timeline.map((row) => String(row.status_type || "").toLowerCase())
    );

    const items = itemsRes.rows || [];
    const activeItems = items.filter((i) => !i.cancelled_by);

    const hasOutForDelivery = activeItems.some(
      (i) =>
        i.delivery_status === "out_for_delivery" ||
        i.delivery_status === "delivered"
    );

    const allDelivered =
      activeItems.length > 0 &&
      activeItems.every((i) => i.delivery_status === "delivered");

    const allCancelled =
      items.length > 0 &&
      items.every((i) => i.cancelled_by || i.seller_status === "cancelled");

    if (!existingStatuses.has("placed")) {
      timeline.unshift({
        order_status_id: null,
        status_type: "placed",
        status_time: order.date_added,
        updated_by: null,
        updated_by_username: null,
      });
      existingStatuses.add("placed");
    }

    if (
      hasOutForDelivery &&
      !existingStatuses.has("out_for_delivery")
    ) {
      timeline.push({
        order_status_id: null,
        status_type: "out_for_delivery",
        status_time: order.delivery_time || new Date().toISOString(),
        updated_by: null,
        updated_by_username: "system",
      });
      existingStatuses.add("out_for_delivery");
    }

    if (allDelivered && !existingStatuses.has("delivered")) {
      timeline.push({
        order_status_id: null,
        status_type: "delivered",
        status_time: order.delivery_time || new Date().toISOString(),
        updated_by: null,
        updated_by_username: "system",
      });
      existingStatuses.add("delivered");
    }

    if (allCancelled && !existingStatuses.has("cancelled")) {
      timeline.push({
        order_status_id: null,
        status_type: "cancelled",
        status_time: new Date().toISOString(),
        updated_by: null,
        updated_by_username: "system",
      });
      existingStatuses.add("cancelled");
    }

    if (
      order.payment_status === "partially_refunded" &&
      !existingStatuses.has("partially_refunded")
    ) {
      timeline.push({
        order_status_id: null,
        status_type: "partially_refunded",
        status_time: new Date().toISOString(),
        updated_by: null,
        updated_by_username: "system",
      });
      existingStatuses.add("partially_refunded");
    }

    if (
      order.payment_status === "refunded" &&
      !existingStatuses.has("refunded")
    ) {
      timeline.push({
        order_status_id: null,
        status_type: "refunded",
        status_time: new Date().toISOString(),
        updated_by: null,
        updated_by_username: "system",
      });
      existingStatuses.add("refunded");
    }

    timeline.sort(
      (a, b) => new Date(a.status_time).getTime() - new Date(b.status_time).getTime()
    );

    return res.json({ timeline });
  } catch (err) {
    console.error("TIMELINE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;


// import express from "express";
// import pool from "../db.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// /**
//  * GET /api/orders/:orderId/timeline
//  * Anyone logged in can view for now (later you can restrict to owner/seller/admin).
//  */
// router.get("/:orderId/timeline", verifyToken, async (req, res) => {
//   try {
//     const orderId = Number(req.params.orderId);

//     const { rows } = await pool.query(
//       `
//       SELECT
//         os.order_status_id,
//         os.status_type,
//         os.status_time,
//         os.updated_by,
//         u.username AS updated_by_username
//       FROM order_status os
//       LEFT JOIN users u ON u.user_id = os.updated_by
//       WHERE os.order_id = $1
//       ORDER BY os.status_time ASC
//       `,
//       [orderId]
//     );

//     res.json({ timeline: rows });
//   } catch (err) {
//     console.error("TIMELINE ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
