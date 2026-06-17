require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── DB init ───────────────────────────────────────────────────
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id        SERIAL  PRIMARY KEY,
      name      TEXT    NOT NULL,
      price     INT     NOT NULL,
      category  TEXT,
      is_active BOOLEAN DEFAULT true
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales_log (
      id          SERIAL      PRIMARY KEY,
      table_id    INT,
      zone        TEXT,
      items       JSONB,
      subtotal    INT,
      discount    INT,
      final_total INT,
      cash        INT,
      change      INT,
      split_count INT         DEFAULT 1,
      timestamp   TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS active_tables (
      table_id   INT PRIMARY KEY,
      zone       TEXT,
      orders     JSONB        DEFAULT '[]',
      checked_in TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
}

function rowToSale(r) {
  return {
    id:         r.id,
    tableId:    r.table_id,
    zone:       r.zone,
    items:      r.items,
    subtotal:   r.subtotal,
    discount:   r.discount,
    finalTotal: r.final_total,
    cash:       r.cash,
    change:     r.change,
    splitCount: r.split_count,
    timestamp:  r.timestamp,
  };
}

// ── Menu routes ───────────────────────────────────────────────
app.get('/api/menu', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM menu_items ORDER BY id');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/menu/seed', async (req, res) => {
  const { items } = req.body;
  try {
    for (const item of items) {
      await pool.query(
        'INSERT INTO menu_items (name, price, category, is_active) VALUES ($1,$2,$3,$4)',
        [item.name, item.price, item.category, item.is_active]
      );
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/menu', async (req, res) => {
  const { name, price, category, is_active = true } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO menu_items (name, price, category, is_active) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, price, category, is_active]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  const { name, price, category, is_active } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE menu_items SET name=$1, price=$2, category=$3, is_active=$4 WHERE id=$5 RETURNING *',
      [name, price, category, is_active, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM menu_items WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Active tables routes ──────────────────────────────────────
app.get('/api/active-tables', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM active_tables');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/active-tables/:tableId', async (req, res) => {
  const { zone, orders } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO active_tables (table_id, zone, orders)
       VALUES ($1, $2, $3)
       ON CONFLICT (table_id) DO UPDATE SET orders = $3
       RETURNING *`,
      [req.params.tableId, zone, JSON.stringify(orders)]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/active-tables/:tableId', async (req, res) => {
  try {
    await pool.query('DELETE FROM active_tables WHERE table_id = $1', [req.params.tableId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Sales routes ──────────────────────────────────────────────
app.get('/api/sales', async (req, res) => {
  try {
    let query = 'SELECT * FROM sales_log ORDER BY id DESC';
    if (req.query.today === 'true') {
      query = `SELECT * FROM sales_log WHERE timestamp::date = CURRENT_DATE ORDER BY id DESC`;
    }
    const { rows } = await pool.query(query);
    res.json(rows.map(rowToSale));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { tableId, zone, items, subtotal, discount, finalTotal, cash, change, splitCount } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO sales_log (table_id, zone, items, subtotal, discount, final_total, cash, change, split_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [tableId, zone, JSON.stringify(items), subtotal, discount, finalTotal, cash, change, splitCount]
    );
    res.json(rowToSale(rows[0]));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/sales', async (req, res) => {
  try {
    await pool.query('DELETE FROM sales_log');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Start ─────────────────────────────────────────────────────
initDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(e => {
    console.error('DB init failed:', e);
    process.exit(1);
  });
