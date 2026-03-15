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

    const statusCountsRes = await pool.query(
      `
      WITH latest_status AS (
        SELECT DISTINCT ON (os.order_id)
          os.order_id,
          os.status_type
        FROM order_status os
        ORDER BY os.order_id, os.status_time DESC
      )
      SELECT
        COUNT(*) FILTER (
          WHERE LOWER(COALESCE(ls.status_type, 'placed')) = 'confirmed'
        )::int AS confirmed_orders,
        COUNT(*) FILTER (
          WHERE LOWER(COALESCE(ls.status_type, 'placed')) = 'shipped'
        )::int AS shipped_orders,
        COUNT(*) FILTER (
          WHERE LOWER(COALESCE(ls.status_type, 'placed')) = 'out_for_delivery'
        )::int AS out_for_delivery_orders,
        COUNT(*) FILTER (
          WHERE LOWER(COALESCE(ls.status_type, 'placed')) = 'delivered'
        )::int AS delivered_orders
      FROM "order" o
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      WHERE o.delivery_man_id = $1
      `,
      [userId]
    );

    const unreadNotificationsRes = await pool.query(
      `
      SELECT COUNT(*)::int AS unread_notifications
      FROM notification
      WHERE user_id = $1 AND seen_status = FALSE
      `,
      [userId]
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
      SELECT
        o.order_id,
        o.total_price,
        o.date_added,
        o.delivery_time,
        COALESCE(ls.status_type, 'placed') AS order_status,
        sa.address,
        sa.city,
        sa.shipping_state,
        sa.zip_code,
        sa.country
      FROM "order" o
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
      WHERE o.delivery_man_id = $1
      ORDER BY o.date_added DESC
      LIMIT 5
      `,
      [userId]
    );

    return res.json({
      stats: {
        total_assigned: totalAssignedRes.rows[0]?.total_assigned || 0,
        confirmed_orders: statusCountsRes.rows[0]?.confirmed_orders || 0,
        shipped_orders: statusCountsRes.rows[0]?.shipped_orders || 0,
        out_for_delivery_orders:
          statusCountsRes.rows[0]?.out_for_delivery_orders || 0,
        delivered_orders: statusCountsRes.rows[0]?.delivered_orders || 0,
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

    const result = await pool.query(
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
        d.salary,
        d.total_orders
      FROM users u
      JOIN delivery_man d ON d.user_id = u.user_id
      WHERE u.user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Delivery man not found" });
    }

    return res.json({ user: result.rows[0] });
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
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;
    const { status_type } = req.body;

    const allowedStatuses = ["shipped", "out_for_delivery", "delivered"];

    if (!status_type) {
      return res.status(400).json({ message: "status_type is required" });
    }

    if (!allowedStatuses.includes(status_type)) {
      return res.status(400).json({
        message:
          "Invalid status_type. Allowed: shipped, out_for_delivery, delivered",
      });
    }

    await client.query("BEGIN");

    const orderCheck = await client.query(
      `
      SELECT order_id, delivery_man_id
      FROM "order"
      WHERE order_id = $1
      `,
      [orderId]
    );

    if (orderCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(orderCheck.rows[0].delivery_man_id) !== String(userId)) {
      await client.query("ROLLBACK");
      return res
        .status(403)
        .json({ message: "You are not assigned to this order" });
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

    if (currentStatus === "delivered") {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ message: "Delivered order status cannot be changed" });
    }

    await client.query(
      `
      INSERT INTO order_status (order_id, status_type, updated_by)
      VALUES ($1, $2, $3)
      `,
      [orderId, status_type, userId]
    );

    if (status_type === "delivered") {
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
        UPDATE delivery_man
        SET total_orders = total_orders + 1
        WHERE user_id = $1
        `,
        [userId]
      );
    }

    await client.query("COMMIT");

    return res.json({
      message: "Order status updated successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UPDATE DELIVERY ORDER STATUS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};