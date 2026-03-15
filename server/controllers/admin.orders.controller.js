import pool from "../db.js";

/* =========================
   GET ALL DELIVERY MEN
========================= */
export const getAllDeliveryMen = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        d.user_id,
        u.username,
        u.full_name,
        u.email,
        u.contact_no,
        u.status,
        d.joining_date,
        d.salary,
        d.total_orders
      FROM delivery_man d
      JOIN users u ON u.user_id = d.user_id
      ORDER BY d.total_orders ASC, u.username ASC
      `
    );

    return res.json({ deliveryMen: result.rows });
  } catch (err) {
    console.error("GET ALL DELIVERY MEN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ASSIGN DELIVERY MAN
========================= */
export const assignDeliveryManToOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const adminUserId = req.user.user_id;
    const { orderId } = req.params;
    const { delivery_man_id } = req.body;

    if (!delivery_man_id) {
      return res.status(400).json({ message: "delivery_man_id is required" });
    }

    await client.query("BEGIN");

    // 1) check order exists
    const orderRes = await client.query(
      `
      SELECT
        o.order_id,
        o.delivery_man_id
      FROM "order" o
      WHERE o.order_id = $1
      `,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    // 2) check current latest status
    const latestStatusRes = await client.query(
      `
      SELECT status_type
      FROM order_status
      WHERE order_id = $1
      ORDER BY status_time DESC
      LIMIT 1
      `,
      [orderId]
    );

    const currentStatus =
      latestStatusRes.rows[0]?.status_type?.toLowerCase() || "placed";

    if (currentStatus === "delivered" || currentStatus === "cancelled") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Cannot assign delivery man to delivered or cancelled order",
      });
    }

    // 3) check delivery man exists and is active
    const deliveryManRes = await client.query(
      `
      SELECT
        d.user_id,
        u.username,
        u.full_name,
        u.status
      FROM delivery_man d
      JOIN users u ON u.user_id = d.user_id
      WHERE d.user_id = $1
      `,
      [delivery_man_id]
    );

    if (deliveryManRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Delivery man not found" });
    }

    if (deliveryManRes.rows[0].status !== "active") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Delivery man account is not active",
      });
    }

    const previousDeliveryManId = orderRes.rows[0].delivery_man_id;

    // 4) assign or reassign
    await client.query(
      `
      UPDATE "order"
      SET delivery_man_id = $1
      WHERE order_id = $2
      `,
      [delivery_man_id, orderId]
    );

    // 5) add status history
    // use "assigned" for first assignment, "reassigned" if changing to another one
    const statusToInsert =
      previousDeliveryManId && String(previousDeliveryManId) !== String(delivery_man_id)
        ? "reassigned"
        : "assigned";

    await client.query(
      `
      INSERT INTO order_status (order_id, status_type, updated_by)
      VALUES ($1, $2, $3)
      `,
      [orderId, statusToInsert, adminUserId]
    );

    // 6) notify newly assigned delivery man
    await client.query(
      `
      INSERT INTO notification (user_id, notification_description)
      VALUES ($1, $2)
      `,
      [
        delivery_man_id,
        `Order #${orderId} has been assigned to you.`,
      ]
    );

    // 7) if reassigned, optionally notify previous delivery man too
    if (
      previousDeliveryManId &&
      String(previousDeliveryManId) !== String(delivery_man_id)
    ) {
      await client.query(
        `
        INSERT INTO notification (user_id, notification_description)
        VALUES ($1, $2)
        `,
        [
          previousDeliveryManId,
          `Order #${orderId} has been reassigned to another delivery man.`,
        ]
      );
    }

    await client.query("COMMIT");

    return res.json({
      message: "Delivery man assigned successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ASSIGN DELIVERY MAN TO ORDER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};