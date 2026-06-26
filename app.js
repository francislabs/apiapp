import express from 'express';

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Widget', price: 9.99 },
  { id: 2, name: 'Gadget', price: 19.99 },
  { id: 3, name: 'Gizmo', price: 14.5 },
];

// Liveness probe
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

// Surfaced so the deploy is visibly "the new version" in a demo
app.get('/version', (_req, res) => {
  res.json({ version: process.env.APP_VERSION || '1.0.0' });
});

app.get('/products', (_req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'not found' });
  }
  res.json(product);
});

export default app;
