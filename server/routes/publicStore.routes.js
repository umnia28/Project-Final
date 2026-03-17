import express from "express"
import pool from "../db.js"

const router = express.Router()

router.get("/id/:storeRef", async (req, res) => {
  try {
    const storeRef = String(req.params.storeRef).trim()

    if (!storeRef) {
      return res.status(400).json({ message: "Invalid store reference" })
    }

    const storeRes = await pool.query(
      `
      SELECT
        s.store_id,
        s.store_name,
        s.store_status,
        s.ref_no,
        u.user_id,
        u.username,
        u.email,
        u.profile_img AS logo,
        u.full_name
      FROM store s
      JOIN users u ON u.user_id = s.user_id
      WHERE s.ref_no::text = $1
      LIMIT 1
      `,
      [storeRef]
    )

    if (storeRes.rows.length === 0) {
      return res.status(404).json({ message: "Store not found" })
    }

    const store = storeRes.rows[0]

    const productsRes = await pool.query(
      `
      SELECT
        p.product_id,
        p.product_name,
        p.product_description,
        p.price,
        p.discount,
        p.category_id,
        c.category_name,
        p.product_count,
        p.status,
        p.visibility_status,
        COALESCE(
          json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
          '[]'
        ) AS images
      FROM product p
      LEFT JOIN category c ON c.category_id = p.category_id
      LEFT JOIN product_image pi ON pi.product_id = p.product_id
      WHERE p.store_id = $1
        AND p.visibility_status = TRUE
        AND p.status = 'active'
      GROUP BY
        p.product_id,
        p.product_name,
        p.product_description,
        p.price,
        p.discount,
        p.category_id,
        c.category_name,
        p.product_count,
        p.status,
        p.visibility_status
      ORDER BY p.date_added DESC
      `,
      [store.store_id]
    )

    const fullStore = {
      ...store,
      description: `${store.store_name} store`,
      address: store.ref_no ? `Ref: ${store.ref_no}` : "Address not available",
    }

    return res.json({
      store: fullStore,
      products: productsRes.rows,
    })
  } catch (err) {
    console.error("GET PUBLIC STORE BY REF ERROR:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router