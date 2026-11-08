/* ==========================================================================
   GET /api/stats  —  aggregated click counts for the private dashboard
   --------------------------------------------------------------------------
   Requires the STATS_KEY secret, sent as the x-stats-key header (the
   dashboard stores it in sessionStorage only; it is never in the HTML).

   Responds with per-tool and per-category totals, sorted by clicks, plus a
   monetised / fallback split so a dead-end click is not mistaken for revenue.
   ========================================================================== */

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function num(value) {
  return typeof value === 'number' && isFinite(value) ? value : 0;
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function onRequestGet({ request, env }) {
  if (!env.CLICKS) return json({ ok: false, error: 'store_not_configured' }, 503);

  const expected = env.STATS_KEY || '';
  const provided = request.headers.get('x-stats-key') || '';
  if (!expected || !safeEqual(provided, expected)) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  const listed = await env.CLICKS.list({ prefix: 't:', limit: 1000 });
  const records = await Promise.all(
    listed.keys.map(async (entry) => {
      try {
        return { slug: entry.name.slice(2), record: await env.CLICKS.get(entry.name, 'json') };
      } catch (e) {
        return { slug: entry.name.slice(2), record: null };
      }
    })
  );

  const tools = [];
  const categories = {};
  let total = 0;
  let monetised = 0;
  let fallback = 0;
  let first = null;
  let last = null;

  records.forEach(({ slug, record }) => {
    if (!record || typeof record.n !== 'number') return;
    const category = record.cat || 'unknown';
    const raw = record.counts && typeof record.counts === 'object' ? record.counts : {};
    const counts = {
      live: num(raw.live),
      program: num(raw.program),
      fallback: num(raw.fallback),
      unknown: num(raw.unknown)
    };
    const earnable = counts.live + counts.program;

    total += record.n;
    monetised += earnable;
    fallback += counts.fallback;

    const bucket = categories[category] || (categories[category] = { clicks: 0, monetised: 0 });
    bucket.clicks += record.n;
    bucket.monetised += earnable;

    if (record.first && (!first || record.first < first)) first = record.first;
    if (record.last && (!last || record.last > last)) last = record.last;
    tools.push({
      slug: slug,
      clicks: record.n,
      monetised: earnable,
      fallback: counts.fallback,
      counts: counts,
      category: category,
      last: record.last || null,
      page: record.page || null
    });
  });

  tools.sort((a, b) => b.clicks - a.clicks);

  return json({
    ok: true,
    total: total,
    monetised: monetised,
    fallback: fallback,
    /* Clicks recorded before the split existed, plus any malformed payload. */
    untagged: Math.max(0, total - monetised - fallback),
    toolsCounted: tools.length,
    first: first,
    last: last,
    tools: tools,
    categories: Object.keys(categories)
      .map((name) => ({
        category: name,
        clicks: categories[name].clicks,
        monetised: categories[name].monetised
      }))
      .sort((a, b) => b.clicks - a.clicks)
  });
}
