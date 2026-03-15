import pool from "../db.js";

export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.user_id;

    const totalProductsRes = await pool.query(
      `
      SELECT COUNT(p.product_id)::int AS total_products
      FROM product p
      JOIN store s ON s.store_id = p.store_id
      WHERE s.user_id = $1
      `,
      [sellerId]
    );

    const totalRevenueRes = await pool.query(
      `
      SELECT COALESCE(SUM(oi.seller_earnings), 0)::numeric AS total_revenue
      FROM order_item oi
      JOIN product p ON p.product_id = oi.product_id
      JOIN store s ON s.store_id = p.store_id
      WHERE s.user_id = $1
      `,
      [sellerId]
    );

    const totalOrdersRes = await pool.query(
      `
      SELECT COUNT(DISTINCT oi.order_id)::int AS total_orders
      FROM order_item oi
      JOIN product p ON p.product_id = oi.product_id
      JOIN store s ON s.store_id = p.store_id
      WHERE s.user_id = $1
      `,
      [sellerId]
    );

    const totalStoresRes = await pool.query(
      `
      SELECT COUNT(*)::int AS total_stores
      FROM store
      WHERE user_id = $1
      `,
      [sellerId]
    );

    const recentOrdersRes = await pool.query(
      `
      WITH latest_status AS (
        SELECT DISTINCT ON (os.order_id)
          os.order_id,
          os.status_type,
          os.status_time
        FROM order_status os
        ORDER BY os.order_id, os.status_time DESC
      )
      SELECT DISTINCT
        o.order_id,
        o.total_price,
        COALESCE(ls.status_type, 'placed') AS latest_status,
        u.username AS customer_username,
        u.full_name AS customer_full_name
      FROM "order" o
      JOIN order_item oi ON oi.order_id = o.order_id
      JOIN product p ON p.product_id = oi.product_id
      JOIN store s ON s.store_id = p.store_id
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      LEFT JOIN users u ON u.user_id = o.customer_id
      WHERE s.user_id = $1
      ORDER BY o.order_id DESC
      LIMIT 5
      `,
      [sellerId]
    );

    return res.json({
      stats: {
        total_products: totalProductsRes.rows[0]?.total_products || 0,
        total_revenue: totalRevenueRes.rows[0]?.total_revenue || 0,
        total_orders: totalOrdersRes.rows[0]?.total_orders || 0,
        total_stores: totalStoresRes.rows[0]?.total_stores || 0,
      },
      recentOrders: recentOrdersRes.rows,
    });
  } catch (err) {
    console.error("GET SELLER DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};