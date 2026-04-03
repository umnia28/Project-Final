import pool from "../db.js";

// POST notice
export const createNotice = async (req, res) => {
  try {
    const adminUserId = req.user?.user_id || req.user?.id;
    const { notice_description } = req.body;

    if (!notice_description || !notice_description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notice description is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO noticeboard (admin_user_id, notice_description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [adminUserId, notice_description.trim()]
    );

    return res.status(201).json({
      success: true,
      message: "Announcement posted successfully",
      notice: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE NOTICE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create announcement",
    });
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

    await pool.query(
      `DELETE FROM noticeboard WHERE notice_id = $1`,
      [id]
    );

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