import express from "express";
import pool from "../db.js";
// import { verifyToken } from "../middleware/verifyToken.js";
// import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

// GET ALL STORES FOR ADMIN
router.get("/", async (req, res) => {
  try {
    console.log("GET ADMIN STORES HIT");

    const result = await pool.query(`
      SELECT store_id, user_id, store_name, store_status, ref_no, created_at
      FROM store
      ORDER BY store_id DESC
    `);

    return res.json({
      success: true,
      stores: result.rows,
    });
  } catch (error) {
    console.error("GET ADMIN STORES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
});

export default router;