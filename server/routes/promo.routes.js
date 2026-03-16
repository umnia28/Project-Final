import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/promos/:id
 * Public promo lookup for checkout
 */
router.get("/:id", async (req, res) => {
  try {
    const promoId = Number(req.params.id);

    if (!promoId) {
      return res.status(400).json({ message: "Invalid promo id" });
    }

    const { rows } = await pool.query(
      `
      SELECT
        promo_id,
        promo_name,
        promo_status,
        promo_discount,
        promo_start_date,
        promo_end_date
      FROM promo
      WHERE promo_id = $1
      `,
      [promoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Promo not found" });
    }

    const promo = rows[0];
    const now = new Date();

    if (promo.promo_status !== "active") {
      return res.status(400).json({ message: "Promo is not active" });
    }

    if (promo.promo_start_date && new Date(promo.promo_start_date) > now) {
      return res.status(400).json({ message: "Promo has not started yet" });
    }

    if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
      return res.status(400).json({ message: "Promo has expired" });
    }

    res.json({
      promo: {
        promo_id: promo.promo_id,
        code: String(promo.promo_id),
        description: promo.promo_name,
        discount: Number(promo.promo_discount),
      },
    });
  } catch (err) {
    console.error("PROMO LOOKUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;