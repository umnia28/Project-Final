import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/**
 * GET /api/orders
 * customer: list my orders
 */
router.get("/", verifyToken, requireRole("customer"), async (req, res) => {
  try {
    const customerId = req.user.user_id;

    const { rows } = await pool.query(
      `
      SELECT
        order_id,
        date_added,
        payment_status,
        payment_method,
        total_price,
        discount_amount
      FROM "order"
      WHERE customer_id = $1
      ORDER BY date_added DESC
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
 * GET /api/orders/:id
 * customer: order details + items + timeline
 */
router.get("/:id", verifyToken, requireRole("customer"), async (req, res) => {
  try {
    const customerId = req.user.user_id;
    const orderId = Number(req.params.id);

    const orderRes = await pool.query(
      `
      SELECT o.*
      FROM "order" o
      WHERE o.order_id = $1
        AND o.customer_id = $2
      `,
      [orderId, customerId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemsRes = await pool.query(
      `
      SELECT
        oi.order_item_id,
        oi.product_id,
        oi.qty,
        oi.price,
        oi.discount_amount,
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
 * PATCH /api/orders/:orderItemId/cancel
 * customer: cancel own order item if still pending and not ready
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

      if (!orderItemId) {
        return res.status(400).json({ message: "Invalid order item id" });
      }

      await client.query("BEGIN");

      const { rows } = await client.query(
        `
        SELECT
          oi.order_item_id,
          oi.product_id,
          oi.qty,
          oi.seller_status,
          oi.delivery_status,
          oi.cancelled_by,
          o.customer_id
        FROM order_item oi
        JOIN "order" o ON o.order_id = oi.order_id
        WHERE oi.order_item_id = $1
          AND o.customer_id = $2
        `,
        [orderItemId, customerId]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order item not found" });
      }

      const item = rows[0];

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

      await client.query(
        `
        UPDATE order_item
        SET seller_status = 'cancelled',
            cancelled_by = 'customer',
            customer_cancelled_at = NOW(),
            cancel_reason = $2,
            delivery_status = 'not_ready'
        WHERE order_item_id = $1
        `,
        [orderItemId, reason || "Cancelled by customer"]
      );

      await client.query(
        `
        UPDATE product
        SET product_count = COALESCE(product_count, 0) + $1
        WHERE product_id = $2
        `,
        [item.qty, item.product_id]
      );

      await client.query("COMMIT");

      res.json({ message: "Order item cancelled successfully" });
    } catch (e) {
      await client.query("ROLLBACK");
      console.error("CUSTOMER CANCEL ERROR:", e);
      res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  }
);

export default router;