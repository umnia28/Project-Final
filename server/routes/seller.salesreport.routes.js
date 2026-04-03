import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/*
  GET /api/seller/sales-report
*/
router.get("/sales-report", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerUserId = req.user.user_id;

    const storeResult = await pool.query(
      `
      SELECT store_id, store_name
      FROM store
      WHERE user_id = $1
      LIMIT 1
      `,
      [sellerUserId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    const store = storeResult.rows[0];
    const storeId = store.store_id;

    const summaryResult = await pool.query(
      `
      WITH latest_status AS (
        SELECT DISTINCT ON (os.order_id)
          os.order_id,
          os.status_type,
          os.status_time
        FROM order_status os
        ORDER BY os.order_id, os.status_time DESC, os.order_status_id DESC
      )
      SELECT
        p.store_id,
        COUNT(DISTINCT oi.order_id)::int AS total_orders,
        COALESCE(SUM(oi.qty), 0)::int AS total_items_sold,
        COALESCE(SUM(oi.price * oi.qty), 0)::numeric(12,2) AS gross_sales,
        COALESCE(SUM(oi.discount_amount), 0)::numeric(12,2) AS total_discount,
        COALESCE(SUM(oi.seller_earnings), 0)::numeric(12,2) AS total_seller_earnings
      FROM order_item oi
      JOIN product p
        ON p.product_id = oi.product_id
      JOIN latest_status ls
        ON ls.order_id = oi.order_id
      WHERE p.store_id = $1
        AND ls.status_type = 'delivered'
      GROUP BY p.store_id
      `,
      [storeId]
    );

    const dailySalesResult = await pool.query(
      `
      WITH latest_status AS (
        SELECT DISTINCT ON (os.order_id)
          os.order_id,
          os.status_type,
          os.status_time
        FROM order_status os
        ORDER BY os.order_id, os.status_time DESC, os.order_status_id DESC
      )
      SELECT
        DATE(ls.status_time) AS sales_date,
        COUNT(DISTINCT oi.order_id)::int AS orders_count,
        COALESCE(SUM(oi.qty), 0)::int AS items_sold,
        COALESCE(SUM(oi.seller_earnings), 0)::numeric(12,2) AS seller_earnings
      FROM order_item oi
      JOIN product p
        ON p.product_id = oi.product_id
      JOIN latest_status ls
        ON ls.order_id = oi.order_id
      WHERE p.store_id = $1
        AND ls.status_type = 'delivered'
      GROUP BY DATE(ls.status_time)
      ORDER BY sales_date DESC
      `,
      [storeId]
    );

    const topProductsResult = await pool.query(
      `
      WITH latest_status AS (
        SELECT DISTINCT ON (os.order_id)
          os.order_id,
          os.status_type,
          os.status_time
        FROM order_status os
        ORDER BY os.order_id, os.status_time DESC, os.order_status_id DESC
      )
      SELECT
        p.product_id,
        p.product_name,
        COALESCE(SUM(oi.qty), 0)::int AS total_qty_sold,
        COALESCE(SUM(oi.price * oi.qty), 0)::numeric(12,2) AS gross_sales,
        COALESCE(SUM(oi.discount_amount), 0)::numeric(12,2) AS total_discount,
        COALESCE(SUM(oi.seller_earnings), 0)::numeric(12,2) AS seller_earnings
      FROM order_item oi
      JOIN product p
        ON p.product_id = oi.product_id
      JOIN latest_status ls
        ON ls.order_id = oi.order_id
      WHERE p.store_id = $1
        AND ls.status_type = 'delivered'
      GROUP BY p.product_id, p.product_name
      ORDER BY total_qty_sold DESC, seller_earnings DESC
      LIMIT 10
      `,
      [storeId]
    );

    return res.json({
      success: true,
      store: {
        store_id: store.store_id,
        store_name: store.store_name,
      },
      summary: summaryResult.rows[0] || {
        total_orders: 0,
        total_items_sold: 0,
        gross_sales: 0,
        total_discount: 0,
        total_seller_earnings: 0,
      },
      daily_sales: dailySalesResult.rows,
      top_products: topProductsResult.rows,
    });
  } catch (error) {
    console.error("SELLER SALES REPORT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;