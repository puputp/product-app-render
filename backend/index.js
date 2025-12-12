require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test server + DB
app.get("/api/health", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW() as now");
    res.json({ ok: true, now: r.rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// API lấy danh sách sản phẩm
app.get("/api/products", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm sản phẩm
app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "name required" });
    }

    const r = await pool.query(
      "INSERT INTO products(name, price) VALUES($1, $2) RETURNING *",
      [name.trim(), Number(price) || 0]
    );

    res.status(201).json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
