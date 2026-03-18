import pool from "../db.js";

/* =========================
   DASHBOARD
========================= */
export const getDeliveryDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const totalAssignedRes = await pool.query(
      `
      SELECT COUNT(*)::int AS total_assigned
      FROM "order"
      WHERE delivery_man_id = $1
      `,
      [userId]
    );

    const itemStatusCountsRes = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (
          WHERE oi.delivery_status = 'not_ready'
        )::int AS confirmed_orders,
        COUNT(*) FILTER (
          WHERE oi.delivery_status = 'shipment_ready'
        )::int AS shipped_orders,
        COUNT(*) FILTER (
          WHERE oi.delivery_status = 'out_for_delivery'
        )::int AS out_for_delivery_orders,
        COUNT(*) FILTER (
          WHERE oi.delivery_status = 'delivered'
        )::int AS delivered_orders
      FROM order_item oi
      JOIN "order" o ON o.order_id = oi.order_id
      WHERE o.delivery_man_id = $1
        AND oi.cancelled_by IS NULL
      `,
      [userId]
    );

    const unreadNotificationsRes = await pool.query(
      `
      SELECT COUNT(*)::int AS unread_notifications
      FROM notification
      WHERE user_id = $1
        AND seen_status = FALSE
      `,
      [userId]
    );

    const recentOrdersRes = await pool.query(
      `
      SELECT DISTINCT ON (o.order_id)
        o.order_id,
        o.total_price,
        o.date_added,
        o.delivery_time,
        sa.address,
        sa.city,
        sa.shipping_state,
        sa.zip_code,
        sa.country,
        COALESCE(
          (
            SELECT oi2.delivery_status
            FROM order_item oi2
            WHERE oi2.order_id = o.order_id
              AND oi2.cancelled_by IS NULL
            ORDER BY oi2.order_item_id DESC
            LIMIT 1
          ),
          'not_ready'
        ) AS order_status
      FROM "order" o
      LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
      WHERE o.delivery_man_id = $1
      ORDER BY o.order_id, o.date_added DESC
      LIMIT 5
      `,
      [userId]
    );

    return res.json({
      stats: {
        total_assigned: totalAssignedRes.rows[0]?.total_assigned || 0,
        confirmed_orders: itemStatusCountsRes.rows[0]?.confirmed_orders || 0,
        shipped_orders: itemStatusCountsRes.rows[0]?.shipped_orders || 0,
        out_for_delivery_orders:
          itemStatusCountsRes.rows[0]?.out_for_delivery_orders || 0,
        delivered_orders: itemStatusCountsRes.rows[0]?.delivered_orders || 0,
        unread_notifications:
          unreadNotificationsRes.rows[0]?.unread_notifications || 0,
      },
      recentOrders: recentOrdersRes.rows,
    });
  } catch (err) {
    console.error("GET DELIVERY DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
/* =========================
   ORDERS
========================= */
export const getDeliveryOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

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
        o.total_price,
        o.payment_method,
        o.payment_status,
        o.delivery_charge,
        o.discount_amount,
        o.transaction_id,
        o.delivery_time,
        o.reason_for_cancellation,
        o.date_added,
        sa.address AS shipping_address,
        sa.city,
        sa.shipping_state,
        sa.zip_code,
        sa.country,
        COALESCE(ls.status_type, 'placed') AS order_status
      FROM "order" o
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
      WHERE o.delivery_man_id = $1
      ORDER BY o.date_added DESC
      `,
      [userId]
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
        oi.delivery_status,
        oi.cancelled_by,
        oi.cancel_reason,
        p.product_name,
        (
          SELECT pi.image_url
          FROM product_image pi
          WHERE pi.product_id = p.product_id
          ORDER BY pi.created_at ASC
          LIMIT 1
        ) AS image_url
      FROM order_item oi
      JOIN "order" o ON o.order_id = oi.order_id
      JOIN product p ON p.product_id = oi.product_id
      WHERE o.delivery_man_id = $1
      ORDER BY oi.order_id DESC, oi.order_item_id ASC
      `,
      [userId]
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
    console.error("GET DELIVERY ORDERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
/* =========================
   NOTIFICATIONS
========================= */
export const getDeliveryNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT
        notification_id,
        notification_description,
        seen_status,
        time_added
      FROM notification
      WHERE user_id = $1
      ORDER BY time_added DESC
      `,
      [userId]
    );

    return res.json({ notifications: result.rows });
  } catch (err) {
    console.error("GET DELIVERY NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   PROFILE
========================= */
export const getDeliveryProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const profileRes = await pool.query(
      `
      SELECT
        u.user_id,
        u.username,
        u.email,
        u.contact_no,
        u.profile_img,
        u.full_name,
        u.gender,
        u.status,
        u.created_at,
        d.joining_date,
        d.salary
      FROM users u
      JOIN delivery_man d ON d.user_id = u.user_id
      WHERE u.user_id = $1
      `,
      [userId]
    );

    if (profileRes.rows.length === 0) {
      return res.status(404).json({ message: "Delivery man not found" });
    }

    const deliveredCountRes = await pool.query(
      `
      SELECT COUNT(*)::int AS total_orders
      FROM order_item oi
      JOIN "order" o ON o.order_id = oi.order_id
      WHERE o.delivery_man_id = $1
        AND oi.delivery_status = 'delivered'
        AND oi.cancelled_by IS NULL
      `,
      [userId]
    );

    const user = {
      ...profileRes.rows[0],
      total_orders: deliveredCountRes.rows[0]?.total_orders || 0,
    };

    return res.json({ user });
  } catch (err) {
    console.error("GET DELIVERY PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateDeliveryProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { username, email, contact_no, profile_img, full_name, gender } =
      req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required" });
    }

    const duplicateCheck = await pool.query(
      `
      SELECT user_id
      FROM users
      WHERE (username = $1 OR email = $2)
        AND user_id <> $3
      `,
      [username, email, userId]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        username = $1,
        email = $2,
        contact_no = $3,
        profile_img = $4,
        full_name = $5,
        gender = $6
      WHERE user_id = $7
      RETURNING
        user_id,
        username,
        email,
        contact_no,
        profile_img,
        full_name,
        gender,
        status,
        created_at
      `,
      [
        username,
        email,
        contact_no || null,
        profile_img || null,
        full_name || null,
        gender || null,
        userId,
      ]
    );

    return res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("UPDATE DELIVERY PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateDeliveryOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { delivery_status } = req.body;
  const deliverymanId = req.user.user_id;

  try {
    const allowedStatuses = ["out_for_delivery", "delivered"];

    if (!allowedStatuses.includes(delivery_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
    }

    const itemCheck = await pool.query(
      `
      SELECT 
        oi.order_item_id,
        oi.order_id,
        oi.delivery_status,
        oi.cancelled_by,
        o.delivery_man_id
      FROM order_item oi
      JOIN "order" o ON o.order_id = oi.order_id
      WHERE oi.order_id = $1
      `,
      [orderId]
    );

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No order items found for this order",
      });
    }

    const validItems = itemCheck.rows.filter(
      (item) =>
        Number(item.delivery_man_id) === Number(deliverymanId) &&
        !item.cancelled_by
    );

    if (validItems.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No assigned active items found for this delivery man",
      });
    }

    if (delivery_status === "out_for_delivery") {
      const hasInvalidStatus = validItems.some(
        (item) => item.delivery_status !== "shipment_ready"
      );

      if (hasInvalidStatus) {
        return res.status(400).json({
          success: false,
          message: "Only shipment_ready items can be marked out_for_delivery",
        });
      }
    }

    if (delivery_status === "delivered") {
      const hasInvalidStatus = validItems.some(
        (item) =>
          item.delivery_status !== "out_for_delivery" &&
          item.delivery_status !== "shipment_ready"
      );

      if (hasInvalidStatus) {
        return res.status(400).json({
          success: false,
          message: "Only shipment_ready or out_for_delivery items can be marked delivered",
        });
      }
    }

    await pool.query(
      `
      UPDATE order_item
      SET delivery_status = $1
      WHERE order_id = $2
        AND cancelled_by IS NULL
      `,
      [delivery_status, orderId]
    );

    return res.json({
      success: true,
      message: `Order marked as ${delivery_status}`,
    });
  } catch (error) {
    console.error("UPDATE DELIVERY ORDER STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
    });
  }
};