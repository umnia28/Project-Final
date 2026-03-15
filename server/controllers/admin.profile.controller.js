import pool from "../db.js";

export const getAdminProfile = async (req, res) => {
  try {
    const adminUserId = req.user.user_id;

    const { rows } = await pool.query(
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
        a.clearance_level,
        a.is_employee,
        a.hire_date
      FROM users u
      JOIN admin a ON a.user_id = u.user_id
      WHERE u.user_id = $1
      `,
      [adminUserId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("GET ADMIN PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const adminUserId = req.user.user_id;
    const { username, email, contact_no, profile_img, full_name, gender } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        message: "Username and email are required",
      });
    }

    const duplicateCheck = await pool.query(
      `
      SELECT user_id
      FROM users
      WHERE (username = $1 OR email = $2)
        AND user_id <> $3
      `,
      [username, email, adminUserId]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    const { rows } = await pool.query(
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
        adminUserId,
      ]
    );

    return res.json({
      message: "Profile updated successfully",
      user: rows[0],
    });
  } catch (err) {
    console.error("UPDATE ADMIN PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};