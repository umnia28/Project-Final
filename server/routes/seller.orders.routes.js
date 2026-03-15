import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/**
 * GET /api/seller/orders
 * Returns order items for products owned by this seller.
 */
router.get("/", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user.user_id;

    const { rows } = await pool.query(
      `
  SELECT
    o.order_id,
    o.date_added,
    o.payment_status,
    o.payment_method,
    o.total_price,
    o.transaction_id,

    oi.order_item_id,
    oi.product_id,
    p.product_name,
    oi.qty,
    oi.price,
    oi.discount_amount,
    oi.seller_status,
    oi.seller_confirmed_at,
    oi.seller_cancelled_at,
    oi.cancelled_by,
    oi.cancel_reason,
    oi.delivery_status,

    u.user_id AS customer_id,
    u.username AS customer_username,
    u.email AS customer_email,

    (
      SELECT os.status_type
      FROM order_status os
      WHERE os.order_id = o.order_id
      ORDER BY os.status_time DESC
      LIMIT 1
    ) AS latest_status

  FROM order_item oi
  JOIN product p ON p.product_id = oi.product_id
  JOIN store st ON st.store_id = p.store_id
  JOIN "order" o ON o.order_id = oi.order_id
  JOIN users u ON u.user_id = o.customer_id

  WHERE st.user_id = $1
  ORDER BY o.date_added DESC, oi.order_item_id DESC
  `,
      [sellerId]
    );
    res.json({ items: rows });
  } catch (err) {
    console.error("SELLER ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/seller/orders/:orderItemId/confirm
 * Seller confirms their product in an order
 */
router.patch(
  "/:orderItemId/confirm",
  verifyToken,
  requireRole("seller"),
  async (req, res) => {
    try {
      const sellerId = req.user.user_id;
      const orderItemId = req.params.orderItemId;

      // Check that the item belongs to this seller
      const { rows } = await pool.query(
        `
        SELECT oi.order_item_id
        FROM order_item oi
        JOIN product p ON p.product_id = oi.product_id
        JOIN store st ON st.store_id = p.store_id
        WHERE oi.order_item_id = $1
        AND st.user_id = $2
        `,
        [orderItemId, sellerId]
      );

      if (rows.length === 0) {
        return res.status(403).json({ message: "Not your order item" });
      }

      // Update seller_status
      await pool.query(
        `
          UPDATE order_item
          SET seller_status = 'confirmed',
          seller_confirmed_at = NOW(),
          delivery_status = 'shipment_ready'
          WHERE order_item_id = $1
        `,
        [orderItemId]
      );

      res.json({ message: "Order item confirmed" });

    } catch (err) {
      console.error("SELLER CONFIRM ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * PATCH /api/seller/orders/:orderItemId/cancel
 * Seller cancels their product in an order and restores stock
 */
router.patch(
  "/:orderItemId/cancel",
  verifyToken,
  requireRole("seller"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const sellerId = req.user.user_id;
      const orderItemId = req.params.orderItemId;
      const { reason } = req.body;

      await client.query("BEGIN");

      // Check that the item belongs to this seller
      // Also get qty and product_id for restocking
      const { rows } = await client.query(
        `
        SELECT
          oi.order_item_id,
          oi.product_id,
          oi.qty,
          oi.seller_status
        FROM order_item oi
        JOIN product p ON p.product_id = oi.product_id
        JOIN store st ON st.store_id = p.store_id
        WHERE oi.order_item_id = $1
          AND st.user_id = $2
        `,
        [orderItemId, sellerId]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(403).json({ message: "Not your order item" });
      }

      const item = rows[0];

      if (item.seller_status === "cancelled") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Order item already cancelled" });
      }

      // Update order item status
      await client.query(
        `
        UPDATE order_item
        SET seller_status = 'cancelled',
        seller_cancelled_at = NOW(),
        cancel_reason = $2,
        cancelled_by = 'seller',
        delivery_status = 'not_ready'
        WHERE order_item_id = $1
        `,
        [orderItemId, reason || "Cancelled by seller"]
      );

      // Restore product stock
      // Change product_count if your stock column name is different
      await client.query(
        `
        UPDATE product
        SET product_count = COALESCE(product_count, 0) + $1
        WHERE product_id = $2
        `,
        [item.qty, item.product_id]
      );

      await client.query("COMMIT");

      res.json({ message: "Order item cancelled and stock restored" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("SELLER CANCEL ERROR:", err);
      res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  }
);

export default router;
