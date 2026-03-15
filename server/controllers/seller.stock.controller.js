import pool from "../db.js";

export const getSellerStock = async (req, res) => {
  try {
    const sellerId = req.user.user_id;

    const { rows } = await pool.query(
      `
      SELECT
        p.product_id,
        p.product_name,
        p.price,
        p.product_count,
        p.status,
        s.store_name
      FROM product p
      JOIN store s ON s.store_id = p.store_id
      WHERE s.user_id = $1
      ORDER BY p.product_id DESC
      `,
      [sellerId]
    );

    return res.json({ items: rows });
  } catch (err) {
    console.error("GET SELLER STOCK ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSellerStock = async (req, res) => {
  try {
    const sellerId = req.user.user_id;
    const { productId } = req.params;
    const { product_count } = req.body;

    if (product_count === undefined || product_count < 0) {
      return res.status(400).json({
        message: "Valid product_count is required",
      });
    }

    const productCheck = await pool.query(
      `
      SELECT p.product_id
      FROM product p
      JOIN store s ON s.store_id = p.store_id
      WHERE p.product_id = $1 AND s.user_id = $2
      `,
      [productId, sellerId]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { rows } = await pool.query(
      `
      UPDATE product
      SET product_count = $1
      WHERE product_id = $2
      RETURNING product_id, product_name, product_count
      `,
      [product_count, productId]
    );

    return res.json({
      message: "Stock updated successfully",
      item: rows[0],
    });
  } catch (err) {
    console.error("UPDATE SELLER STOCK ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};