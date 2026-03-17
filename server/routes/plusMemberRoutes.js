import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/**
 * POST /api/plus-member/subscribe
 * customer subscribes to plus membership
 */
router.post("/subscribe", verifyToken, requireRole("customer"), async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    if (!["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const customerCheck = await client.query(
      `SELECT user_id, points FROM customer WHERE user_id = $1`,
      [userId]
    );

    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ message: "Customer account not found" });
    }

    // Temporary logic because schema is restricted and has no plus_member table
    // You can treat points as a premium reward marker for now
    const bonusPoints = plan === "monthly" ? 100 : 1200;

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE customer
      SET points = points + $1
      WHERE user_id = $2
      `,
      [bonusPoints, userId]
    );

    await client.query(
      `
      INSERT INTO notification (
        user_id,
        notification_description,
        seen_status,
        time_added
      )
      VALUES ($1, $2, FALSE, NOW())
      `,
      [
        userId,
        `Your Plus Membership (${plan}) has been activated successfully.`
      ]
    );

    await client.query("COMMIT");

    res.json({
      message: "Subscription successful",
      plan,
      bonus_points_added: bonusPoints,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PLUS MEMBERSHIP ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
      detail: err.detail || null,
    });
  } finally {
    client.release();
  }
});

export default router;