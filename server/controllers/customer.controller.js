import pool from "../db.js";

/* =========================
   DASHBOARD
========================= */
export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const totalOrdersRes = await pool.query(
      `
      SELECT COUNT(*)::int AS total_orders
      FROM "order"
      WHERE customer_id = $1
      `,
      [userId]
    );

    const orderStatusCountsRes = await pool.query(
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
          WHERE LOWER(COALESCE(ls.status_type, 'pending')) = 'pending'
        )::int AS pending_orders,
        COUNT(*) FILTER (
          WHERE LOWER(COALESCE(ls.status_type, 'pending')) = 'delivered'
        )::int AS delivered_orders
      FROM "order" o
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      WHERE o.customer_id = $1
      `,
      [userId]
    );

    const wishlistRes = await pool.query(
      `
      SELECT COUNT(*)::int AS wishlist_count
      FROM wishlist
      WHERE user_id = $1
      `,
      [userId]
    );

    const notificationRes = await pool.query(
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
        COALESCE(ls.status_type, 'pending') AS order_status
      FROM "order" o
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      WHERE o.customer_id = $1
      ORDER BY o.date_added DESC
      LIMIT 5
      `,
      [userId]
    );

    return res.json({
      stats: {
        total_orders: totalOrdersRes.rows[0]?.total_orders || 0,
        pending_orders: orderStatusCountsRes.rows[0]?.pending_orders || 0,
        delivered_orders: orderStatusCountsRes.rows[0]?.delivered_orders || 0,
        wishlist_count: wishlistRes.rows[0]?.wishlist_count || 0,
        unread_notifications: notificationRes.rows[0]?.unread_notifications || 0,
      },
      recentOrders: recentOrdersRes.rows,
    });
  } catch (err) {
    console.error("GET CUSTOMER DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ORDERS
========================= */
export const getCustomerOrders = async (req, res) => {
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
        COALESCE(ls.status_type, 'pending') AS order_status
      FROM "order" o
      LEFT JOIN latest_status ls ON ls.order_id = o.order_id
      LEFT JOIN shipping_address sa ON sa.address_id = o.address_id
      WHERE o.customer_id = $1
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
      WHERE o.customer_id = $1
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
    console.error("GET CUSTOMER ORDERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
/*

   //NOTIFICATIONS

export const getCustomerNotifications = async (req, res) => {
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
    console.error("GET CUSTOMER NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};*/


/* =========================
   PROFILE
========================= */
export const getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT
        user_id,
        username,
        email,
        contact_no,
        profile_img,
        full_name,
        gender,
        status,
        created_at
      FROM users
      WHERE user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("GET CUSTOMER PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCustomerProfile = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { username, email, contact_no, full_name, gender } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    const allowedGenders = ["male", "female", "other", ""];
    if (!allowedGenders.includes(gender || "")) {
      return res.status(400).json({ message: "Invalid gender value" });
    }

    await client.query("BEGIN");

    const existingUserRes = await client.query(
      `
      SELECT profile_img
      FROM users
      WHERE user_id = $1
      `,
      [userId]
    );

    if (existingUserRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "User not found" });
    }

    const duplicateCheck = await client.query(
      `
      SELECT user_id
      FROM users
      WHERE (username = $1 OR email = $2)
        AND user_id <> $3
      `,
      [username, email, userId]
    );

    if (duplicateCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    let finalProfileImg = existingUserRes.rows[0].profile_img || null;

    if (req.file) {
      finalProfileImg = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;
    }

    const result = await client.query(
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
        finalProfileImg,
        full_name || null,
        gender || null,
        userId,
      ]
    );

    if (req.file) {
      await client.query(
        `
        INSERT INTO user_image (user_id, image_url)
        VALUES ($1, $2)
        `,
        [userId, finalProfileImg]
      );
    }

    await client.query("COMMIT");

    return res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UPDATE CUSTOMER PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};
/* =========================
   WISHLIST
========================= */
export const addWishlistItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.params;

    // optional: check if product exists and is visible
    const productCheck = await pool.query(
      `
      SELECT product_id
      FROM product
      WHERE product_id = $1
      `,
      [productId]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO wishlist (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING *
      `,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Product already in wishlist" });
    }

    return res.status(201).json({
      message: "Added to wishlist successfully",
    });
  } catch (err) {
    console.error("ADD CUSTOMER WISHLIST ITEM ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCustomerWishlist = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT
        w.product_id,
        w.added_at,
        p.product_name,
        p.price,
        p.discount,
        p.product_count,
        p.status,
        p.visibility_status,
        (
          SELECT pi.image_url
          FROM product_image pi
          WHERE pi.product_id = p.product_id
          ORDER BY pi.created_at ASC
          LIMIT 1
        ) AS image_url
      FROM wishlist w
      JOIN product p ON p.product_id = w.product_id
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
      `,
      [userId]
    );

    return res.json({ items: result.rows });
  } catch (err) {
    console.error("GET CUSTOMER WISHLIST ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeWishlistItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM wishlist
      WHERE user_id = $1 AND product_id = $2
      RETURNING *
      `,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    return res.json({ message: "Wishlist item removed successfully" });
  } catch (err) {
    console.error("REMOVE CUSTOMER WISHLIST ITEM ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ADDRESSES
========================= */
export const getCustomerAddresses = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT
        address_id,
        city,
        address,
        shipping_state,
        zip_code,
        country,
        visibility_status,
        created_at
      FROM shipping_address
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.json({ addresses: result.rows });
  } catch (err) {
    console.error("GET CUSTOMER ADDRESSES ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addCustomerAddress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { city, address, shipping_state, zip_code, country, visibility_status } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO shipping_address
      (user_id, city, address, shipping_state, zip_code, country, visibility_status)
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, TRUE))
      RETURNING *
      `,
      [
        userId,
        city || null,
        address,
        shipping_state || null,
        zip_code || null,
        country || null,
        visibility_status,
      ]
    );

    return res.status(201).json({
      message: "Address added successfully",
      address: result.rows[0],
    });
  } catch (err) {
    console.error("ADD CUSTOMER ADDRESS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCustomerAddress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { city, address, shipping_state, zip_code, country, visibility_status } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const result = await pool.query(
      `
      UPDATE shipping_address
      SET
        city = $1,
        address = $2,
        shipping_state = $3,
        zip_code = $4,
        country = $5,
        visibility_status = COALESCE($6, visibility_status)
      WHERE address_id = $7 AND user_id = $8
      RETURNING *
      `,
      [
        city || null,
        address,
        shipping_state || null,
        zip_code || null,
        country || null,
        visibility_status,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.json({
      message: "Address updated successfully",
      address: result.rows[0],
    });
  } catch (err) {
    console.error("UPDATE CUSTOMER ADDRESS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteCustomerAddress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM shipping_address
      WHERE address_id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.json({ message: "Address deleted successfully" });
  } catch (err) {
    console.error("DELETE CUSTOMER ADDRESS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};