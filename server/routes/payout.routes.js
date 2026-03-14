import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
    console.log("PAYOUT TEST ROUTE HIT");
    res.json({ ok: true, message: "payout route works" });
});

// GET ALL PAYOUTS
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT *
      FROM payout
      ORDER BY payout_id DESC
    `);

        return res.json({
            success: true,
            payouts: result.rows,
        });
    } catch (error) {
        console.error("GET PAYOUTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch payouts",
        });
    }
});

// PREVIEW PENDING PAYOUT FOR A STORE
router.get("/preview/:store_id", async (req, res) => {
    const { store_id } = req.params;

    try {
        const storeRes = await pool.query(
            `SELECT store_id, store_name, user_id FROM store WHERE store_id = $1`,
            [store_id]
        );

        if (storeRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        const previewRes = await pool.query(
            `
      SELECT
        COUNT(*)::int AS unpaid_items,
        COALESCE(SUM(oi.seller_earnings), 0) AS pending_amount
      FROM order_item oi
      JOIN product p ON oi.product_id = p.product_id
      WHERE p.store_id = $1
        AND oi.order_item_id NOT IN (
          SELECT order_item_id FROM payout_item
        )
      `,
            [store_id]
        );

        return res.json({
            success: true,
            store_id: Number(store_id),
            store_name: storeRes.rows[0].store_name,
            seller_id: storeRes.rows[0].user_id,
            unpaid_items: previewRes.rows[0].unpaid_items,
            pending_amount: previewRes.rows[0].pending_amount,
        });
    } catch (error) {
        console.error("PREVIEW PAYOUT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to preview payout",
        });
    }
});

// CREATE PAYOUT FOR A STORE
router.post("/create", async (req, res) => {
    console.log("PAYOUT ROUTE HIT");
    console.log("BODY:", req.body);

    const { store_id } = req.body;

    if (!store_id) {
        return res.status(400).json({
            success: false,
            message: "store_id is required",
        });
    }

    try {
        const dbCheck = await pool.query(
            "SELECT current_database(), current_schema()"
        );
        console.log("DB CHECK:", dbCheck.rows);

        const storeRes = await pool.query(
            `SELECT user_id FROM store WHERE store_id = $1`,
            [store_id]
        );
        console.log("storeRes:", storeRes.rows);

        if (storeRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        const seller_id = storeRes.rows[0].user_id;

        const itemsRes = await pool.query(
            `
      SELECT oi.order_item_id, oi.seller_earnings
      FROM order_item oi
      JOIN product p ON oi.product_id = p.product_id
      WHERE p.store_id = $1
        AND oi.order_item_id NOT IN (
          SELECT order_item_id FROM payout_item
        )
      `,
            [store_id]
        );
        console.log("itemsRes:", itemsRes.rows);

        if (itemsRes.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No unpaid items found for this store",
            });
        }

        const totalAmount = itemsRes.rows.reduce(
            (sum, item) => sum + Number(item.seller_earnings),
            0
        );
        console.log("totalAmount:", totalAmount);

        const payoutRes = await pool.query(
            `
      INSERT INTO payout
      (seller_id, store_id, payout_status, payout_date, amount)
      VALUES ($1, $2, 'pending', NOW(), $3)
      RETURNING *
      `,
            [seller_id, store_id, totalAmount]
        );
        console.log("payoutRes:", payoutRes.rows);

        const payout_id = payoutRes.rows[0].payout_id;

        for (const item of itemsRes.rows) {
            const payoutItemRes = await pool.query(
                `
        INSERT INTO payout_item (payout_id, order_item_id)
        VALUES ($1, $2)
        RETURNING *
        `,
                [payout_id, item.order_item_id]
            );
            console.log("payoutItem inserted:", payoutItemRes.rows);
        }

        return res.status(201).json({
            success: true,
            message: "Payout created successfully",
            payout_id,
            seller_id,
            store_id,
            totalAmount,
            items_count: itemsRes.rows.length,
        });
    } catch (error) {
        console.error("CREATE PAYOUT ERROR FULL:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            detail: error.detail || null,
            code: error.code || null,
        });
    }
});

// MARK PAYOUT AS PAID
router.put("/:id/pay", async (req, res) => {
    const { id } = req.params;
    const { method, reference_no } = req.body;

    if (!method || !reference_no) {
        return res.status(400).json({
            success: false,
            message: "Method and reference number are required to mark payout as paid",
        });
    }

    try {
        const result = await pool.query(
            `
      UPDATE payout
      SET payout_status = 'paid',
          method = $1,
          reference_no = $2,
          payout_date = NOW()
      WHERE payout_id = $3
      RETURNING *
      `,
            [method, reference_no, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payout not found",
            });
        }

        return res.json({
            success: true,
            message: "Payout marked as paid",
            payout: result.rows[0],
        });
    } catch (error) {
        console.error("MARK PAYOUT PAID ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update payout",
        });
    }
});
export default router;