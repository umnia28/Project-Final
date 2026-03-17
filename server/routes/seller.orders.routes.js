import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/**
 * Helper:
 * Check whether this order_item belongs to the logged-in seller
 */
async function getSellerOwnedOrderItem(client, orderItemId, sellerId) {
  const { rows } = await client.query(
    `
    SELECT
      oi.order_item_id,
      oi.order_id,
      oi.product_id,
      oi.qty,
      oi.price,
      oi.discount_amount,
      COALESCE(oi.seller_status, 'pending') AS seller_status,
      oi.seller_confirmed_at,
      oi.seller_cancelled_at,
      oi.cancelled_by,
      oi.cancel_reason,
      COALESCE(oi.delivery_status, 'not_ready') AS delivery_status,

      p.product_name,
      p.store_id,
      p.product_count,

      st.user_id AS seller_user_id,

      o.customer_id,
      o.date_added,
      o.payment_status,
      o.payment_method,
      o.total_price,
      o.transaction_id
    FROM order_item oi
    JOIN product p ON p.product_id = oi.product_id
    JOIN store st ON st.store_id = p.store_id
    JOIN "order" o ON o.order_id = oi.order_id
    WHERE oi.order_item_id = $1
      AND st.user_id = $2
    LIMIT 1
    `,
    [orderItemId, sellerId]
  );

  return rows[0] || null;
}

/**
 * After seller actions, update overall order_status if all items are confirmed/cancelled.
 */
async function syncOrderLevelStatus(client, orderId) {
  const { rows } = await client.query(
    `
    SELECT
      COUNT(*) AS total_items,
      COUNT(*) FILTER (WHERE seller_status = 'confirmed') AS confirmed_items,
      COUNT(*) FILTER (WHERE seller_status = 'cancelled') AS cancelled_items,
      COUNT(*) FILTER (WHERE seller_status = 'pending') AS pending_items
    FROM order_item
    WHERE order_id = $1
    `,
    [orderId]
  );

  const stats = rows[0];
  const totalItems = Number(stats.total_items || 0);
  const confirmedItems = Number(stats.confirmed_items || 0);
  const cancelledItems = Number(stats.cancelled_items || 0);
  const pendingItems = Number(stats.pending_items || 0);

  let nextOrderStatus = null;

  if (totalItems > 0 && cancelledItems === totalItems) {
    nextOrderStatus = "cancelled";
  } else if (totalItems > 0 && confirmedItems === totalItems) {
    nextOrderStatus = "confirmed";
  } else if (confirmedItems > 0 && pendingItems > 0) {
    nextOrderStatus = "partially_confirmed";
  }

  if (nextOrderStatus) {
    await client.query(
      `
      INSERT INTO order_status (order_id, status_type, status_time)
      VALUES ($1, $2, NOW())
      `,
      [orderId, nextOrderStatus]
    );
  }
}

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
        COALESCE(oi.seller_status, 'pending') AS seller_status,
        oi.seller_confirmed_at,
        oi.seller_cancelled_at,
        oi.cancelled_by,
        oi.cancel_reason,
        COALESCE(oi.delivery_status, 'not_ready') AS delivery_status,

        u.user_id AS customer_id,
        u.username AS customer_username,
        u.email AS customer_email,

        (
          SELECT os.status_type
          FROM order_status os
          WHERE os.order_id = o.order_id
          ORDER BY os.status_time DESC
          LIMIT 1
        ) AS latest_order_status

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

    return res.json({ items: rows });
  } catch (err) {
    console.error("SELLER ORDERS ERROR:", err);
    return res.status(500).json({ message: "Server error while loading seller orders" });
  }
});

/**
 * PATCH /api/seller/orders/:orderItemId/confirm
 * Seller confirms one of their own order items
 */
router.patch(
  "/:orderItemId/confirm",
  verifyToken,
  requireRole("seller"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const sellerId = req.user.user_id;
      const orderItemId = Number(req.params.orderItemId);

      if (Number.isNaN(orderItemId) || orderItemId <= 0) {
        return res.status(400).json({ message: "Invalid order item id" });
      }

      await client.query("BEGIN");

      const item = await getSellerOwnedOrderItem(client, orderItemId, sellerId);

      if (!item) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order item not found" });
      }

      if (item.seller_status === "confirmed") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Item already confirmed" });
      }

      if (item.seller_status === "cancelled") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Cancelled item cannot be confirmed" });
      }

      await client.query(
        `
        UPDATE order_item
        SET seller_status = 'confirmed',
            seller_confirmed_at = NOW(),
            seller_cancelled_at = NULL,
            cancelled_by = NULL,
            cancel_reason = NULL,
            delivery_status = 'shipment_ready'
        WHERE order_item_id = $1
        `,
        [orderItemId]
      );

      await syncOrderLevelStatus(client, item.order_id);

      await client.query("COMMIT");

      return res.json({
        success: true,
        message: "Order item confirmed successfully",
        order_item_id: orderItemId,
        seller_status: "confirmed",
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("SELLER CONFIRM ERROR:", err);
      return res.status(500).json({ message: "Server error while confirming order item" });
    } finally {
      client.release();
    }
  }
);

/**
 * PATCH /api/seller/orders/:orderItemId/cancel
 * Seller cancels one of their own order items and restocks automatically
 */
router.patch(
  "/:orderItemId/cancel",
  verifyToken,
  requireRole("seller"),
  async (req, res) => {
    const client = await pool.connect();

    try {
      const sellerId = req.user.user_id;
      const orderItemId = Number(req.params.orderItemId);
      const reason = (req.body?.reason || "Cancelled by seller").trim();

      if (Number.isNaN(orderItemId) || orderItemId <= 0) {
        return res.status(400).json({ message: "Invalid order item id" });
      }

      await client.query("BEGIN");

      const item = await getSellerOwnedOrderItem(client, orderItemId, sellerId);

      if (!item) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order item not found" });
      }

      if (item.seller_status === "cancelled") {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Item already cancelled" });
      }

      await client.query(
        `
        UPDATE product
        SET product_count = COALESCE(product_count, 0) + $1
        WHERE product_id = $2
        `,
        [item.qty, item.product_id]
      );

      await client.query(
        `
        UPDATE order_item
        SET seller_status = 'cancelled',
            seller_cancelled_at = NOW(),
            cancel_reason = $2,
            cancelled_by = 'seller',
            delivery_status = 'delivery_cancelled'
        WHERE order_item_id = $1
        `,
        [orderItemId, reason || null]
      );

      await syncOrderLevelStatus(client, item.order_id);

      await client.query("COMMIT");

      return res.json({
        success: true,
        message: "Order item cancelled and stock restored",
        order_item_id: orderItemId,
        seller_status: "cancelled",
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("SELLER CANCEL ERROR:", err);
      return res.status(500).json({ message: "Server error while cancelling order item" });
    } finally {
      client.release();
    }
  }
);

export default router;