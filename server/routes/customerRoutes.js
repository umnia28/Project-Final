import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import {
  getCustomerDashboard,
  getCustomerOrders,
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerWishlist,
  removeWishlistItem,
  getCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "../controllers/customer.controller.js";
import {
  getCustomerNotifications,
  markCustomerNotificationSeen,
} from "../controllers/customer.notifications.controller.js";

const router = express.Router();

// all customer routes require authenticated customer
router.use(verifyToken, requireRole("customer"));

router.get("/dashboard", getCustomerDashboard);
router.get("/orders", getCustomerOrders);

router.get("/notifications", verifyToken, requireRole("customer"), getCustomerNotifications);
router.patch("/notifications/:id/seen", verifyToken, requireRole("customer"), markCustomerNotificationSeen);

router.get("/profile", getCustomerProfile);
router.put("/profile", updateCustomerProfile);

router.get("/wishlist", getCustomerWishlist);
router.delete("/wishlist/:productId", removeWishlistItem);

router.get("/addresses", getCustomerAddresses);
router.post("/addresses", addCustomerAddress);
router.put("/addresses/:id", updateCustomerAddress);
router.delete("/addresses/:id", deleteCustomerAddress);

export default router;