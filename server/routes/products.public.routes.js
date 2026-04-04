import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * GET /api/products
 * Public shop listing
 * Supports:
 *   ?search=...
 *   ?page=1
 */
router.get("/", async (req, res) => {
  try {
    console.log("1. public products route hit");

    const search = (req.query.search || "").trim();
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 30;
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      `
      SELECT COUNT(DISTINCT p.product_id)::int AS total
      FROM product p
      LEFT JOIN category c ON c.category_id = p.category_id
      JOIN store st ON st.store_id = p.store_id
      JOIN users u ON u.user_id = st.user_id
      WHERE p.visibility_status = TRUE
        AND p.status = 'active'
        AND st.store_status = 'active'
        AND ($1 = '' OR p.product_name ILIKE '%' || $1 || '%')
      `,
      [search]
    );

    const total = countResult.rows[0]?.total || 0;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

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

        COALESCE(ROUND(AVG(pr.rating)::numeric, 1), 0) AS rating_avg,
        COUNT(pr.review_id)::int AS rating_count,

        COALESCE(
          array_agg(DISTINCT pi.image_url)
          FILTER (WHERE pi.image_url IS NOT NULL),
          '{}'
        ) AS images

      FROM product p
      LEFT JOIN category c ON c.category_id = p.category_id
      JOIN store st ON st.store_id = p.store_id
      JOIN users u ON u.user_id = st.user_id
      LEFT JOIN product_image pi ON pi.product_id = p.product_id
      LEFT JOIN product_review pr ON pr.product_id = p.product_id

      WHERE p.visibility_status = TRUE
        AND p.status = 'active'
        AND st.store_status = 'active'
        AND ($1 = '' OR p.product_name ILIKE '%' || $1 || '%')

      GROUP BY
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
        u.profile_img

      ORDER BY p.date_added DESC
      LIMIT $2 OFFSET $3
      `,
      [search, limit, offset]
    );

    console.log("2. query finished", rows.length);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const normalizeUploadUrl = (file) => {
      if (!file) return null;
      const value = String(file);
      if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
      }
      return `${baseUrl}/uploads/${value.replace(/^\/?uploads\/?/, "")}`;
    };

    const products = rows.map((r) => {
      const originalPrice = Number(r.price ?? 0);
      const discountPercent = Number(r.discount ?? 0);
      const discountAmount = Math.round((originalPrice * discountPercent) / 100);
      const finalPrice = originalPrice - discountAmount;

      return {
        id: Number(r.product_id),
        product_id: Number(r.product_id),

        name: r.product_name,
        product_name: r.product_name,

        description: r.product_description || "",
        product_description: r.product_description || "",

        price: finalPrice,
        final_price: finalPrice,

        base_price: originalPrice,
        mrp: originalPrice,

        discount: discountPercent,
        discount_percent: discountPercent,
        discount_amount: discountAmount,

        product_count: Number(r.product_count ?? 0),
        status: String(r.status || "active").toLowerCase(),
        visibility_status: r.visibility_status,

        category: r.category_name || "Artwork",
        category_name: r.category_name || "Artwork",
        category_id: r.category_id ? Number(r.category_id) : null,

        store_id: Number(r.store_id),

        images: Array.isArray(r.images)
          ? r.images.filter(Boolean).map((img) => normalizeUploadUrl(img))
          : [],

        thumbnail:
          Array.isArray(r.images) && r.images.length > 0
            ? normalizeUploadUrl(r.images[0])
            : null,

        rating_avg: Number(r.rating_avg ?? 0),
        rating_count: Number(r.rating_count ?? 0),

        store: {
          id: Number(r.store_id),
          store_id: Number(r.store_id),
          name: r.store_name,
          ref_no: r.ref_no,
          username: r.ref_no ?? String(r.store_id),
          logo: r.store_logo ? normalizeUploadUrl(r.store_logo) : null,
        },
      };
    });

    return res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("GET /api/products ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE PRODUCT WITH VARIANTS
router.get("/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

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

        st.store_id,
        st.store_name,

        COALESCE(
          (
            SELECT json_agg(pi.image_url)
            FROM product_image pi
            WHERE pi.product_id = p.product_id
          ),
          '[]'
        ) AS images,

        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'attribute_name', pa.attribute_name,
                'attribute_value', pa.attribute_value,
                'new_price', pa.new_price,
                'stock', pa.stock,
                'base_spec', pa.base_spec
              )
            )
            FROM product_attributes pa
            WHERE pa.product_id = p.product_id
          ),
          '[]'
        ) AS attributes

      FROM product p
      JOIN store st ON st.store_id = p.store_id

      WHERE p.product_id = $1
        AND p.status = 'active'
        AND p.visibility_status = TRUE
        AND st.store_status = 'active'
      `,
      [productId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const normalizeUploadUrl = (file) => {
      if (!file) return null;
      const value = String(file);
      if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
      }
      return `${baseUrl}/uploads/${value.replace(/^\/?uploads\/?/, "")}`;
    };

    const product = rows[0];

    res.json({
      product: {
        ...product,
        product_id: Number(product.product_id),
        price: Number(product.price ?? 0),
        discount: Number(product.discount ?? 0),
        product_count: Number(product.product_count ?? 0),
        store_id: Number(product.store_id),
        images: Array.isArray(product.images)
          ? product.images.filter(Boolean).map((img) => normalizeUploadUrl(img))
          : [],
        attributes: Array.isArray(product.attributes)
          ? product.attributes.map((attr) => ({
              ...attr,
              new_price:
                attr?.new_price !== null && attr?.new_price !== undefined
                  ? Number(attr.new_price)
                  : null,
              stock:
                attr?.stock !== null && attr?.stock !== undefined
                  ? Number(attr.stock)
                  : 0,
            }))
          : [],
      },
    });
  } catch (err) {
    console.error("GET PRODUCT DETAILS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

// import express from "express";
// import pool from "../db.js";

// const router = express.Router();

// /**
//  * GET /api/products
//  * Public shop listing
//  * Supports:
//  *   ?search=...
//  *   ?page=1
//  */
// router.get("/", async (req, res) => {
//   try {
//     console.log("1. public products route hit");

//     const search = (req.query.search || "").trim();
//     const page = Math.max(Number(req.query.page) || 1, 1);
//     const limit = 30;
//     const offset = (page - 1) * limit;

//     // total count for pagination
//     const countResult = await pool.query(
//       `
//       SELECT COUNT(DISTINCT p.product_id)::int AS total
//       FROM product p
//       LEFT JOIN category c ON c.category_id = p.category_id
//       JOIN store st ON st.store_id = p.store_id
//       JOIN users u ON u.user_id = st.user_id
//       WHERE p.visibility_status = TRUE
//         AND p.status = 'active'
//         AND ($1 = '' OR p.product_name ILIKE '%' || $1 || '%')
//       `,
//       [search]
//     );

//     const total = countResult.rows[0]?.total || 0;
//     const totalPages = Math.max(Math.ceil(total / limit), 1);

//     const { rows } = await pool.query(
//       `
//       SELECT
//         p.product_id,
//         p.product_name,
//         p.price,
//         p.discount,
//         p.product_description,
//         p.product_count,
//         p.status,
//         p.visibility_status,
//         p.date_added,
//         c.category_id,
//         c.category_name,
//         st.store_id,
//         st.store_name,
//         st.ref_no,
//         u.profile_img AS store_logo,

//         COALESCE(ROUND(AVG(pr.rating)::numeric, 1), 0) AS rating_avg,
//         COUNT(pr.review_id)::int AS rating_count,

//         COALESCE(
//           array_agg(DISTINCT pi.image_url)
//           FILTER (WHERE pi.image_url IS NOT NULL),
//           '{}'
//         ) AS images

//       FROM product p
//       LEFT JOIN category c ON c.category_id = p.category_id
//       JOIN store st ON st.store_id = p.store_id
//       JOIN users u ON u.user_id = st.user_id
//       LEFT JOIN product_image pi ON pi.product_id = p.product_id
//       LEFT JOIN product_review pr ON pr.product_id = p.product_id

//       WHERE p.visibility_status = TRUE
//         AND p.status = 'active'
//         AND ($1 = '' OR p.product_name ILIKE '%' || $1 || '%')

//       GROUP BY
//         p.product_id,
//         p.product_name,
//         p.price,
//         p.discount,
//         p.product_description,
//         p.product_count,
//         p.status,
//         p.visibility_status,
//         p.date_added,
//         c.category_id,
//         c.category_name,
//         st.store_id,
//         st.store_name,
//         st.ref_no,
//         u.profile_img

//       ORDER BY p.date_added DESC
//       LIMIT $2 OFFSET $3
//       `,
//       [search, limit, offset]
//     );

//     console.log("2. query finished", rows.length);

//     const baseUrl = `${req.protocol}://${req.get("host")}`;

//     const products = rows.map((r) => {
//       const originalPrice = Number(r.price ?? 0); // DB price = original price
//       const discountPercent = Number(r.discount ?? 0); // DB discount = percent
//       const discountAmount = Math.round(
//         (originalPrice * discountPercent) / 100
//       );
//       const finalPrice = originalPrice - discountAmount;

//       return {
//         id: Number(r.product_id),
//         product_id: Number(r.product_id),

//         name: r.product_name,
//         product_name: r.product_name,

//         description: r.product_description || "",
//         product_description: r.product_description || "",

//         // final discounted price for frontend
//         price: finalPrice,
//         final_price: finalPrice,

//         // original/or crossed price
//         base_price: originalPrice,
//         mrp: originalPrice,

//         // discount info
//         discount: discountPercent,
//         discount_percent: discountPercent,
//         discount_amount: discountAmount,

// <<<<<<< HEAD
//         product_count: Number(r.product_count ?? 0),
//         status: String(r.status || "active").toLowerCase(),
//         visibility_status: r.visibility_status,

//         category: r.category_name || "Artwork",
//         category_name: r.category_name || "Artwork",
//         category_id: r.category_id ? Number(r.category_id) : null,

//         store_id: Number(r.store_id),

//         images: Array.isArray(r.images)
//           ? r.images
//               .filter(Boolean)
//               .map((img) =>
//                 String(img).startsWith("http://") ||
//                 String(img).startsWith("https://")
//                   ? img
//                   : `${baseUrl}/uploads/${String(img).replace(/^\/?uploads\/?/, "")}`
//               )
//           : [],

//         thumbnail:
//           Array.isArray(r.images) && r.images.length > 0
//             ? String(r.images[0]).startsWith("http://") ||
//               String(r.images[0]).startsWith("https://")
//               ? r.images[0]
//               : `${baseUrl}/uploads/${String(r.images[0]).replace(/^\/?uploads\/?/, "")}`
//             : null,

//         rating: [],

//         store: {
//           id: Number(r.store_id),
//           store_id: Number(r.store_id),
//           name: r.store_name,
//           ref_no: r.ref_no,
//           username: r.ref_no ?? String(r.store_id),
//           logo: r.store_logo
//             ? String(r.store_logo).startsWith("http://") ||
//               String(r.store_logo).startsWith("https://")
//               ? r.store_logo
//               : `${baseUrl}/uploads/${String(r.store_logo).replace(/^\/?uploads\/?/, "")}`
//             : null,
//         },
//       };
//     });
// =======
//       images: Array.isArray(r.images)
//         ? r.images
//             .filter(Boolean)
//             .map((img) =>
//               typeof img === "string" && img.startsWith("http")
//                 ? img
//                 : `${baseUrl}/uploads/${img}`
//             )
//         : [],

//       thumbnail:
//         Array.isArray(r.images) && r.images.length > 0
//           ? (typeof r.images[0] === "string" && r.images[0].startsWith("http")
//               ? r.images[0]
//               : `${baseUrl}/uploads/${r.images[0]}`)
//           : null,

//       rating_avg: Number(r.rating_avg ?? 0),
//       rating_count: Number(r.rating_count ?? 0),

//       store: {
//         id: Number(r.store_id),
//         store_id: Number(r.store_id),
//         name: r.store_name,
//         ref_no: r.ref_no,
//         username: r.ref_no ?? String(r.store_id),
//         logo: r.store_logo
//           ? (String(r.store_logo).startsWith("http")
//               ? r.store_logo
//               : `${baseUrl}/uploads/${r.store_logo}`)
//           : null,
//       },
//     }));
// >>>>>>> origin/shreya_branch

//     return res.json({
//       products,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//       },
//     });
//   } catch (err) {
//     console.error("GET /api/products ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// <<<<<<< HEAD
// export default router;

// =======

// // GET SINGLE PRODUCT WITH VARIANTS
// router.get("/:id", async (req, res) => {
//   try {
//     const productId = Number(req.params.id);

//     if (!Number.isInteger(productId) || productId <= 0) {
//       return res.status(400).json({ message: "Invalid product id" });
//     }

//     const { rows } = await pool.query(
//       `
//       SELECT
//         p.product_id,
//         p.product_name,
//         p.price,
//         p.discount,
//         p.product_description,
//         p.product_count,
//         p.status,
//         p.visibility_status,

//         st.store_id,
//         st.store_name,

//         COALESCE(
//           (
//             SELECT json_agg(pi.image_url)
//             FROM product_image pi
//             WHERE pi.product_id = p.product_id
//           ),
//           '[]'
//         ) AS images,

//         COALESCE(
//           (
//             SELECT json_agg(
//               json_build_object(
//                 'attribute_name', pa.attribute_name,
//                 'attribute_value', pa.attribute_value,
//                 'new_price', pa.new_price,
//                 'stock', pa.stock,
//                 'base_spec', pa.base_spec
//               )
//             )
//             FROM product_attributes pa
//             WHERE pa.product_id = p.product_id
//           ),
//           '[]'
//         ) AS attributes

//       FROM product p
//       JOIN store st ON st.store_id = p.store_id

//       WHERE p.product_id = $1
//         AND p.status = 'active'
//         AND p.visibility_status = TRUE
//       `,
//       [productId]
//     );

//     if (!rows.length) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json({ product: rows[0] });

//   } catch (err) {
//     console.error("GET PRODUCT DETAILS ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
// >>>>>>> origin/shreya_branch
