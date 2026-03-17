import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * GET /api/product-qa/product/:productId
 * Get all questions + answers for a product
 */
router.get("/product/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (!productId || Number.isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const questionResult = await pool.query(
      `
      SELECT
        q.question_id,
        q.product_id,
        q.asked_by,
        q.question_text,
        q.time_asked,
        u.username,
        u.full_name,
        u.profile_img,
        CASE
          WHEN ad.user_id IS NOT NULL THEN 'admin'
          WHEN se.user_id IS NOT NULL THEN 'seller'
          WHEN c.user_id IS NOT NULL THEN 'customer'
          ELSE 'user'
        END AS asker_role
      FROM product_qa q
      JOIN users u ON u.user_id = q.asked_by
      LEFT JOIN admin ad ON ad.user_id = u.user_id
      LEFT JOIN seller se ON se.user_id = u.user_id
      LEFT JOIN customer c ON c.user_id = u.user_id
      WHERE q.product_id = $1
      ORDER BY q.time_asked DESC
      `,
      [productId]
    );

    const answerResult = await pool.query(
      `
      SELECT
        a.answer_id,
        a.question_id,
        a.answered_by,
        a.item_answered,
        a.time_answered,
        u.username,
        u.full_name,
        u.profile_img,
        CASE
          WHEN ad.user_id IS NOT NULL THEN 'admin'
          WHEN se.user_id IS NOT NULL THEN 'seller'
          WHEN c.user_id IS NOT NULL THEN 'customer'
          ELSE 'user'
        END AS responder_role
      FROM product_qa_answer a
      JOIN users u ON u.user_id = a.answered_by
      JOIN product_qa q ON q.question_id = a.question_id
      LEFT JOIN admin ad ON ad.user_id = u.user_id
      LEFT JOIN seller se ON se.user_id = u.user_id
      LEFT JOIN customer c ON c.user_id = u.user_id
      WHERE q.product_id = $1
      ORDER BY a.time_answered ASC
      `,
      [productId]
    );

    const answersByQuestion = {};
    for (const ans of answerResult.rows) {
      if (!answersByQuestion[ans.question_id]) {
        answersByQuestion[ans.question_id] = [];
      }

      answersByQuestion[ans.question_id].push({
        answer_id: ans.answer_id,
        question_id: ans.question_id,
        answered_by: ans.answered_by,
        item_answered: ans.item_answered,
        time_answered: ans.time_answered,
        answered_by_user: {
          username: ans.username,
          full_name: ans.full_name,
          profile_img: ans.profile_img,
          role: ans.responder_role,
        },
      });
    }

    const questions = questionResult.rows.map((q) => ({
      question_id: q.question_id,
      product_id: q.product_id,
      asked_by: q.asked_by,
      question_text: q.question_text,
      time_asked: q.time_asked,
      asked_by_user: {
        username: q.username,
        full_name: q.full_name,
        profile_img: q.profile_img,
        role: q.asker_role,
      },
      answers: answersByQuestion[q.question_id] || [],
    }));

    return res.json({ questions });
  } catch (err) {
    console.error("GET PRODUCT QA ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/product-qa/question
 * Customer asks a question
 */
router.post("/question", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const productId = Number(req.body.product_id);
    const questionText = String(req.body.question_text || "").trim();

    if (!productId || Number.isNaN(productId)) {
      return res.status(400).json({ message: "Valid product_id is required" });
    }

    if (!questionText) {
      return res.status(400).json({ message: "Question text is required" });
    }

    const customerCheck = await pool.query(
      `SELECT user_id FROM customer WHERE user_id = $1`,
      [userId]
    );

    if (customerCheck.rows.length === 0) {
      return res.status(403).json({ message: "Only customers can ask questions" });
    }

    const productCheck = await pool.query(
      `SELECT product_id FROM product WHERE product_id = $1`,
      [productId]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO product_qa (product_id, asked_by, question_text)
      VALUES ($1, $2, $3)
      RETURNING question_id, product_id, asked_by, question_text, time_asked
      `,
      [productId, userId, questionText]
    );

    const userResult = await pool.query(
      `
      SELECT
        u.username,
        u.full_name,
        u.profile_img,
        'customer' AS asker_role
      FROM users u
      WHERE u.user_id = $1
      `,
      [userId]
    );

    return res.status(201).json({
      message: "Question submitted successfully",
      question: {
        ...result.rows[0],
        asked_by_user: {
          username: userResult.rows[0]?.username || null,
          full_name: userResult.rows[0]?.full_name || null,
          profile_img: userResult.rows[0]?.profile_img || null,
          role: userResult.rows[0]?.asker_role || "customer",
        },
        answers: [],
      },
    });
  } catch (err) {
    console.error("ASK PRODUCT QUESTION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/product-qa/answer
 * Seller/Admin answers a question
 */
router.post("/answer", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const questionId = Number(req.body.question_id);
    const answerText = String(req.body.item_answered || "").trim();

    if (!questionId || Number.isNaN(questionId)) {
      return res.status(400).json({ message: "Valid question_id is required" });
    }

    if (!answerText) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const roleCheck = await pool.query(
      `
      SELECT
        EXISTS (SELECT 1 FROM seller WHERE user_id = $1) AS is_seller,
        EXISTS (SELECT 1 FROM admin WHERE user_id = $1) AS is_admin
      `,
      [userId]
    );

    const { is_seller, is_admin } = roleCheck.rows[0];

    if (!is_seller && !is_admin) {
      return res.status(403).json({ message: "Only seller or admin can answer" });
    }

    const questionCheck = await pool.query(
      `
      SELECT
        q.question_id,
        q.product_id,
        p.store_id,
        s.user_id AS seller_user_id
      FROM product_qa q
      JOIN product p ON p.product_id = q.product_id
      JOIN store s ON s.store_id = p.store_id
      WHERE q.question_id = $1
      `,
      [questionId]
    );

    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    const row = questionCheck.rows[0];

    if (!is_admin && Number(row.seller_user_id) !== Number(userId)) {
      return res.status(403).json({
        message: "You can answer only questions for your own products",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO product_qa_answer (question_id, answered_by, item_answered)
      VALUES ($1, $2, $3)
      RETURNING answer_id, question_id, answered_by, item_answered, time_answered
      `,
      [questionId, userId, answerText]
    );

    const userResult = await pool.query(
      `
      SELECT
        u.username,
        u.full_name,
        u.profile_img,
        CASE
          WHEN ad.user_id IS NOT NULL THEN 'admin'
          WHEN se.user_id IS NOT NULL THEN 'seller'
          ELSE 'user'
        END AS responder_role
      FROM users u
      LEFT JOIN admin ad ON ad.user_id = u.user_id
      LEFT JOIN seller se ON se.user_id = u.user_id
      WHERE u.user_id = $1
      `,
      [userId]
    );

    return res.status(201).json({
      message: "Answer submitted successfully",
      answer: {
        ...result.rows[0],
        answered_by_user: {
          username: userResult.rows[0]?.username || null,
          full_name: userResult.rows[0]?.full_name || null,
          profile_img: userResult.rows[0]?.profile_img || null,
          role: userResult.rows[0]?.responder_role || "user",
        },
      },
    });
  } catch (err) {
    console.error("ANSWER PRODUCT QUESTION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;