import pool from "../db.js";

export const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.user_id;

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
        s.business_name,
        s.kyc_status,
        s.rating_avg,
        s.approved_at
      FROM users u
      JOIN seller s ON s.user_id = u.user_id
      WHERE u.user_id = $1
      `,
      [sellerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("GET SELLER PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const { username, email, contact_no, profile_img, full_name, gender } = req.body;

    const duplicateCheck = await pool.query(
      `
      SELECT user_id
      FROM users
      WHERE (username = $1 OR email = $2)
        AND user_id <> $3
      `,
      [username, email, sellerId]
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
        sellerId,
      ]
    );

    return res.json({
      message: "Profile updated successfully",
      user: rows[0],
    });
  } catch (err) {
    console.error("UPDATE SELLER PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};