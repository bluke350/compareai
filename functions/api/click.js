/* ==========================================================================
   POST /api/click  —  count one outbound affiliate click
   --------------------------------------------------------------------------
   Called by assets/js/app.js via navigator.sendBeacon. Stores one KV entry
   per tool:  t:<slug> -> { n, cat, page, first, last }

   No cookies, no IP addresses, no user ids. One write per click, which keeps
   the free KV tier (1,000 writes/day) comfortable for a new site.
   ========================================================================== */

const CATEGORIES = new Set(['writing', 'image', 'video', 'voice', 'coding', 'seo']);

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.CLICKS) return json({ ok: false, error: 'store_not_configured' }, 503);

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'bad_json' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_body' }, 400);

  const slug = typeof body.s === 'string' ? body.s : '';
  const category = typeof body.c === 'string' ? body.c : '';
  const page = typeof body.p === 'string' ? body.p : '';

  if (!/^[a-z0-9-]{2,48}$/.test(slug)) return json({ ok: false, error: 'bad_slug' }, 400);
  if (category && !CATEGORIES.has(category)) return json({ ok: false, error: 'bad_category' }, 400);

  const key = 't:' + slug;
  const now = new Date().toISOString();

  let record = null;
  try {
    record = await env.CLICKS.get(key, 'json');
  } catch (e) { /* first write for this tool */ }

  if (!record || typeof record.n !== 'number') {
    record = { n: 0, cat: category, page: page.slice(0, 120), first: now, last: now };
  }
  record.n += 1;
  record.last = now;
  if (category) record.cat = category;
  if (page) record.page = page.slice(0, 120);

  await env.CLICKS.put(key, JSON.stringify(record));
  return json({ ok: true }, 202);
}
