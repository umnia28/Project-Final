import express from "express";
import {
  createNotice,
  getAllNotices,
  deleteNotice,
} from "../controllers/noticeboard.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// public: homepage can read announcements
router.get("/", getAllNotices);

// admin only
router.post("/", verifyToken, isAdmin, createNotice);
router.delete("/:id", verifyToken, isAdmin, deleteNotice);

export default router;