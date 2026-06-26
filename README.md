# products-api

A minimal Node.js REST service that exists as the **prop** for the standard
Cursor + Harness demo. The app is intentionally boring — the star of the demo
is what Harness does to this code on its way to production.

## Run locally

```bash
npm install
npm start          # serves on http://localhost:3000
npm test           # runs the test suite (Node's built-in test runner)
```

### Endpoints

| Method | Path            | Returns                          |
| ------ | --------------- | -------------------------------- |
| GET    | `/healthz`      | `{ "status": "ok" }`             |
| GET    | `/version`      | `{ "version": "1.0.0" }`         |
| GET    | `/products`     | list of products                 |
| GET    | `/products/:id` | one product, or 404              |

## Build the container

```bash
docker build -t products-api:local .
docker run -p 3000:3000 products-api:local
```

## Act 1 — the live edit

In the demo, make one small visible change in Cursor so there is "new code"
to ship. Drop this readiness probe into `src/app.js` next to `/healthz`:

```js
// Readiness probe — added live during the demo
app.get('/readyz', (_req, res) => {
  res.json({ ready: true });
});
```

Then add a matching assertion to `test/app.test.js` if you want the test
step to prove the new endpoint:

```js
test('GET /readyz returns ready', async () => {
  const res = await fetch(`${base}/readyz`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ready, true);
});
```

## The demo prompts (paste into the Cursor Agent panel)

1. `Give me a health overview of my products-api project in Harness`
2. `Create a CI/CD pipeline for this Node.js app that builds, runs tests, pushes a Docker image to my registry, and deploys to staging`
3. `Run the pipeline and show me the result`
4. `Debug my last failed deployment — what went wrong and how do I fix it?`
5. `Show me DORA metrics for this project over the last quarter`
6. (optional) `Find cost anomalies in the last 30 days and recommend optimizations`

## Notes

- `.harness/products-api-pipeline.yml` is a **fallback skeleton only**. The
  standard demo path is to let the Harness plugin generate the pipeline live
  (prompt 2) so the template-governance and policy-validation hooks fire on
  screen. Use the file only if live generation fails.
- Set `HARNESS_API_KEY` and `HARNESS_ACCOUNT_ID` in your shell before launching
  Cursor, or the governance hooks fail open silently and the best moment of the
  demo is lost.
