/* eslint-disable no-undef */
/**
 * Noga API Proxy — Google Cloud Run
 * Deploy this to Cloud Run in europe-west1 with the VPC Connector (noga-connector)
 * and Static IP 35.189.199.30 for egress.
 *
 * All Base44 functions call this proxy instead of Noga directly.
 */

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const NOGA_BASE = process.env.NOGA_BASE_URL || 'https://noga-iso.co.il';

// ── Health check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', proxy: 'noga-proxy', timestamp: new Date().toISOString() });
});

// ── Token endpoint ───────────────────────────────────────────────────────────
// POST /token  { client_id, client_secret }
// Returns: { access_token, token_type, expires_in }
app.post('/token', async (req, res) => {
  const { client_id, client_secret } = req.body;
  if (!client_id || !client_secret) {
    return res.status(400).json({ error: 'client_id and client_secret are required' });
  }

  const upstream = await fetch(`${NOGA_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id, client_secret }),
  });

  const data = await upstream.json();
  res.status(upstream.status).json(data);
});

// ── Current price endpoint ───────────────────────────────────────────────────
// GET /prices/current
// Header: Authorization: Bearer <token>
app.get('/prices/current', async (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Authorization header required' });

  const upstream = await fetch(`${NOGA_BASE}/api/prices/current`, {
    headers: { Authorization: auth },
  });

  const data = await upstream.json();
  res.status(upstream.status).json(data);
});

// ── Generic passthrough (future-proof) ──────────────────────────────────────
// POST /proxy  { path, method, headers, body }
app.post('/proxy', async (req, res) => {
  const { path, method = 'GET', headers = {}, body } = req.body;
  if (!path) return res.status(400).json({ error: 'path is required' });

  const opts = { method, headers };
  if (body) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
    opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
  }

  const upstream = await fetch(`${NOGA_BASE}${path}`, opts);
  const data = await upstream.json();
  res.status(upstream.status).json(data);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Noga proxy running on port ${PORT}`));