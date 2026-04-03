import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.post("/claim-reward", verifyToken, requireRole("user", "customer"), async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { reward_type } = req.body;

    if (!reward_type) {
      return res.status(400).json({
        success: false,
        message: "reward_type is required",
      });
    }

    await client.query("BEGIN");

    await client.query(
      `
      CALL claim_points_reward($1, $2, $3, $4, $5, $6)
      `,
      [userId, reward_type, false, null, null, null]
    );

    const customerRes = await client.query(
      `
      SELECT points
      FROM customer
      WHERE user_id = $1
      `,
      [userId]
    );

    const promoRes = await client.query(
      `
      SELECT
        promo_id,
        promo_name,
        promo_code,
        promo_discount,
        promo_end_date,
        points_required,
        is_reward_promo,
        is_used
      FROM promo
      WHERE claimed_by_user_id = $1
        AND is_reward_promo = TRUE
      ORDER BY promo_id DESC
      LIMIT 1
      `,
      [userId]
    );

    await client.query("COMMIT");

    if (promoRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Reward claim failed",
      });
    }

    return res.json({
      success: true,
      message: "Reward promo claimed successfully",
      remaining_points: Number(customerRes.rows[0]?.points || 0),
      promo: promoRes.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CLAIM REWARD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
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

// router.post("/claim-reward", verifyToken, requireRole("customer"), async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const userId = req.user.user_id;
//     const { reward_type } = req.body;

//     if (!reward_type) {
//       return res.status(400).json({
//         success: false,
//         message: "reward_type is required",
//       });
//     }

//     await client.query("BEGIN");

//     await client.query(
//       `
//       CALL claim_points_reward($1, $2, $3, $4, $5, $6)
//       `,
//       [userId, reward_type, false, null, null, null]
//     );

//     const customerRes = await client.query(
//       `
//       SELECT points
//       FROM customer
//       WHERE user_id = $1
//       `,
//       [userId]
//     );

//     const promoRes = await client.query(
//       `
//       SELECT
//         promo_id,
//         promo_name,
//         promo_code,
//         promo_discount,
//         promo_end_date,
//         points_required,
//         is_reward_promo,
//         is_used
//       FROM promo
//       WHERE claimed_by_user_id = $1
//         AND is_reward_promo = TRUE
//       ORDER BY promo_id DESC
//       LIMIT 1
//       `,
//       [userId]
//     );

//     await client.query("COMMIT");

//     if (promoRes.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Reward claim failed",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "Reward promo claimed successfully",
//       remaining_points: Number(customerRes.rows[0]?.points || 0),
//       promo: promoRes.rows[0],
//     });
//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("CLAIM REWARD ERROR:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message || "Server error",
//     });
//   } finally {
//     client.release();
//   }
// });

// export default router;