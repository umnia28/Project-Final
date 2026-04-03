import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * GET /api/promos
 * Active promo list for checkout:
 * - normal active promos for everyone
 * - reward promos only if claimed by the logged-in user and not used
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const { rows } = await pool.query(
      `
      SELECT
        promo_id,
        promo_name,
        promo_status,
        promo_discount,
        promo_start_date,
        promo_end_date,
        promo_code,
        claimed_by_user_id,
        is_reward_promo,
        is_used
      FROM promo
      WHERE promo_status = 'active'
        AND (promo_start_date IS NULL OR promo_start_date <= NOW())
        AND (promo_end_date IS NULL OR promo_end_date >= NOW())
        AND (
          COALESCE(is_reward_promo, FALSE) = FALSE
          OR (
            COALESCE(is_reward_promo, FALSE) = TRUE
            AND claimed_by_user_id = $1
            AND COALESCE(is_used, FALSE) = FALSE
          )
        )
      ORDER BY
        COALESCE(is_reward_promo, FALSE) DESC,
        promo_start_date DESC NULLS LAST,
        promo_id DESC
      `,
      [userId]
    );

    return res.json({
      promos: rows.map((promo) => ({
        promo_id: promo.promo_id,
        code: promo.is_reward_promo ? promo.promo_code : String(promo.promo_id),
        description: promo.is_reward_promo
          ? `${promo.promo_name} (Reward)`
          : promo.promo_name,
        discount: Number(promo.promo_discount),
        promo_start_date: promo.promo_start_date,
        promo_end_date: promo.promo_end_date,
        is_reward_promo: !!promo.is_reward_promo,
      })),
    });
  } catch (err) {
    console.error("GET ACTIVE PROMOS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/promos/code/:code
 * Lookup promo by promo_code (for reward promos / custom codes)
 */
router.get("/code/:code", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const promoCode = String(req.params.code || "").trim();

    if (!promoCode) {
      return res.status(400).json({ message: "Invalid promo code" });
    }

    const { rows } = await pool.query(
      `
      SELECT
        promo_id,
        promo_name,
        promo_status,
        promo_discount,
        promo_start_date,
        promo_end_date,
        promo_code,
        claimed_by_user_id,
        is_reward_promo,
        is_used
      FROM promo
      WHERE promo_code = $1
      `,
      [promoCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Promo not found" });
    }

    const promo = rows[0];
    const now = new Date();

    if (promo.promo_status !== "active") {
      return res.status(400).json({ message: "Promo is not active" });
    }

    if (promo.promo_start_date && new Date(promo.promo_start_date) > now) {
      return res.status(400).json({ message: "Promo has not started yet" });
    }

    if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
      return res.status(400).json({ message: "Promo has expired" });
    }

    if (promo.is_reward_promo) {
      if (promo.claimed_by_user_id !== userId) {
        return res.status(403).json({ message: "This reward promo does not belong to you" });
      }

      if (promo.is_used) {
        return res.status(400).json({ message: "Reward promo already used" });
      }
    }

    return res.json({
      promo: {
        promo_id: promo.promo_id,
        code: promo.promo_code,
        description: promo.promo_name,
        discount: Number(promo.promo_discount),
        is_reward_promo: !!promo.is_reward_promo,
      },
    });
  } catch (err) {
    console.error("PROMO CODE LOOKUP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/promos/:id
 * Promo lookup by promo_id for normal admin promos only
 */
router.get("/:id", async (req, res) => {
  try {
    const promoId = Number(req.params.id);

    if (!promoId) {
      return res.status(400).json({ message: "Invalid promo id" });
    }

    const { rows } = await pool.query(
      `
      SELECT
        promo_id,
        promo_name,
        promo_status,
        promo_discount,
        promo_start_date,
        promo_end_date
      FROM promo
      WHERE promo_id = $1
        AND COALESCE(is_reward_promo, FALSE) = FALSE
      `,
      [promoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Promo not found" });
    }

    const promo = rows[0];
    const now = new Date();

    if (promo.promo_status !== "active") {
      return res.status(400).json({ message: "Promo is not active" });
    }

    if (promo.promo_start_date && new Date(promo.promo_start_date) > now) {
      return res.status(400).json({ message: "Promo has not started yet" });
    }

    if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
      return res.status(400).json({ message: "Promo has expired" });
    }

    return res.json({
      promo: {
        promo_id: promo.promo_id,
        code: String(promo.promo_id),
        description: promo.promo_name,
        discount: Number(promo.promo_discount),
      },
    });
  } catch (err) {
    console.error("PROMO LOOKUP ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

// import express from "express";
// import pool from "../db.js";

// const router = express.Router();

// /**
//  * GET /api/promos
//  * Public normal promo list for checkout
//  */
// router.get("/", async (req, res) => {
//   try {
//     const { rows } = await pool.query(
//       `
//       SELECT
//         promo_id,
//         promo_name,
//         promo_status,
//         promo_discount,
//         promo_start_date,
//         promo_end_date
//       FROM promo
//       WHERE promo_status = 'active'
//         AND COALESCE(is_reward_promo, FALSE) = FALSE
//         AND (promo_start_date IS NULL OR promo_start_date <= NOW())
//         AND (promo_end_date IS NULL OR promo_end_date >= NOW())
//       ORDER BY promo_start_date DESC NULLS LAST, promo_id DESC
//       `
//     );

//     return res.json({
//       promos: rows.map((promo) => ({
//         promo_id: promo.promo_id,
//         code: String(promo.promo_id),
//         description: promo.promo_name,
//         discount: Number(promo.promo_discount),
//         promo_start_date: promo.promo_start_date,
//         promo_end_date: promo.promo_end_date,
//       })),
//     });
//   } catch (err) {
//     console.error("GET ACTIVE PROMOS ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * GET /api/promos/code/:code
//  * Lookup promo by promo_code (for reward promos / custom codes)
//  */
// router.get("/code/:code", async (req, res) => {
//   try {
//     const promoCode = String(req.params.code || "").trim();

//     if (!promoCode) {
//       return res.status(400).json({ message: "Invalid promo code" });
//     }

//     const { rows } = await pool.query(
//       `
//       SELECT
//         promo_id,
//         promo_name,
//         promo_status,
//         promo_discount,
//         promo_start_date,
//         promo_end_date,
//         promo_code,
//         claimed_by_user_id,
//         is_reward_promo,
//         is_used
//       FROM promo
//       WHERE promo_code = $1
//       `,
//       [promoCode]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Promo not found" });
//     }

//     const promo = rows[0];
//     const now = new Date();

//     if (promo.promo_status !== "active") {
//       return res.status(400).json({ message: "Promo is not active" });
//     }

//     if (promo.promo_start_date && new Date(promo.promo_start_date) > now) {
//       return res.status(400).json({ message: "Promo has not started yet" });
//     }

//     if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
//       return res.status(400).json({ message: "Promo has expired" });
//     }

//     if (promo.is_reward_promo && promo.is_used) {
//       return res.status(400).json({ message: "Reward promo already used" });
//     }

//     return res.json({
//       promo: {
//         promo_id: promo.promo_id,
//         code: promo.promo_code,
//         description: promo.promo_name,
//         discount: Number(promo.promo_discount),
//         is_reward_promo: promo.is_reward_promo,
//       },
//     });
//   } catch (err) {
//     console.error("PROMO CODE LOOKUP ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * GET /api/promos/:id
//  * Promo lookup by promo_id for existing admin promos
//  */
// router.get("/:id", async (req, res) => {
//   try {
//     const promoId = Number(req.params.id);

//     if (!promoId) {
//       return res.status(400).json({ message: "Invalid promo id" });
//     }

//     const { rows } = await pool.query(
//       `
//       SELECT
//         promo_id,
//         promo_name,
//         promo_status,
//         promo_discount,
//         promo_start_date,
//         promo_end_date
//       FROM promo
//       WHERE promo_id = $1
//         AND COALESCE(is_reward_promo, FALSE) = FALSE
//       `,
//       [promoId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Promo not found" });
//     }

//     const promo = rows[0];
//     const now = new Date();

//     if (promo.promo_status !== "active") {
//       return res.status(400).json({ message: "Promo is not active" });
//     }

//     if (promo.promo_start_date && new Date(promo.promo_start_date) > now) {
//       return res.status(400).json({ message: "Promo has not started yet" });
//     }

//     if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
//       return res.status(400).json({ message: "Promo has expired" });
//     }

//     return res.json({
//       promo: {
//         promo_id: promo.promo_id,
//         code: String(promo.promo_id),
//         description: promo.promo_name,
//         discount: Number(promo.promo_discount),
//       },
//     });
//   } catch (err) {
//     console.error("PROMO LOOKUP ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

