import express from "express";
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

    const deliveryCharge = 60;

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = Number(item.quantity);

      if (!item.product_id || qty <= 0) {
        throw new Error(`Invalid quantity or product for product_id ${item.product_id}`);
      }

      const productRes = await client.query(
        `
        SELECT product_id, price, product_count, status
        FROM product
        WHERE product_id = $1
        FOR UPDATE
        `,
        [item.product_id]
      );

      if (productRes.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const product = productRes.rows[0];
      const price = Number(product.price);
      const stock = Number(product.product_count);
      const status = product.status;

      if (status !== "active") {
        throw new Error(`Product ${item.product_id} is not available for ordering`);
      }

      if (stock <= 0) {
        throw new Error(`Product ${item.product_id} is out of stock`);
      }

      if (qty > stock) {
        throw new Error(`Only ${stock} item(s) available for product ${item.product_id}`);
      }

      const itemSubtotal = price * qty;
      subtotal += itemSubtotal;

      validatedItems.push({
        product_id: item.product_id,
        qty,
        price,
        itemSubtotal,
      });
    }

    const finalPaymentMethod = payment_method?.toLowerCase();

    if (!["cod", "online"].includes(finalPaymentMethod)) {
      throw new Error("Invalid payment method");
    }

    const paymentStatus = finalPaymentMethod === "cod" ? "unpaid" : "paid";

    let totalDiscount = 0;
    let appliedPromoId = null;

    if (promo_id) {
      const promoRes = await client.query(
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
        `,
        [promo_id]
      );

      if (promoRes.rows.length === 0) {
        throw new Error("Promo not found");
      }

      const promo = promoRes.rows[0];
      const now = new Date();

      if (promo.promo_status !== "active") {
        throw new Error("Promo is not active");
      }

      if (promo.promo_start_date && new Date(promo.promo_start_date) > now) {
        throw new Error("Promo has not started yet");
      }

      if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
        throw new Error("Promo has expired");
      }

      const promoPercent = Number(promo.promo_discount);

      if (promoPercent > 0) {
        totalDiscount = Math.round((subtotal * promoPercent) / 100);
        if (totalDiscount > subtotal) totalDiscount = subtotal;
        appliedPromoId = promo.promo_id;
      }
    }

    const finalTotal = subtotal - totalDiscount + deliveryCharge;

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
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8)
      RETURNING order_id
      `,
      [
        userId,
        address_id ?? null,
        appliedPromoId,
        finalPaymentMethod,
        paymentStatus,
        deliveryCharge,
        totalDiscount,
        finalTotal,
      ]
    );

    const orderId = orderResult.rows[0].order_id;

    let distributedDiscount = 0;

    for (let i = 0; i < validatedItems.length; i++) {
      const item = validatedItems[i];

      let itemDiscount = 0;

      if (totalDiscount > 0) {
        if (i === validatedItems.length - 1) {
          itemDiscount = totalDiscount - distributedDiscount;
        } else {
          itemDiscount = Math.round((item.itemSubtotal / subtotal) * totalDiscount);
          distributedDiscount += itemDiscount;
        }
      }

      const sellerEarnings = item.itemSubtotal - itemDiscount;

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
        [
          orderId,
          item.product_id,
          item.qty,
          item.price,
          itemDiscount,
          sellerEarnings,
        ]
      );

      await client.query(
        `
        UPDATE product
        SET product_count = product_count - $1
        WHERE product_id = $2
        `,
        [item.qty, item.product_id]
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
      subtotal,
      delivery_charge: deliveryCharge,
      discount_amount: totalDiscount,
      total_price: finalTotal,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ORDER CREATE ERROR:", err);

    res.status(500).json({
      message: err.message || "Server error",
    });
  } finally {
    client.release();
  }
});

export default router;