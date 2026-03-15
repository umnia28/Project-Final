import pool from "../db.js";

/* =========================
   GET SELLER NOTIFICATIONS
   GET /api/seller/notifications
========================= */
export const getSellerNotifications = async (req, res) => {
  try {
    const sellerId = req.user.user_id;

    const { rows } = await pool.query(
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
      [sellerId]
    );

    return res.json({ notifications: rows });
  } catch (err) {
    console.error("GET SELLER NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   MARK SELLER NOTIFICATION AS SEEN
   PATCH /api/seller/notifications/:id/seen
========================= */
export const markSellerNotificationSeen = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
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
        seen_status,
        time_added
      `,
      [id, sellerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({
      message: "Notification marked as seen",
      notification: rows[0],
    });
  } catch (err) {
    console.error("MARK SELLER NOTIFICATION SEEN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};