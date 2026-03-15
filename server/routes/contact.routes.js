import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    const adminRes = await pool.query(`
      SELECT user_id
      FROM admin
    `);

    if (adminRes.rows.length === 0) {
      return res.status(404).json({
        message: "No admin found",
      });
    }

    const text = `[CONTACT] from ${name} (${email}): ${message}`;

    for (const admin of adminRes.rows) {
      await pool.query(
        `
        INSERT INTO notification (user_id, notification_description)
        VALUES ($1, $2)
        `,
        [admin.user_id, text]
      );
    }

    return res.json({
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("CONTACT MESSAGE ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;