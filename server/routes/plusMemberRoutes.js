import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ ok: true, message: "plusMember route works" });
});

router.get("/status", verifyToken, requireRole("user", "customer"), async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `
      SELECT user_id, points, is_plus_member, plus_expiry
      FROM customer
      WHERE user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found",
      });
    }

    return res.json({
      success: true,
      customer: result.rows[0],
    });
  } catch (err) {
    console.error("PLUS STATUS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plus status",
    });
  }
});

router.post("/subscribe", verifyToken, requireRole("user", "customer"), async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required",
      });
    }

    if (!["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    const customerCheck = await client.query(
      `
      SELECT user_id, points, is_plus_member, plus_expiry
      FROM customer
      WHERE user_id = $1
      `,
      [userId]
    );

    if (customerCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found",
      });
    }

    const currentCustomer = customerCheck.rows[0];

    const alreadyActive =
      currentCustomer.is_plus_member &&
      currentCustomer.plus_expiry &&
      new Date(currentCustomer.plus_expiry) > new Date();

    if (alreadyActive) {
      return res.status(400).json({
        success: false,
        message: "You are already a Plus Member",
        customer: currentCustomer,
      });
    }

    await client.query("BEGIN");

    const expirySql =
      plan === "monthly"
        ? `NOW() + INTERVAL '30 days'`
        : `NOW() + INTERVAL '1 year'`;

    const bonusPoints = plan === "monthly" ? 100 : 1200;

    const updateRes = await client.query(
      `
      UPDATE customer
      SET
        is_plus_member = TRUE,
        plus_expiry = ${expirySql},
        points = COALESCE(points, 0) + $1
      WHERE user_id = $2
      RETURNING user_id, points, is_plus_member, plus_expiry
      `,
      [bonusPoints, userId]
    );

    await client.query(
      `
      INSERT INTO notification (
        user_id,
        notification_description,
        seen_status,
        time_added
      )
      VALUES ($1, $2, FALSE, NOW())
      `,
      [
        userId,
        `Your Plus Membership (${plan}) has been activated successfully.`,
      ]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Subscription successful",
      plan,
      bonus_points_added: bonusPoints,
      customer: updateRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PLUS MEMBERSHIP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      detail: err.detail || null,
    });
  } finally {
    client.release();
  }
});

export default router;


// import express from "express";
// import pool from "../db.js";
// import { verifyToken } from "../middleware/verifyToken.js";
// import { requireRole } from "../middleware/requireRole.js";

// const router = express.Router();

// /**
//  * POST /api/plusMember/subscribe
//  * customer subscribes to plus membership
//  */
// router.post(
//   "/subscribe",
//   verifyToken,
//   requireRole("customer"),
//   async (req, res) => {
//     const client = await pool.connect();

//     try {
//       const userId = req.user.user_id;
//       const { plan } = req.body;

//       if (!plan) {
//         return res.status(400).json({
//           success: false,
//           message: "Plan is required",
//         });
//       }

//       if (!["monthly", "yearly"].includes(plan)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid plan selected",
//         });
//       }

//       const customerCheck = await client.query(
//         `
//         SELECT user_id, points, is_plus_member, plus_expiry
//         FROM customer
//         WHERE user_id = $1
//         `,
//         [userId]
//       );

//       if (customerCheck.rows.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer account not found",
//         });
//       }

//       const currentCustomer = customerCheck.rows[0];

//       const alreadyActive =
//         currentCustomer.is_plus_member &&
//         currentCustomer.plus_expiry &&
//         new Date(currentCustomer.plus_expiry) > new Date();

//       if (alreadyActive) {
//         return res.status(400).json({
//           success: false,
//           message: "You are already a Plus Member",
//           customer: currentCustomer,
//         });
//       }

//       await client.query("BEGIN");

//       const expirySql =
//         plan === "monthly"
//           ? `NOW() + INTERVAL '30 days'`
//           : `NOW() + INTERVAL '1 year'`;

//       const bonusPoints = plan === "monthly" ? 100 : 1200;

//       const updateRes = await client.query(
//         `
//         UPDATE customer
//         SET
//           is_plus_member = TRUE,
//           plus_expiry = ${expirySql},
//           points = COALESCE(points, 0) + $1
//         WHERE user_id = $2
//         RETURNING user_id, points, is_plus_member, plus_expiry
//         `,
//         [bonusPoints, userId]
//       );

//       await client.query(
//         `
//         INSERT INTO notification (
//           user_id,
//           notification_description,
//           seen_status,
//           time_added
//         )
//         VALUES ($1, $2, FALSE, NOW())
//         `,
//         [
//           userId,
//           `Your Plus Membership (${plan}) has been activated successfully.`,
//         ]
//       );

//       await client.query("COMMIT");

//       return res.status(200).json({
//         success: true,
//         message: "Subscription successful",
//         plan,
//         bonus_points_added: bonusPoints,
//         customer: updateRes.rows[0],
//       });
//     } catch (err) {
//       await client.query("ROLLBACK");
//       console.error("PLUS MEMBERSHIP ERROR:", err);

//       return res.status(500).json({
//         success: false,
//         message: "Server error",
//         error: err.message,
//         detail: err.detail || null,
//       });
//     } finally {
//       client.release();
//     }
//   }
// );

// export default router;

