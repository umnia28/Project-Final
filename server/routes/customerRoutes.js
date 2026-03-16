import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";
import { uploadProfileImage } from "../middleware/uploadProfileImage.js";
import {
  getCustomerDashboard,
  getCustomerOrders,
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerWishlist,
  addWishlistItem,
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

// no need to repeat verifyToken + requireRole here because router.use already does it
router.get("/notifications", getCustomerNotifications);
router.patch("/notifications/:id/seen", markCustomerNotificationSeen);

router.get("/profile", getCustomerProfile);
router.put("/profile", uploadProfileImage.single("profile_img"), updateCustomerProfile);

router.get("/wishlist", getCustomerWishlist);
router.post("/wishlist/:productId", addWishlistItem);
router.delete("/wishlist/:productId", removeWishlistItem);

router.get("/addresses", getCustomerAddresses);
router.post("/addresses", addCustomerAddress);
router.put("/addresses/:id", updateCustomerAddress);
router.delete("/addresses/:id", deleteCustomerAddress);

export default router;