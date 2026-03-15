import pool from "../db.js";

/* =========================
   GET ADMIN NOTIFICATIONS
   GET /api/admin/notifications
========================= */
export const getAdminNotifications = async (req, res) => {
  try {
    const adminUserId = req.user.user_id;

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
      [adminUserId]
    );

    return res.json({ notifications: rows });
  } catch (err) {
    console.error("GET ADMIN NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   MARK ADMIN NOTIFICATION AS SEEN
   PATCH /api/admin/notifications/:id/seen
========================= */
export const markAdminNotificationSeen = async (req, res) => {
  try {
    const adminUserId = req.user.user_id;
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
      [id, adminUserId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({
      message: "Notification marked as seen",
      notification: rows[0],
    });
  } catch (err) {
    console.error("MARK ADMIN NOTIFICATION SEEN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};