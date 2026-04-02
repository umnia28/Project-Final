import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

// helper: ensure product belongs to seller
const assertOwnProduct = async (sellerId, productId) => {
  const { rows } = await pool.query(
    `
    SELECT p.product_id
    FROM product p
    JOIN store st ON st.store_id = p.store_id
    WHERE p.product_id = $1 AND st.user_id = $2
    `,
    [productId, sellerId]
  );
  return rows.length > 0;
};

/**
 * GET /api/seller/products
 */
router.get("/", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user.user_id;

    const { rows } = await pool.query(
      `
      SELECT
        p.product_id,
        p.product_name,
        p.price,
        p.discount,
        p.product_count,
        p.status,
        p.visibility_status,
        p.date_added,
        p.category_id,
        p.product_description,
        st.store_id,
        st.store_name,
        (
          SELECT image_url
          FROM product_image pi
          WHERE pi.product_id = p.product_id
          ORDER BY pi.created_at ASC
          LIMIT 1
        ) AS thumbnail,
        (
          SELECT COUNT(*)
          FROM product_attributes pa
          WHERE pa.product_id = p.product_id
        )::INT AS attribute_count
      FROM product p
      JOIN store st ON st.store_id = p.store_id
      WHERE st.user_id = $1
      ORDER BY p.date_added DESC
      `,
      [sellerId]
    );

    res.json({ products: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/seller/products
 */
router.post("/", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const {
      store_id,
      category_id = null,
      product_name,
      price,
      product_description = null,
      product_count = 0,
      discount = 0,
      images = [],
    } = req.body;

    if (!store_id || !product_name || price === undefined) {
      return res.status(400).json({
        message: "store_id, product_name, price required",
      });
    }

    const { rows } = await pool.query(
      `
      SELECT create_seller_product(
        $1::BIGINT,
        $2::BIGINT,
        $3::BIGINT,
        $4::VARCHAR,
        $5::NUMERIC,
        $6::TEXT,
        $7::INT,
        $8::NUMERIC,
        $9::TEXT[]
      ) AS product_id
      `,
      [
        sellerId,
        store_id,
        category_id,
        product_name,
        price,
        product_description,
        product_count,
        discount,
        images,
      ]
    );

    return res.status(201).json({
      message: "Product created ✅",
      product: {
        product_id: rows[0].product_id,
      },
    });
  } catch (e) {
    console.error("CREATE PRODUCT ERROR:", e);

    if (e.message?.includes("Not your store")) {
      return res.status(403).json({ message: "Not your store" });
    }

    if (e.code === "23505") {
      return res.status(409).json({ message: "Duplicate value" });
    }

    return res.status(500).json({
      message: e.message || "Server error",
    });
  }
});

/**
 * PUT /api/seller/products/:id
 */
router.put("/:id", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const ok = await assertOwnProduct(sellerId, productId);
    if (!ok) return res.status(403).json({ message: "Not your product" });

    const {
      category_id = null,
      product_name,
      price,
      product_description = null,
      product_count,
      discount,
      status,
      visibility_status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE product
      SET category_id = COALESCE($1, category_id),
          product_name = COALESCE($2, product_name),
          price = COALESCE($3, price),
          product_description = COALESCE($4, product_description),
          product_count = COALESCE($5, product_count),
          discount = COALESCE($6, discount),
          status = COALESCE($7, status),
          visibility_status = COALESCE($8, visibility_status)
      WHERE product_id = $9
      `,
      [
        category_id,
        product_name,
        price,
        product_description,
        product_count,
        discount,
        status,
        visibility_status,
        productId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated ✅" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || "Server error" });
  }
});

/**
 * POST /api/seller/products/:id/attributes
 * Add variants for a product
 */
router.post("/:id/attributes", verifyToken, requireRole("seller"), async (req, res) => {
  const client = await pool.connect();

  try {
    const sellerId = req.user.user_id;
    const productId = Number(req.params.id);
    const { attributes } = req.body;

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const ok = await assertOwnProduct(sellerId, productId);
    if (!ok) return res.status(403).json({ message: "Not your product" });

    if (!Array.isArray(attributes)) {
      return res.status(400).json({ message: "attributes must be an array" });
    }

    await client.query("BEGIN");

    for (const attr of attributes) {
      const attribute_name = attr?.attribute_name?.trim();
      const attribute_value = attr?.attribute_value?.trim();
      const new_price =
        attr?.new_price === null || attr?.new_price === undefined || attr?.new_price === ""
          ? null
          : Number(attr.new_price);
      const stock =
        attr?.stock === null || attr?.stock === undefined || attr?.stock === ""
          ? 0
          : Number(attr.stock);
      const sold =
        attr?.sold === null || attr?.sold === undefined || attr?.sold === ""
          ? 0
          : Number(attr.sold);
      const base_spec = Boolean(attr?.base_spec);

      if (!attribute_name || !attribute_value) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Each attribute must have attribute_name and attribute_value",
        });
      }

      if (new_price !== null && Number.isNaN(new_price)) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "new_price must be a valid number or null" });
      }

      if (!Number.isInteger(stock) || stock < 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "stock must be integer >= 0" });
      }

      if (!Number.isInteger(sold) || sold < 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "sold must be integer >= 0" });
      }

      await client.query(
        `
        INSERT INTO product_attributes
          (product_id, attribute_name, attribute_value, new_price, stock, sold, base_spec)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (product_id, attribute_name, attribute_value)
        DO UPDATE SET
          new_price = EXCLUDED.new_price,
          stock = EXCLUDED.stock,
          sold = EXCLUDED.sold,
          base_spec = EXCLUDED.base_spec
        `,
        [productId, attribute_name, attribute_value, new_price, stock, sold, base_spec]
      );
    }

    await client.query("COMMIT");
    return res.json({ message: "Product attributes saved ✅" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("SAVE ATTRIBUTES ERROR:", e);
    return res.status(500).json({ message: e.message || "Server error" });
  } finally {
    client.release();
  }
});

/**
 * PUT /api/seller/products/:id/attributes
 * Replace all variants for a product
 */
router.put("/:id/attributes", verifyToken, requireRole("seller"), async (req, res) => {
  const client = await pool.connect();

  try {
    const sellerId = req.user.user_id;
    const productId = Number(req.params.id);
    const { attributes } = req.body;

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const ok = await assertOwnProduct(sellerId, productId);
    if (!ok) return res.status(403).json({ message: "Not your product" });

    if (!Array.isArray(attributes)) {
      return res.status(400).json({ message: "attributes must be an array" });
    }

    await client.query("BEGIN");

    await client.query(`DELETE FROM product_attributes WHERE product_id = $1`, [productId]);

    for (const attr of attributes) {
      const attribute_name = attr?.attribute_name?.trim();
      const attribute_value = attr?.attribute_value?.trim();
      const new_price =
        attr?.new_price === null || attr?.new_price === undefined || attr?.new_price === ""
          ? null
          : Number(attr.new_price);
      const stock =
        attr?.stock === null || attr?.stock === undefined || attr?.stock === ""
          ? 0
          : Number(attr.stock);
      const sold =
        attr?.sold === null || attr?.sold === undefined || attr?.sold === ""
          ? 0
          : Number(attr.sold);
      const base_spec = Boolean(attr?.base_spec);

      if (!attribute_name || !attribute_value) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Each attribute must have attribute_name and attribute_value",
        });
      }

      if (new_price !== null && Number.isNaN(new_price)) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "new_price must be a valid number or null" });
      }

      if (!Number.isInteger(stock) || stock < 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "stock must be integer >= 0" });
      }

      if (!Number.isInteger(sold) || sold < 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "sold must be integer >= 0" });
      }

      await client.query(
        `
        INSERT INTO product_attributes
          (product_id, attribute_name, attribute_value, new_price, stock, sold, base_spec)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)
        `,
        [productId, attribute_name, attribute_value, new_price, stock, sold, base_spec]
      );
    }

    await client.query("COMMIT");
    return res.json({ message: "Product attributes updated ✅" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("UPDATE ATTRIBUTES ERROR:", e);
    return res.status(500).json({ message: e.message || "Server error" });
  } finally {
    client.release();
  }
});

/**
 * GET /api/seller/products/:id/attributes
 */
router.get("/:id/attributes", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const ok = await assertOwnProduct(sellerId, productId);
    if (!ok) return res.status(403).json({ message: "Not your product" });

    const { rows } = await pool.query(
      `
      SELECT
        product_id,
        attribute_name,
        attribute_value,
        new_price,
        stock,
        sold,
        base_spec
      FROM product_attributes
      WHERE product_id = $1
      ORDER BY attribute_name ASC, attribute_value ASC
      `,
      [productId]
    );

    return res.json({ attributes: rows });
  } catch (e) {
    console.error("GET ATTRIBUTES ERROR:", e);
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

/**
 * DELETE /api/seller/products/:id
 */
router.delete("/:id", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const productId = Number(req.params.id);

    const ok = await assertOwnProduct(sellerId, productId);
    if (!ok) return res.status(403).json({ message: "Not your product" });

    const result = await pool.query(`DELETE FROM product WHERE product_id=$1`, [productId]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted ✅" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/seller/products/:id/stock
 */
router.put("/:id/stock", verifyToken, requireRole("seller"), async (req, res) => {
  const client = await pool.connect();
  try {
    const sellerId = req.user.user_id;
    const productId = Number(req.params.id);

    const ok = await assertOwnProduct(sellerId, productId);
    if (!ok) return res.status(403).json({ message: "Not your product" });

    const { product_count, attribute_name, attribute_value, stock } = req.body;

    await client.query("BEGIN");

    if (product_count !== undefined) {
      const pc = Number(product_count);
      if (!Number.isInteger(pc) || pc < 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "product_count must be integer >= 0" });
      }

      await client.query(`UPDATE product SET product_count=$1 WHERE product_id=$2`, [pc, productId]);
      await client.query("COMMIT");
      return res.json({ message: "Base stock updated ✅" });
    }

    if (!attribute_name || !attribute_value || stock === undefined) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Provide product_count OR (attribute_name, attribute_value, stock)" });
    }

    const st = Number(stock);
    if (!Number.isInteger(st) || st < 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "stock must be integer >= 0" });
    }

    await client.query(
      `
      INSERT INTO product_attributes (product_id, attribute_name, attribute_value, stock)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (product_id, attribute_name, attribute_value)
      DO UPDATE SET stock = EXCLUDED.stock
      `,
      [productId, attribute_name, attribute_value, st]
    );

    await client.query("COMMIT");
    res.json({ message: "Variant stock updated ✅" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * GET /api/seller/products/:id
 */
router.get("/:id", verifyToken, requireRole("seller"), async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const productId = Number(req.params.id);

    const ok = await assertOwnProduct(sellerId, productId);
    if (!ok) return res.status(403).json({ message: "Not your product" });

    const { rows } = await pool.query(
      `
      SELECT p.*,
        COALESCE(
          (
            SELECT json_agg(pi.image_url ORDER BY pi.created_at ASC)
            FROM product_image pi
            WHERE pi.product_id = p.product_id
          ),
          '[]'::json
        ) AS images,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'attribute_name', pa.attribute_name,
                'attribute_value', pa.attribute_value,
                'new_price', pa.new_price,
                'stock', pa.stock,
                'sold', pa.sold,
                'base_spec', pa.base_spec
              )
              ORDER BY pa.attribute_name, pa.attribute_value
            )
            FROM product_attributes pa
            WHERE pa.product_id = p.product_id
          ),
          '[]'::json
        ) AS attributes
      FROM product p
      WHERE p.product_id = $1
      `,
      [productId]
    );

    res.json({ product: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;