import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  getDeliveryDashboard,
  getDeliveryOrders,
  getDeliveryProfile,
  updateDeliveryProfile,
  updateDeliveryOrderStatus,
} from "../controllers/deliveryMan.controller.js";
import {
  getDeliveryNotifications,
  markDeliveryNotificationSeen,
} from "../controllers/deliveryMan.notifications.controller.js";

const router = express.Router();

router.use(verifyToken, requireRole("delivery_man"));

router.get("/dashboard", getDeliveryDashboard);
router.get("/orders", getDeliveryOrders);

router.get("/notifications", getDeliveryNotifications);
router.patch("/notifications/:id/seen", markDeliveryNotificationSeen);

router.get("/profile", getDeliveryProfile);
router.put("/profile", updateDeliveryProfile);

router.patch("/orders/:orderId/status", updateDeliveryOrderStatus);

export default router;