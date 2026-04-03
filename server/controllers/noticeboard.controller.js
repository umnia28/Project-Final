import pool from "../db.js";

// POST notice
export const createNotice = async (req, res) => {
  const client = await pool.connect();

  try {
    const adminUserId = req.user?.user_id || req.user?.id;
    const { notice_description } = req.body;

    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        message: "Admin user id not found in token",
      });
    }

    if (!notice_description || !notice_description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notice description is required",
      });
    }

    const adminCheck = await client.query(
      `
      SELECT user_id
      FROM admin
      WHERE user_id = $1
      `,
      [adminUserId]
    );

    if (adminCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Admin user_id ${adminUserId} does not exist in admin table`,
      });
    }

    await client.query("BEGIN");

    const noticeResult = await client.query(
      `
      INSERT INTO noticeboard (admin_user_id, notice_description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [adminUserId, notice_description.trim()]
    );

    const notice = noticeResult.rows[0];

    // get all customers
    const customerResult = await client.query(
      `
      SELECT user_id
      FROM customer
      `
    );

    for (const customer of customerResult.rows) {
      await client.query(
        `
        INSERT INTO notification (
          user_id,
          product_id,
          notice_id,
          notification_description,
          seen_status,
          time_added
        )
        VALUES ($1, NULL, $2, $3, FALSE, NOW())
        `,
        [
          customer.user_id,
          notice.notice_id,
          `📢 ${notice.notice_description}`,
        ]
      );
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Announcement posted successfully and sent to all customers",
      notice,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("CREATE NOTICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create announcement",
    });
  } finally {
    client.release();
  }
};

// GET all notices
export const getAllNotices = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        n.notice_id,
        n.notice_description,
        n.date_added,
        n.admin_user_id
      FROM noticeboard n
      ORDER BY n.date_added DESC
      `
    );

    return res.json({
      success: true,
      notices: result.rows,
    });
  } catch (error) {
    console.error("GET NOTICES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
    });
  }
};

// DELETE notice
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `SELECT * FROM noticeboard WHERE notice_id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    await pool.query(`DELETE FROM noticeboard WHERE notice_id = $1`, [id]);

    return res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NOTICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
    });
  }
};