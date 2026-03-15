import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.post("/create", verifyToken, requireRole("customer"), async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { items, address_id, payment_method, promo_id } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address_id) {
      return res.status(400).json({ message: "Address is required" });
    }

    const addressCheck = await client.query(
      `
      SELECT address_id
      FROM shipping_address
      WHERE address_id = $1 AND user_id = $2
      `,
      [address_id, userId]
    );

    if (addressCheck.rows.length === 0) {
      return res.status(400).json({ message: "Invalid address selected" });
    }

    await client.query("BEGIN");

    let total = 0;

    for (const item of items) {
      const p = await client.query(
        `SELECT price FROM product WHERE product_id = $1`,
        [item.product_id]
      );

      if (p.rows.length === 0) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      const price = Number(p.rows[0].price);
      total += price * Number(item.quantity);
    }

    const orderResult = await client.query(
      `
      INSERT INTO "order" (
        customer_id,
        address_id,
        promo_id,
        date_added,
        payment_method,
        payment_status,
        delivery_charge,
        discount_amount,
        total_price
      )
      VALUES ($1, $2, $3, NOW(), $4, 'pending', $5, $6, $7)
      RETURNING order_id
      `,
      [
        userId,
        address_id,
        promo_id ?? null,
        payment_method ?? "cod",
        60,
        0,
        total
      ]
    );

    const orderId = orderResult.rows[0].order_id;

    for (const item of items) {
      const productResult = await client.query(
        `SELECT price FROM product WHERE product_id = $1`,
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      const price = Number(productResult.rows[0].price);
      const qty = Number(item.quantity);

      const discountAmount = 0;
      const sellerEarnings = price * qty - discountAmount;

      await client.query(
        `
        INSERT INTO order_item (
          order_id,
          product_id,
          qty,
          price,
          discount_amount,
          seller_earnings
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [orderId, item.product_id, qty, price, discountAmount, sellerEarnings]
      );
    }

    await client.query(
      `
      INSERT INTO order_status (
        order_id,
        status_type,
        status_time,
        updated_by
      )
      VALUES ($1, $2, NOW(), $3)
      `,
      [orderId, "placed", userId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Order created",
      order_id: orderId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
      detail: err.detail || null,
    });
  } finally {
    client.release();
  }
});

export default router;



/*import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.user_id;
    const { items, address_id, payment_method, promo_id } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    await client.query("BEGIN");

    let total = 0;

    // calculate total
    for (const item of items) {
      const p = await client.query(
        `SELECT price FROM product WHERE product_id=$1`,
        [item.product_id]
      );

      const price = Number(p.rows[0].price);
      total += price * item.quantity;
    }

    // create order
    // const orderResult = await client.query(
    //   `
    //   INSERT INTO "order"
    //   (date_added, payment_status, delivery_charge, total_price)
    //   VALUES (NOW(), 'pending', 60, $1)
    //   RETURNING order_id
    //   `,
    //   [total]
    // );
    // const orderResult = await client.query(
    //   `
    //   INSERT INTO "order" (customer_id, date_added, payment_status, delivery_charge, total_price)
    //   VALUES ($1, NOW(), 'pending', 60, $2)
    //   RETURNING order_id
    //   `,
    //   [userId, total]
    // );
    const orderResult = await client.query(
      `
      INSERT INTO "order" (
        customer_id,
        address_id,
        promo_id,
        date_added,
        payment_method,
        payment_status,
        delivery_charge,
        discount_amount,
        total_price
      )
      VALUES ($1, $2, $3, NOW(), $4, 'pending', $5, $6, $7)
      RETURNING order_id
      `,
      [
        userId,
        address_id ?? null,
        promo_id ?? null,
        payment_method ?? 'cod',
        60,
        0,
        total
      ]
    );

    const orderId = orderResult.rows[0].order_id;

    // insert order items
    for (const item of items) {

      const productResult = await client.query(
        `SELECT price FROM product WHERE product_id = $1`,
        [item.product_id]
      );

      const price = Number(productResult.rows[0].price);
      const qty = Number(item.quantity);

      const discountAmount = 0;
      const sellerEarnings = price * qty - discountAmount;

      await client.query(
            `
        INSERT INTO order_item (
          order_id,
          product_id,
          qty,
          price,
          discount_amount,
          seller_earnings
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
            [orderId, item.product_id, qty, price, discountAmount, sellerEarnings]
      );
    }
    // insert order status
    // await client.query(
    //   `
    //   INSERT INTO order_status
    //   (order_id, status, updated_by)
    //   VALUES ($1,'placed',$2)
    //   `,
    //   [orderId, userId]
    // );
    await client.query(
      `
      INSERT INTO order_status (
        order_id,
        status_type,
        status_time,
        updated_by
      )
      VALUES ($1, $2, NOW(), $3)
      `,
      [orderId, 'placed', userId]
    );

    await client.query("COMMIT");

    res.json({
      message: "Order created",
      order_id: orderId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
*/

