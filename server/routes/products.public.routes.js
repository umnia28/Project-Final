/*import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("1. public products route hit");

    const search = (req.query.search || "").trim();

    const q = `
      SELECT
        p.product_id,
        p.product_name,
        p.product_description,
        p.price,
        p.discount,
        p.store_id,
        s.store_name,
        s.ref_no,
        u.profile_img AS store_logo,
        COALESCE(array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '{}') AS images
      FROM product p
      JOIN store s ON s.store_id = p.store_id
      JOIN users u ON u.user_id = s.user_id
      LEFT JOIN product_image pi ON pi.product_id = p.product_id
      WHERE p.visibility_status = TRUE
        AND p.status = 'active'
        AND ($1 = '' OR LOWER(p.product_name) LIKE '%' || LOWER($1) || '%')
      GROUP BY p.product_id, s.store_name, s.ref_no, u.profile_img
      ORDER BY p.date_added DESC
    `;

    console.log("2. before query");
    const result = await pool.query(q, [search]);
    console.log("3. query finished", result.rows.length);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const products = result.rows.map((r) => ({
      id: r.product_id,
      name: r.product_name,
      description: r.product_description,
      price: Number(r.price),
      mrp: Number(r.price) + Number(r.discount || 0),
      images: (r.images || []).map((img) => `${baseUrl}/uploads/${img}`),
      rating: [],
      store: {
        id: r.store_id,
        name: r.store_name,
        username: r.ref_no ?? String(r.store_id),
        logo: r.store_logo ? `${baseUrl}/uploads/${r.store_logo}` : null,
      },
    }));

    return res.json({ products });
  } catch (err) {
    console.error("PUBLIC PRODUCTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;




// import express from "express";
// import pool from "../db.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   const search = (req.query.search || "").trim();

//   const q = `
//     SELECT
//       p.product_id,
//       p.product_name,
//       p.product_description,
//       p.price,
//       p.discount,
//       p.store_id,

//       s.store_name,
//       s.ref_no,
//       u.profile_img AS store_logo,

//       COALESCE(array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '{}') AS images
//     FROM product p
//     JOIN store s ON s.store_id = p.store_id
//     JOIN users u ON u.user_id = s.user_id
//     LEFT JOIN product_image pi ON pi.product_id = p.product_id
//     WHERE p.visibility_status = TRUE
//       AND p.status = 'active'
//       AND ($1 = '' OR LOWER(p.product_name) LIKE '%' || LOWER($1) || '%')
//     GROUP BY p.product_id, s.store_name, s.ref_no, u.profile_img
//     ORDER BY p.date_added DESC
//   `;

//   const result = await pool.query(q, [search]);

//   //   const products = result.rows.map((r) => ({
//   //     id: r.product_id,
//   //     name: r.product_name,
//   //     description: r.product_description,
//   //     price: Number(r.price),
//   //     mrp: Number(r.price) + Number(r.discount || 0),

//   //     images: r.images || [], // [" /uploads/.. ", ...]
//   //     rating: [],

//   //     store: {
//   //       id: r.store_id,
//   //       name: r.store_name,
//   //       username: r.ref_no ?? String(r.store_id),
//   //       logo: r.store_logo || null,
//   //     },
//   //   }));

//   //   res.json({ products });
//   // });

//   const products = result.rows.map((r) => ({
//     id: r.product_id,
//     name: r.product_name,
//     description: r.product_description,
//     price: Number(r.price),
//     mrp: Number(r.price) + Number(r.discount || 0),

//     images: (r.images || []).map((img) => `${req.protocol}://localhost:5000/uploads/${img}`),
//     rating: [],

//     store: {
//       id: r.store_id,
//       name: r.store_name,
//       username: r.ref_no ?? String(r.store_id),
//       logo: r.store_logo
//         ? `${req.protocol}://localhost:5000/uploads/${r.store_logo}`
//         : null,
//     },
//   }));
// });
// export default router;
*/

import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const search = (req.query.search || "").trim();

  const q = `
    SELECT
      p.product_id,
      p.product_name,
      p.product_description,
      p.price,
      p.discount,
      p.store_id,

      s.store_name,
      s.ref_no,
      u.profile_img AS store_logo,

      COALESCE(array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '{}') AS images
    FROM product p
    JOIN store s ON s.store_id = p.store_id
    JOIN users u ON u.user_id = s.user_id
    LEFT JOIN product_image pi ON pi.product_id = p.product_id
    WHERE p.visibility_status = TRUE
      AND p.status = 'active'
      AND ($1 = '' OR LOWER(p.product_name) LIKE '%' || LOWER($1) || '%')
    GROUP BY p.product_id, s.store_name, s.ref_no, u.profile_img
    ORDER BY p.date_added DESC
  `;

  const result = await pool.query(q, [search]);

  const products = result.rows.map((r) => ({
    id: r.product_id,
    name: r.product_name,
    description: r.product_description,
    price: Number(r.price),
    mrp: Number(r.price) + Number(r.discount || 0),

    images: r.images || [], // [" /uploads/.. ", ...]
    rating: [],

    store: {
      id: r.store_id,
      name: r.store_name,
      username: r.ref_no ?? String(r.store_id),
      logo: r.store_logo || null,
    },
  }));

  res.json({ products });
});

export default router;

