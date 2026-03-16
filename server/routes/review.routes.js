import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * GET all reviews for a product
 * public
 */
router.get("/product/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const { rows } = await pool.query(
      `
      SELECT
        pr.review_id,
        pr.product_id,
        pr.customer_id,
        pr.rating,
        pr.review,
        pr.time_added,
        u.username,
        u.full_name,
        u.profile_img
      FROM product_review pr
      JOIN users u
        ON u.user_id = pr.customer_id
      WHERE pr.product_id = $1
      ORDER BY pr.time_added DESC
      `,
      [productId]
    );

    const reviews = rows.map((r) => ({
      review_id: r.review_id,
      product_id: r.product_id,
      customer_id: r.customer_id,
      rating: Number(r.rating),
      review: r.review || "",
      time_added: r.time_added,
      user: {
        id: r.customer_id,
        username: r.username,
        name: r.full_name || r.username,
        image: r.profile_img || null,
      },
    }));

    return res.json({ reviews });
  } catch (err) {
    console.error("GET PRODUCT REVIEWS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Check whether logged-in customer can review this product
 */
router.get("/can-review/:productId", verifyToken, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const userId = req.user.user_id;

    if (Number.isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // must be customer
    const customerRes = await pool.query(
      `SELECT user_id FROM customer WHERE user_id = $1`,
      [userId]
    );

    if (customerRes.rows.length === 0) {
      return res.status(403).json({
        canReview: false,
        alreadyReviewed: false,
        message: "Only customers can review products",
      });
    }

    // must have purchased this product
    const purchaseRes = await pool.query(
      `
      SELECT oi.order_item_id
      FROM order_item oi
      JOIN "order" o
        ON o.order_id = oi.order_id
      WHERE o.customer_id = $1
        AND oi.product_id = $2
      LIMIT 1
      `,
      [userId, productId]
    );

    if (purchaseRes.rows.length === 0) {
      return res.json({
        canReview: false,
        alreadyReviewed: false,
        message: "You can review only products you purchased",
      });
    }

    // check existing review
    const reviewRes = await pool.query(
      `
      SELECT review_id, rating, review, time_added
      FROM product_review
      WHERE customer_id = $1
        AND product_id = $2
      LIMIT 1
      `,
      [userId, productId]
    );

    if (reviewRes.rows.length > 0) {
      return res.json({
        canReview: true,
        alreadyReviewed: true,
        existingReview: reviewRes.rows[0],
        message: "You already reviewed this product",
      });
    }

    return res.json({
      canReview: true,
      alreadyReviewed: false,
      message: "You can review this product",
    });
  } catch (err) {
    console.error("CAN REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Create review
 */
router.post("/product/:productId", verifyToken, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const userId = req.user.user_id;
    const { rating, review } = req.body;

    if (Number.isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // must be customer
    const customerRes = await pool.query(
      `SELECT user_id FROM customer WHERE user_id = $1`,
      [userId]
    );

    if (customerRes.rows.length === 0) {
      return res.status(403).json({ message: "Only customers can review products" });
    }

    // must have purchased
    const purchaseRes = await pool.query(
      `
      SELECT oi.order_item_id
      FROM order_item oi
      JOIN "order" o
        ON o.order_id = oi.order_id
      WHERE o.customer_id = $1
        AND oi.product_id = $2
      LIMIT 1
      `,
      [userId, productId]
    );

    if (purchaseRes.rows.length === 0) {
      return res.status(403).json({
        message: "You can review only products you purchased",
      });
    }

    // prevent duplicate
    const existingRes = await pool.query(
      `
      SELECT review_id
      FROM product_review
      WHERE customer_id = $1
        AND product_id = $2
      LIMIT 1
      `,
      [userId, productId]
    );

    if (existingRes.rows.length > 0) {
      return res.status(409).json({
        message: "You already reviewed this product",
      });
    }

    const insertRes = await pool.query(
      `
      INSERT INTO product_review (product_id, customer_id, rating, review)
      VALUES ($1, $2, $3, $4)
      RETURNING review_id, product_id, customer_id, rating, review, time_added
      `,
      [productId, userId, numericRating, review?.trim() || null]
    );

    return res.status(201).json({
      message: "Review submitted successfully",
      review: insertRes.rows[0],
    });
  } catch (err) {
    console.error("ADD REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Update own review
 */
router.patch("/product/:productId", verifyToken, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const userId = req.user.user_id;
    const { rating, review } = req.body;

    if (Number.isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const updateRes = await pool.query(
      `
      UPDATE product_review
      SET rating = $3,
          review = $4,
          time_added = now()
      WHERE product_id = $1
        AND customer_id = $2
      RETURNING review_id, product_id, customer_id, rating, review, time_added
      `,
      [productId, userId, numericRating, review?.trim() || null]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.json({
      message: "Review updated successfully",
      review: updateRes.rows[0],
    });
  } catch (err) {
    console.error("UPDATE REVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;