import pool from "../db.js";

/* =========================
   GET CUSTOMER NOTIFICATIONS
   GET /api/customer/notifications
========================= */
export const getCustomerNotifications = async (req, res) => {
  try {
    const customerId = req.user.user_id;

    const { rows } = await pool.query(
      `
      SELECT
        notification_id,
        notification_description,
        product_id,
        notice_id,
        seen_status,
        time_added
      FROM notification
      WHERE user_id = $1
      ORDER BY time_added DESC, notification_id DESC
      `,
      [customerId]
    );

    return res.json({ notifications: rows });
  } catch (err) {
    console.error("GET CUSTOMER NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET CUSTOMER UNREAD COUNT
   GET /api/customer/notifications/unread-count
========================= */
export const getCustomerUnreadNotificationCount = async (req, res) => {
  try {
    const customerId = req.user.user_id;

    const { rows } = await pool.query(
      `
      SELECT COUNT(*)::int AS unread_count
      FROM notification
      WHERE user_id = $1
        AND seen_status = FALSE
      `,
      [customerId]
    );

    return res.json({ unread_count: rows[0]?.unread_count || 0 });
  } catch (err) {
    console.error("GET CUSTOMER UNREAD NOTIFICATION COUNT ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   MARK CUSTOMER NOTIFICATION AS SEEN
   PATCH /api/customer/notifications/:id/seen
========================= */
export const markCustomerNotificationSeen = async (req, res) => {
  try {
    const customerId = req.user.user_id;
    const { id } = req.params;

    const { rows } = await pool.query(
      `
      UPDATE notification
      SET seen_status = TRUE
      WHERE notification_id = $1
        AND user_id = $2
      RETURNING
        notification_id,
        notification_description,
        product_id,
        notice_id,
        seen_status,
        time_added
      `,
      [id, customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({
      message: "Notification marked as seen",
      notification: rows[0],
    });
  } catch (err) {
    console.error("MARK CUSTOMER NOTIFICATION SEEN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};