import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      base = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(() => {
  server.close();
});

test('GET /healthz returns ok', async () => {
  const res = await fetch(`${base}/healthz`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('GET /version returns a version', async () => {
  const res = await fetch(`${base}/version`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(typeof body.version === 'string');
});

test('GET /products returns the full list', async () => {
  const res = await fetch(`${base}/products`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  assert.equal(body.length, 3);
});

test('GET /products/:id returns a single product', async () => {
  const res = await fetch(`${base}/products/1`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.name, 'Widget');
});

test('GET /products/:id returns 404 for an unknown id', async () => {
  const res = await fetch(`${base}/products/999`);
  assert.equal(res.status, 404);
});
