import { useEffect, useState } from "react";

export default function App() {
  const API = import.meta.env.VITE_API;

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const r = await fetch(`${API}/products`);
      if (!r.ok) throw new Error("API error: " + r.status);
      const data = await r.json();
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const r = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price) || 0,
        }),
      });

      if (!r.ok) {
        const msg = await r.json().catch(() => ({}));
        throw new Error(msg.error || ("API error: " + r.status));
      }

      // reset form + reload list
      setName("");
      setPrice("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div>
            <h1 className="title">Product List</h1>
            <p className="subtitle">
              React → gọi API Node.js → đọc dữ liệu PostgreSQL
            </p>
          </div>

          <button className="btn" onClick={load}>
            Reload
          </button>
        </header>

        {/* FORM THÊM SẢN PHẨM */}
        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ marginTop: 0 }}>Thêm sản phẩm</h3>

          <form onSubmit={addProduct} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên sản phẩm"
              style={{
                flex: 1,
                minWidth: 220,
                padding: 10,
                borderRadius: 12,
                border: "1px solid rgba(232,238,252,0.18)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                outline: "none",
              }}
              required
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Giá"
              type="number"
              style={{
                width: 180,
                padding: 10,
                borderRadius: 12,
                border: "1px solid rgba(232,238,252,0.18)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                outline: "none",
              }}
            />

            <button className="btn" type="submit">
              Thêm
            </button>
          </form>

          {error && (
            <div className="alert" style={{ marginTop: 12 }}>
              <b>Lỗi:</b> {error}
            </div>
          )}
        </div>

        {/* LIST */}
        <div className="card">
          {loading && <div className="hint">Đang tải dữ liệu...</div>}

          {!loading && !error && items.length === 0 && (
            <div className="hint">Chưa có sản phẩm.</div>
          )}

          {!loading && items.length > 0 && (
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 90 }}>ID</th>
                    <th>Tên sản phẩm</th>
                    <th style={{ width: 180, textAlign: "right" }}>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id}>
                      <td className="mono">#{p.id}</td>
                      <td>{p.name}</td>
                      <td style={{ textAlign: "right" }}>
                        {Number(p.price).toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="footer">
          Project 1 (Render) — Demo Git/GitHub & CI/CD
        </footer>
      </div>
    </div>
  );
}
