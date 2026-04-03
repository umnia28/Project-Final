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
    let totalProductDiscount = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      const selectedAttributes = item.selected_attributes || {};

      if (!item.product_id || qty <= 0) {
        throw new Error(`Invalid quantity or product for product_id ${item.product_id}`);
      }

      const productRes = await client.query(
        `
        SELECT product_id, price, discount, product_count, status
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

      const originalPrice = Number(product.price || 0);
      const productDiscountPercent = Number(product.discount || 0);

      let stock = Number(product.product_count);
      let finalBasePrice = originalPrice;

      // VARIANT CHECK
      if (Object.keys(selectedAttributes).length > 0) {
        for (const [name, value] of Object.entries(selectedAttributes)) {
          const variantRes = await client.query(
            `
            SELECT stock, new_price
            FROM product_attributes
            WHERE product_id = $1
              AND attribute_name = $2
              AND attribute_value = $3
            FOR UPDATE
            `,
            [item.product_id, name, value]
          );

          if (variantRes.rows.length === 0) {
            throw new Error(`Variant not found: ${name} = ${value}`);
          }

          const variant = variantRes.rows[0];
          stock = Number(variant.stock);

          if (variant.new_price !== null) {
            finalBasePrice = Number(variant.new_price);
          }
        }
      }

      if (product.status !== "active") {
        throw new Error(`Product ${item.product_id} is not available`);
      }

      if (stock <= 0) {
        throw new Error(`Product ${item.product_id} is out of stock`);
      }

      if (qty > stock) {
        throw new Error(`Only ${stock} item(s) available`);
      }

      const productDiscountPerUnit =
        (finalBasePrice * productDiscountPercent) / 100;

      const finalUnitPrice = finalBasePrice - productDiscountPerUnit;

      const itemOriginalSubtotal = finalBasePrice * qty;
      const itemProductDiscountTotal = productDiscountPerUnit * qty;
      const itemSubtotal = finalUnitPrice * qty;

      subtotal += itemSubtotal;
      totalProductDiscount += itemProductDiscountTotal;

      validatedItems.push({
        product_id: item.product_id,
        qty,
        originalPrice: finalBasePrice,
        finalUnitPrice,
        productDiscountPercent,
        productDiscountPerUnit,
        itemOriginalSubtotal,
        itemProductDiscountTotal,
        itemSubtotal,
        selectedAttributes,
      });
    }

    const finalPaymentMethod = payment_method?.toLowerCase();

    if (!["cod", "online"].includes(finalPaymentMethod)) {
      throw new Error("Invalid payment method");
    }

    const paymentStatus = finalPaymentMethod === "cod" ? "unpaid" : "paid";

    let promoDiscountTotal = 0;
    let appliedPromoId = null;
    let appliedPromo = null;

    if (promo_id) {
      const promoRes = await client.query(
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
        WHERE promo_id = $1
        `,
        [Number(promo_id)]
      );

      if (promoRes.rows.length === 0) {
        throw new Error("Invalid promo");
      }

      const promo = promoRes.rows[0];
      const now = new Date();

      if (promo.promo_status !== "active") {
        throw new Error("Promo not active");
      }

      if (promo.promo_start_date && new Date(promo.promo_start_date) > now) {
        throw new Error("Promo not started");
      }

      if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
        throw new Error("Promo expired");
      }

      if (promo.is_reward_promo) {
        if (Number(promo.claimed_by_user_id) !== Number(userId)) {
          throw new Error("This reward promo does not belong to you");
        }

        if (promo.is_used) {
          throw new Error("This reward promo is already used");
        }
      }

      const promoPercent = Number(promo.promo_discount || 0);

      if (promoPercent > 0) {
        promoDiscountTotal = Math.round((subtotal * promoPercent) / 100);
        if (promoDiscountTotal > subtotal) promoDiscountTotal = subtotal;
      }

      appliedPromoId = promo.promo_id;
      appliedPromo = promo;
    }

    const finalTotal = subtotal - promoDiscountTotal + deliveryCharge;

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
        promoDiscountTotal,
        finalTotal,
      ]
    );

    const orderId = orderResult.rows[0].order_id;

    let distributedPromoDiscount = 0;

    for (let i = 0; i < validatedItems.length; i++) {
      const item = validatedItems[i];

      let itemPromoDiscount = 0;

      if (promoDiscountTotal > 0) {
        if (i === validatedItems.length - 1) {
          itemPromoDiscount = promoDiscountTotal - distributedPromoDiscount;
        } else {
          itemPromoDiscount = Math.round(
            (item.itemSubtotal / subtotal) * promoDiscountTotal
          );
          distributedPromoDiscount += itemPromoDiscount;
        }
      }

      const sellerEarnings = item.itemSubtotal - itemPromoDiscount;

      await client.query(
        `
        INSERT INTO order_item (
          order_id,
          product_id,
          qty,
          price,
          discount_amount,
          seller_earnings,
          selected_attributes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          orderId,
          item.product_id,
          item.qty,
          item.finalUnitPrice,
          item.itemProductDiscountTotal,
          sellerEarnings,
          JSON.stringify(item.selectedAttributes || {}),
        ]
      );

      // STOCK UPDATE
      if (Object.keys(item.selectedAttributes).length > 0) {
        for (const [name, value] of Object.entries(item.selectedAttributes)) {
          await client.query(
            `
            UPDATE product_attributes
            SET stock = stock - $1,
                sold = sold + $1
            WHERE product_id = $2
              AND attribute_name = $3
              AND attribute_value = $4
            `,
            [item.qty, item.product_id, name, value]
          );
        }
      } else {
        await client.query(
          `
          UPDATE product
          SET product_count = product_count - $1
          WHERE product_id = $2
          `,
          [item.qty, item.product_id]
        );
      }
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

    if (appliedPromo && appliedPromo.is_reward_promo) {
      await client.query(
        `
        UPDATE promo
        SET is_used = TRUE
        WHERE promo_id = $1
        `,
        [appliedPromo.promo_id]
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Order created",
      order_id: orderId,
      subtotal,
      product_discount_total: totalProductDiscount,
      promo_discount_total: promoDiscountTotal,
      delivery_charge: deliveryCharge,
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


// import express from "express";
// import pool from "../db.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// router.post("/create", verifyToken, async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const userId = req.user.user_id;
//     const { items, address_id, payment_method, promo_id } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     await client.query("BEGIN");

//     const deliveryCharge = 60;

//     let subtotal = 0;
//     let totalProductDiscount = 0;
//     const validatedItems = [];

//     for (const item of items) {
//       const qty = Number(item.quantity);
//       const selectedAttributes = item.selected_attributes || {};

//       if (!item.product_id || qty <= 0) {
//         throw new Error(`Invalid quantity or product for product_id ${item.product_id}`);
//       }

//       const productRes = await client.query(
//         `
//         SELECT product_id, price, discount, product_count, status
//         FROM product
//         WHERE product_id = $1
//         FOR UPDATE
//         `,
//         [item.product_id]
//       );

//       if (productRes.rows.length === 0) {
//         throw new Error(`Product ${item.product_id} not found`);
//       }

//       const product = productRes.rows[0];
// <<<<<<< HEAD

//       const originalPrice = Number(product.price || 0);
//       const productDiscountPercent = Number(product.discount || 0);
//       const stock = Number(product.product_count);
//       const status = product.status;
// =======
// >>>>>>> origin/shreya_branch

//       let price = Number(product.price);
//       let stock = Number(product.product_count);

//       // 🔥 VARIANT CHECK
//       if (Object.keys(selectedAttributes).length > 0) {
//         for (const [name, value] of Object.entries(selectedAttributes)) {
//           const variantRes = await client.query(
//             `
//             SELECT stock, new_price
//             FROM product_attributes
//             WHERE product_id = $1
//               AND attribute_name = $2
//               AND attribute_value = $3
//             FOR UPDATE
//             `,
//             [item.product_id, name, value]
//           );

//           if (variantRes.rows.length === 0) {
//             throw new Error(`Variant not found: ${name} = ${value}`);
//           }

//           const variant = variantRes.rows[0];

//           stock = Number(variant.stock);

//           if (variant.new_price !== null) {
//             price = Number(variant.new_price);
//           }
//         }
//       }

//       if (product.status !== "active") {
//         throw new Error(`Product ${item.product_id} is not available`);
//       }

//       if (stock <= 0) {
//         throw new Error(`Product ${item.product_id} is out of stock`);
//       }

//       if (qty > stock) {
//         throw new Error(`Only ${stock} item(s) available`);
//       }

//       const productDiscountPerUnit = (originalPrice * productDiscountPercent) / 100;
//       const finalUnitPrice = originalPrice - productDiscountPerUnit;

//       const itemOriginalSubtotal = originalPrice * qty;
//       const itemProductDiscountTotal = productDiscountPerUnit * qty;
//       const itemSubtotal = finalUnitPrice * qty;

//       subtotal += itemSubtotal;
//       totalProductDiscount += itemProductDiscountTotal;

//       validatedItems.push({
//         product_id: item.product_id,
//         qty,
//         originalPrice,
//         finalUnitPrice,
//         productDiscountPercent,
//         productDiscountPerUnit,
//         itemOriginalSubtotal,
//         itemProductDiscountTotal,
//         itemSubtotal,
//         selectedAttributes,
//       });
//     }

//     const finalPaymentMethod = payment_method?.toLowerCase();

//     if (!["cod", "online"].includes(finalPaymentMethod)) {
//       throw new Error("Invalid payment method");
//     }

//     const paymentStatus = finalPaymentMethod === "cod" ? "unpaid" : "paid";

//     let promoDiscountTotal = 0;
//     let appliedPromoId = null;
//     let appliedPromo = null;

//     if (promo_id) {
//       const promoRes = await client.query(
//         `
// <<<<<<< HEAD
//         SELECT
//           promo_id,
//           promo_name,
//           promo_status,
//           promo_discount,
//           promo_start_date,
//           promo_end_date,
//           promo_code,
//           claimed_by_user_id,
//           is_reward_promo,
//           is_used
// =======
//         SELECT *
// >>>>>>> origin/shreya_branch
//         FROM promo
//         WHERE promo_id = $1
//         `,
//         [Number(promo_id)]
//       );

//       if (promoRes.rows.length === 0) {
//         throw new Error("Invalid promo");
//       }

//       const promo = promoRes.rows[0];
//       const now = new Date();

//       if (promo.promo_status !== "active") throw new Error("Promo not active");
//       if (promo.promo_start_date && new Date(promo.promo_start_date) > now)
//         throw new Error("Promo not started");
//       if (promo.promo_end_date && new Date(promo.promo_end_date) < now)
//         throw new Error("Promo expired");

//       const percent = Number(promo.promo_discount);

// <<<<<<< HEAD
//       if (promo.promo_end_date && new Date(promo.promo_end_date) < now) {
//         throw new Error("Promo has expired");
//       }

//       if (promo.is_reward_promo) {
//         if (Number(promo.claimed_by_user_id) !== Number(userId)) {
//           throw new Error("This reward promo does not belong to you");
//         }

//         if (promo.is_used) {
//           throw new Error("This reward promo is already used");
//         }
//       }

//       const promoPercent = Number(promo.promo_discount || 0);

//       if (promoPercent > 0) {
//         promoDiscountTotal = Math.round((subtotal * promoPercent) / 100);
//         if (promoDiscountTotal > subtotal) promoDiscountTotal = subtotal;
// =======
//       if (percent > 0) {
//         totalDiscount = Math.round((subtotal * percent) / 100);
//         if (totalDiscount > subtotal) totalDiscount = subtotal;
//         appliedPromoId = promo.promo_id;
// >>>>>>> origin/shreya_branch
//       }

//       appliedPromoId = promo.promo_id;
//       appliedPromo = promo;
//     }

//     const finalTotal = subtotal - promoDiscountTotal + deliveryCharge;

//     const orderResult = await client.query(
//       `
//       INSERT INTO "order" (
//         customer_id,
//         address_id,
//         promo_id,
//         date_added,
//         payment_method,
//         payment_status,
//         delivery_charge,
//         discount_amount,
//         total_price
//       )
//       VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8)
//       RETURNING order_id
//       `,
//       [
//         userId,
//         address_id ?? null,
//         appliedPromoId,
//         finalPaymentMethod,
//         paymentStatus,
//         deliveryCharge,
//         promoDiscountTotal,
//         finalTotal,
//       ]
//     );

//     const orderId = orderResult.rows[0].order_id;

//     let distributedPromoDiscount = 0;

//     for (let i = 0; i < validatedItems.length; i++) {
//       const item = validatedItems[i];

//       let itemPromoDiscount = 0;

//       if (promoDiscountTotal > 0) {
//         if (i === validatedItems.length - 1) {
//           itemPromoDiscount = promoDiscountTotal - distributedPromoDiscount;
//         } else {
//           itemPromoDiscount = Math.round((item.itemSubtotal / subtotal) * promoDiscountTotal);
//           distributedPromoDiscount += itemPromoDiscount;
//         }
//       }

//       const sellerEarnings = item.itemSubtotal - itemPromoDiscount;

//       // ✅ INSERT ORDER ITEM WITH VARIANT
//       await client.query(
//         `
//         INSERT INTO order_item (
//           order_id,
//           product_id,
//           qty,
//           price,
//           discount_amount,
//           seller_earnings,
//           selected_attributes
//         )
//         VALUES ($1, $2, $3, $4, $5, $6, $7)
//         `,
//         [
//           orderId,
//           item.product_id,
//           item.qty,
//           item.finalUnitPrice,
//           item.itemProductDiscountTotal,
//           sellerEarnings,
//           JSON.stringify(item.selectedAttributes || {}),
//         ]
//       );

//       // 🔥 STOCK UPDATE
//       if (Object.keys(item.selectedAttributes).length > 0) {
//         for (const [name, value] of Object.entries(item.selectedAttributes)) {
//           await client.query(
//             `
//             UPDATE product_attributes
//             SET stock = stock - $1,
//                 sold = sold + $1
//             WHERE product_id = $2
//               AND attribute_name = $3
//               AND attribute_value = $4
//             `,
//             [item.qty, item.product_id, name, value]
//           );
//         }
//       } else {
//         await client.query(
//           `
//           UPDATE product
//           SET product_count = product_count - $1
//           WHERE product_id = $2
//           `,
//           [item.qty, item.product_id]
//         );
//       }
//     }

//     await client.query(
//       `
//       INSERT INTO order_status (
//         order_id,
//         status_type,
//         status_time,
//         updated_by
//       )
//       VALUES ($1, $2, NOW(), $3)
//       `,
//       [orderId, "placed", userId]
//     );

//     if (appliedPromo && appliedPromo.is_reward_promo) {
//       await client.query(
//         `
//         UPDATE promo
//         SET is_used = TRUE
//         WHERE promo_id = $1
//         `,
//         [appliedPromo.promo_id]
//       );
//     }

//     await client.query("COMMIT");

//     res.json({
//       message: "Order created",
//       order_id: orderId,
//       subtotal,
//       product_discount_total: totalProductDiscount,
//       promo_discount_total: promoDiscountTotal,
//       delivery_charge: deliveryCharge,
//       total_price: finalTotal,
//     });

//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("ORDER CREATE ERROR:", err);

//     res.status(500).json({
//       message: err.message || "Server error",
//     });
//   } finally {
//     client.release();
//   }
// });

// export default router;

