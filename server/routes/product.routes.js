import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/products
 * Public shop listing
 * Supports: ?search=...
 */
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    const { rows } = await pool.query(
      `
      SELECT
        p.product_id,
        p.product_name,
        p.price,
        p.discount,
        p.product_description,
        p.product_count,
        p.status,
        p.visibility_status,
        p.date_added,
        c.category_id,
        c.category_name,
        st.store_id,
        st.store_name,
        st.ref_no,
        u.profile_img AS store_logo,

        COALESCE(img.images, '{}') AS images,
        COALESCE(rv.rating_avg, 0)::numeric(3,2) AS rating_avg,
        COALESCE(rv.rating_count, 0)::int AS rating_count

      FROM product p
      LEFT JOIN category c ON c.category_id = p.category_id
      JOIN store st ON st.store_id = p.store_id
      JOIN users u ON u.user_id = st.user_id

      LEFT JOIN LATERAL (
        SELECT
          array_agg(pi.image_url ORDER BY pi.created_at ASC)
            FILTER (WHERE pi.image_url IS NOT NULL) AS images
        FROM product_image pi
        WHERE pi.product_id = p.product_id
      ) img ON true

      LEFT JOIN LATERAL (
        SELECT
          AVG(pr.rating) AS rating_avg,
          COUNT(pr.review_id) AS rating_count
        FROM product_review pr
        WHERE pr.product_id = p.product_id
      ) rv ON true

      WHERE p.visibility_status = TRUE
        AND p.status = 'active'
        AND ($1 = '' OR p.product_name ILIKE '%' || $1 || '%')

      ORDER BY p.date_added DESC
      `,
      [search]
    );

    const products = rows.map((r) => ({
      id: Number(r.product_id),
      product_id: Number(r.product_id),

      name: r.product_name,
      product_name: r.product_name,

      description: r.product_description || "",
      product_description: r.product_description || "",

      price: Number(r.price ?? 0),
      discount: Number(r.discount ?? 0),
      mrp: Number(r.price ?? 0) + Number(r.discount ?? 0),

      product_count: Number(r.product_count ?? 0),
      status: String(r.status || "active").toLowerCase(),
      visibility_status: r.visibility_status,

      category: r.category_name || "Artwork",
      category_name: r.category_name || "Artwork",
      category_id: r.category_id ? Number(r.category_id) : null,

      store_id: Number(r.store_id),

      images: Array.isArray(r.images) ? r.images.filter(Boolean) : [],
      thumbnail:
        Array.isArray(r.images) && r.images.length > 0 ? r.images[0] : null,

      rating: [],
      rating_avg: Number(r.rating_avg ?? 0),
      rating_count: Number(r.rating_count ?? 0),

      store: {
        id: Number(r.store_id),
        store_id: Number(r.store_id),
        name: r.store_name,
        ref_no: r.ref_no,
        username: r.ref_no ?? String(r.store_id),
        logo: r.store_logo || null,
      },
    }));

    return res.json({ products });
  } catch (err) {
    console.error("GET /api/products ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/products/:productId
 * Public single product details
 */
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const productRes = await pool.query(
      `
      SELECT
        p.product_id,
        p.product_name,
        p.price,
        p.discount,
        p.product_description,
        p.product_count,
        p.status,
        p.visibility_status,
        p.date_added,
        c.category_id,
        c.category_name,
        st.store_id,
        st.store_name,
        st.ref_no,
        u.profile_img AS store_logo,
        COALESCE(rv.rating_avg, 0)::numeric(3,2) AS rating_avg,
        COALESCE(rv.rating_count, 0)::int AS rating_count
      FROM product p
      LEFT JOIN category c ON c.category_id = p.category_id
      JOIN store st ON st.store_id = p.store_id
      JOIN users u ON u.user_id = st.user_id

      LEFT JOIN LATERAL (
        SELECT
          AVG(pr.rating) AS rating_avg,
          COUNT(pr.review_id) AS rating_count
        FROM product_review pr
        WHERE pr.product_id = p.product_id
      ) rv ON true

      WHERE p.product_id = $1
        AND p.visibility_status = TRUE
      `,
      [productId]
    );

    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const p = productRes.rows[0];

    const imageRes = await pool.query(
      `
      SELECT image_url
      FROM product_image
      WHERE product_id = $1
      ORDER BY created_at ASC
      `,
      [productId]
    );

    const reviewRes = await pool.query(
      `
      SELECT
        review_id,
        customer_id,
        rating,
        review,
        time_added
      FROM product_review
      WHERE product_id = $1
      ORDER BY time_added DESC
      `,
      [productId]
    );

    const product = {
      id: Number(p.product_id),
      product_id: Number(p.product_id),

      name: p.product_name,
      product_name: p.product_name,

      description: p.product_description || "",
      product_description: p.product_description || "",

      price: Number(p.price ?? 0),
      discount: Number(p.discount ?? 0),
      mrp: Number(p.price ?? 0) + Number(p.discount ?? 0),

      product_count: Number(p.product_count ?? 0),
      status: String(p.status || "active").toLowerCase(),
      visibility_status: p.visibility_status,

      category: p.category_name || "Artwork",
      category_name: p.category_name || "Artwork",
      category_id: p.category_id ? Number(p.category_id) : null,

      store_id: Number(p.store_id),

      images: imageRes.rows.map((row) => row.image_url).filter(Boolean),
      thumbnail: imageRes.rows.length > 0 ? imageRes.rows[0].image_url : null,

      rating: reviewRes.rows,
      rating_avg: Number(p.rating_avg ?? 0),
      rating_count: Number(p.rating_count ?? 0),

      store: {
        id: Number(p.store_id),
        store_id: Number(p.store_id),
        name: p.store_name,
        ref_no: p.ref_no,
        username: p.ref_no ?? String(p.store_id),
        logo: p.store_logo || null,
      },
    };

    return res.json({ product });
  } catch (err) {
    console.error("GET /api/products/:productId ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;