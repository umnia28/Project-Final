import express from "express";
import multer from "multer";
import path from "path";

import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { applySeller } from "../controllers/seller.controller.js";

import { getSellerDashboard } from "../controllers/seller.dashboard.controller.js";
import {
  getSellerProfile,
  updateSellerProfile,
} from "../controllers/seller.profile.controller.js";

import {
  getSellerNotifications,
  markSellerNotificationSeen,
} from "../controllers/seller.notifications.controller.js";

import {
  getSellerStock,
  updateSellerStock,
} from "../controllers/seller.stock.controller.js";

const router = express.Router();

/*
--------------------------------
MULTER SETUP FOR PROFILE IMAGE
--------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `seller-${req.user.user_id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/*
--------------------------------
SELLER APPLICATION
--------------------------------
*/

/**
 * POST /api/seller/become-seller
 * Customer applies to become seller
 */
router.post("/become-seller", verifyToken, applySeller);

/*
--------------------------------
SELLER DASHBOARD
--------------------------------
*/

/**
 * GET /api/seller/dashboard
 */
router.get(
  "/dashboard",
  verifyToken,
  requireRole("seller"),
  getSellerDashboard
);

/*
--------------------------------
SELLER PROFILE
--------------------------------
*/

/**
 * GET seller profile
 */
router.get(
  "/profile",
  verifyToken,
  requireRole("seller"),
  getSellerProfile
);

/**
 * UPDATE seller profile
 */
router.put(
  "/profile",
  verifyToken,
  requireRole("seller"),
  upload.single("profile_img"),
  updateSellerProfile
);

/*
--------------------------------
SELLER NOTIFICATIONS
--------------------------------
*/

/**
 * GET seller notifications
 */
router.get(
  "/notifications",
  verifyToken,
  requireRole("seller"),
  getSellerNotifications
);

router.patch(
  "/notifications/:id/seen",
  verifyToken,
  requireRole("seller"),
  markSellerNotificationSeen
);

/*
--------------------------------
SELLER STOCK MANAGEMENT
--------------------------------
*/

/**
 * GET seller products stock
 */
router.get(
  "/stock",
  verifyToken,
  requireRole("seller"),
  getSellerStock
);

/**
 * UPDATE product stock
 */
router.put(
  "/stock/:productId",
  verifyToken,
  requireRole("seller"),
  updateSellerStock
);

export default router;