import express from 'express';
import pool from '../db.js';
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from '../middleware/role.middleware.js';
import {
  getAdminNotifications,
  markAdminNotificationSeen,
} from "../controllers/admin.notifications.controller.js";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/admin.profile.controller.js";
import { getAdminDashboard } from "../controllers/admin.dashboard.controller.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, getAdminDashboard);

// Get all pending vendors
router.get('/vendors', verifyToken, isAdmin, async (req,res)=>{
  const result = await pool.query('SELECT * FROM vendors WHERE approved=false');
  res.json(result.rows);
});

router.get("/notifications", verifyToken, isAdmin, getAdminNotifications);
router.patch("/notifications/:id/seen", verifyToken, isAdmin, markAdminNotificationSeen);

router.get("/profile", verifyToken, isAdmin, getAdminProfile);
router.put("/profile", verifyToken, isAdmin, updateAdminProfile);

export default router;