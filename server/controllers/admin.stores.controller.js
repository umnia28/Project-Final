import pool from "../db.js";

export const getAdminStores = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        s.store_id,
        s.store_name,
        s.store_status,
        s.ref_no,
        s.created_at,
        u.user_id,
        u.username,
        u.full_name,
        u.email,
        u.contact_no
      FROM store s
      JOIN seller se ON se.user_id = s.user_id
      JOIN users u ON u.user_id = se.user_id
      ORDER BY s.created_at DESC
      `
    );

    return res.json({ stores: rows });
  } catch (err) {
    console.error("GET ADMIN STORES ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateStoreStatus = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { store_status } = req.body;

    if (!["active", "inactive"].includes(store_status)) {
      return res.status(400).json({
        message: "store_status must be 'active' or 'inactive'",
      });
    }

    const { rows } = await pool.query(
      `
      UPDATE store
      SET store_status = $1
      WHERE store_id = $2
      RETURNING *
      `,
      [store_status, storeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.json({
      message: "Store status updated successfully",
      store: rows[0],
    });
  } catch (err) {
    console.error("UPDATE STORE STATUS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};