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
  const client = await pool.connect();

  try {
    const sellerId = req.user.user_id;

    const username = req.body.username?.trim();
    const email = req.body.email?.trim();
    const contact_no = req.body.contact_no?.trim() || null;
    const full_name = req.body.full_name?.trim() || null;
    const gender = req.body.gender?.trim() || null;

    if (!username || !email) {
      return res.status(400).json({
        message: "Username and email are required",
      });
    }

    const currentUserResult = await client.query(
      `
      SELECT profile_img
      FROM users
      WHERE user_id = $1
      `,
      [sellerId]
    );

    if (currentUserResult.rows.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const currentProfileImg = currentUserResult.rows[0].profile_img;

    const duplicateCheck = await client.query(
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

    let finalProfileImg = currentProfileImg;
    let uploadedNewImage = false;

    if (req.file) {
      finalProfileImg = `/uploads/${req.file.filename}`;
      uploadedNewImage = true;
    } else if (
      typeof req.body.profile_img === "string" &&
      req.body.profile_img.trim()
    ) {
      finalProfileImg = req.body.profile_img.trim();
    }

    await client.query("BEGIN");

    const userUpdateResult = await client.query(
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
        contact_no,
        finalProfileImg,
        full_name,
        gender,
        sellerId,
      ]
    );

    if (uploadedNewImage) {
      await client.query(
        `
        INSERT INTO user_image (user_id, image_url)
        VALUES ($1, $2)
        `,
        [sellerId, finalProfileImg]
      );
    }

    const sellerExtra = await client.query(
      `
      SELECT
        business_name,
        kyc_status,
        rating_avg,
        approved_at
      FROM seller
      WHERE user_id = $1
      `,
      [sellerId]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Profile updated successfully",
      user: {
        ...userUpdateResult.rows[0],
        ...(sellerExtra.rows[0] || {}),
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("UPDATE SELLER PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};