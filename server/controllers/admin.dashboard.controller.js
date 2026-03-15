import pool from "../db.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalProductsRes = await pool.query(`
      SELECT COUNT(*)::int AS total_products
      FROM product
    `);

    const totalRevenueRes = await pool.query(`
      SELECT COALESCE(SUM(total_price), 0)::numeric AS total_revenue
      FROM "order"
      WHERE payment_status IN ('paid', 'refunded')
    `);

    const totalOrdersRes = await pool.query(`
      SELECT COUNT(*)::int AS total_orders
      FROM "order"
    `);

    const totalStoresRes = await pool.query(`
      SELECT COUNT(*)::int AS total_stores
      FROM store
    `);

    const pendingVendorsRes = await pool.query(`
      SELECT COUNT(*)::int AS pending_vendors
      FROM seller
      WHERE kyc_status = 'pending'
    `);

    const unreadNotificationsRes = await pool.query(
      `
      SELECT COUNT(*)::int AS unread_notifications
      FROM notification
      WHERE user_id = $1 AND seen_status = FALSE
      `,
      [req.user.user_id]
    );

    const recentOrdersRes = await pool.query(`
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
        o.total_price,
        o.date_added,
        COALESCE(ls.status_type, 'placed') AS latest_status,
        u.username AS customer_username,
        u.full_name AS customer_full_name
      FROM "order" o
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      LEFT JOIN users u ON u.user_id = o.customer_id
      ORDER BY o.date_added DESC
      LIMIT 5
    `);

    return res.json({
      stats: {
        total_products: totalProductsRes.rows[0]?.total_products || 0,
        total_revenue: totalRevenueRes.rows[0]?.total_revenue || 0,
        total_orders: totalOrdersRes.rows[0]?.total_orders || 0,
        total_stores: totalStoresRes.rows[0]?.total_stores || 0,
        pending_vendors: pendingVendorsRes.rows[0]?.pending_vendors || 0,
        unread_notifications:
          unreadNotificationsRes.rows[0]?.unread_notifications || 0,
      },
      recentOrders: recentOrdersRes.rows,
    });
  } catch (err) {
    console.error("GET ADMIN DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};