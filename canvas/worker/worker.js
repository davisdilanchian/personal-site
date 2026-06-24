/* =====================================================================
   Cloudflare Worker — cross-device sync backend for the canvas board.
   It stores ONE opaque, client-encrypted blob in KV. It never sees the
   board contents (zero-knowledge): the browser encrypts before sending.

   Auth: the client sends  Authorization: Bearer <sha256-hex(password)>.
   The Worker computes sha256-hex(env.CANVAS_PASSWORD) and compares.
   Set the secret with:   wrangler secret put CANVAS_PASSWORD
   (use the SAME password you use to unlock the page).

   Routes:
     OPTIONS /board   -> CORS preflight
     GET     /board   -> 200 { ts, data } | 404
     PUT     /board   -> 200 { ok:true }   (body is the { ts, data } wire blob)
   ===================================================================== */

const ALLOW_ORIGIN = 'https://davisdilanchian.com';

function cors(origin) {
  const ok = origin === ALLOW_ORIGIN || origin === 'http://localhost:8000' || origin === 'http://127.0.0.1:8000';
  return {
    'Access-Control-Allow-Origin': ok ? origin : ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// constant-time-ish string compare
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const ch = cors(origin);
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: ch });
    if (url.pathname !== '/board') return new Response('not found', { status: 404, headers: ch });

    if (!env.CANVAS_PASSWORD) return new Response('server not configured', { status: 500, headers: ch });
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    const expected = await sha256hex(env.CANVAS_PASSWORD);
    if (!token || !safeEqual(token, expected))
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...ch, 'content-type': 'application/json' } });

    if (req.method === 'GET') {
      const v = await env.CANVAS_KV.get('board');
      if (!v) return new Response('', { status: 404, headers: ch });
      return new Response(v, { status: 200, headers: { ...ch, 'content-type': 'application/json' } });
    }

    if (req.method === 'PUT') {
      const body = await req.text();
      if (body.length > 4 * 1024 * 1024) return new Response('too large', { status: 413, headers: ch });
      await env.CANVAS_KV.put('board', body);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...ch, 'content-type': 'application/json' } });
    }

    return new Response('method not allowed', { status: 405, headers: ch });
  },
};
