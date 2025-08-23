const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { orders: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Get all orders
app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json(db.orders || []);
});

// Create a new order
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const orders = db.orders || [];

  // Generate next ID like OS-004
  const nextId = (() => {
    const nums = orders.map(o => {
      const m = o.id && o.id.match(/OS-(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    });
    const max = nums.length ? Math.max(...nums) : 0;
    return `OS-${String(max + 1).padStart(3, '0')}`;
  })();

  const newOrder = Object.assign({ id: nextId }, req.body);
  orders.unshift(newOrder);
  writeDB({ orders });
  res.status(201).json(newOrder);
});

// Optional: update an order
app.put('/api/orders/:id', (req, res) => {
  const db = readDB();
  const orders = db.orders || [];
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  orders[idx] = Object.assign({}, orders[idx], req.body);
  writeDB({ orders });
  res.json(orders[idx]);
});

// Optional: delete an order
app.delete('/api/orders/:id', (req, res) => {
  const db = readDB();
  const orders = db.orders || [];
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = orders.splice(idx, 1)[0];
  writeDB({ orders });
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
