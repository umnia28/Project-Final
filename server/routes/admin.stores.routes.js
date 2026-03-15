import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

/* =========================
   GET ALL STORES FOR ADMIN
   GET /api/admin/stores
========================= */
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.store_id,
        s.user_id,
        s.store_name,
        s.store_status,
        s.ref_no,
        s.created_at,
        u.username,
        u.full_name,
        u.email,
        u.contact_no,
        u.profile_img
      FROM store s
      JOIN users u ON u.user_id = s.user_id
      ORDER BY s.store_id DESC
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

/* =========================
   UPDATE STORE STATUS
   PATCH /api/admin/stores/:storeId/status
   body: { store_status: "active" | "inactive" }
========================= */
router.patch("/:storeId/status", verifyToken, isAdmin, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { store_status } = req.body;

    if (!store_status) {
      return res.status(400).json({
        success: false,
        message: "store_status is required",
      });
    }

    if (!["active", "inactive"].includes(store_status)) {
      return res.status(400).json({
        success: false,
        message: "store_status must be 'active' or 'inactive'",
      });
    }

    const result = await pool.query(
      `
      UPDATE store
      SET store_status = $1
      WHERE store_id = $2
      RETURNING store_id, user_id, store_name, store_status, ref_no, created_at
      `,
      [store_status, storeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.json({
      success: true,
      message: `Store ${store_status === "active" ? "activated" : "deactivated"} successfully`,
      store: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE STORE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update store status",
    });
  }
});

export default router;