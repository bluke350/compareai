/* ==========================================================================
   CompareAI — private click dashboard
   Reads /api/stats with a key held in sessionStorage. No key, no data.
   ========================================================================== */

(function () {
  'use strict';

  var KEY_STORE = 'compareai.statsKey';
  var $ = function (sel) { return document.querySelector(sel); };

  var form = $('#statsKeyForm');
  var input = $('#statsKey');
  var panel = $('#statsKeyPanel');
  var dash = $('#statsDash');
  var statusEl = $('#statsStatus');
  var errorEl = $('#statsError');
  var refreshBtn = $('#statsRefresh');
  var forgetBtn = $('#statsForget');

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toolName(slug) {
    var list = window.TOOLS || [];
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i].name;
    return slug;
  }

  function toolCategory(slug) {
    var list = window.TOOLS || [];
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i].categoryLabel;
    return '';
  }

  function when(iso) {
    if (!iso) return '—';
    var then = new Date(iso).getTime();
    if (!isFinite(then)) return '—';
    var mins = Math.round((Date.now() - then) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.round(hours / 24);
    if (days < 30) return days + 'd ago';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function signedIn() {
    try { return window.sessionStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }

  function remember(key) {
    try { window.sessionStorage.setItem(KEY_STORE, key); } catch (e) { /* private mode */ }
  }

  function forget() {
    try { window.sessionStorage.removeItem(KEY_STORE); } catch (e) { /* ignore */ }
  }

  function showForm(message) {
    panel.hidden = false;
    dash.hidden = true;
    errorEl.textContent = message || '';
    if (input) input.focus();
  }

  function render(data) {
    panel.hidden = true;
    dash.hidden = false;

    var topCategory = data.categories[0];
    $('#statTotal').textContent = data.total.toLocaleString('en-US');
    $('#statTools').textContent = data.toolsCounted.toLocaleString('en-US');
    $('#statCategory').textContent = topCategory
      ? (topCategory.category === 'unknown' ? 'Unattributed' : topCategory.category)
      : '—';
    $('#statLast').textContent = when(data.last);

    var monetised = typeof data.monetised === 'number' ? data.monetised : null;
    var monetisedEl = $('#statMonetised');
    if (monetisedEl) {
      if (monetised === null) {
        monetisedEl.textContent = '—';
      } else {
        var share = data.total ? Math.round((monetised / data.total) * 100) : 0;
        monetisedEl.textContent = monetised.toLocaleString('en-US') + (data.total ? ' · ' + share + '%' : '');
      }
    }
    statusEl.textContent = 'Updated ' + new Date().toLocaleTimeString('en-US');

    var max = data.tools.length ? data.tools[0].clicks : 0;
    $('#toolRows').innerHTML = data.tools.map(function (t) {
      var pct = max ? Math.max(2, Math.round((t.clicks / max) * 100)) : 0;
      var earnable = typeof t.monetised === 'number' ? t.monetised : null;
      var earnCell = earnable === null
        ? '<span class="muted">—</span>'
        : earnable.toLocaleString('en-US') + ' <span class="tiny muted">of ' + t.clicks.toLocaleString('en-US') + '</span>';
      return '<tr>' +
        '<td class="tool-name">' + esc(toolName(t.slug)) + '<small>' + esc(t.slug) + '</small></td>' +
        '<td>' + esc(toolCategory(t.slug)) + '</td>' +
        '<td class="num">' + t.clicks.toLocaleString('en-US') + '</td>' +
        '<td class="num">' + earnCell + '</td>' +
        '<td style="min-width:120px"><span class="share-bar" style="width:' + pct + '%"></span></td>' +
        '<td class="num">' + esc(when(t.last)) + '</td>' +
        '</tr>';
    }).join('') || '<tr><td colspan="6" class="muted">No clicks recorded yet. Open a comparison page and use a Visit button.</td></tr>';

    var catTotal = data.categories.reduce(function (sum, c) { return sum + c.clicks; }, 0);
    var labels = {
      writing: 'AI Writing', image: 'AI Image', video: 'AI Video',
      voice: 'AI Voice', coding: 'AI Coding', seo: 'AI SEO', unknown: 'Unattributed'
    };
    $('#catRows').innerHTML = data.categories.map(function (c) {
      var share = catTotal ? Math.round((c.clicks / catTotal) * 100) : 0;
      var earnable = typeof c.monetised === 'number' ? ' · ' + c.monetised.toLocaleString('en-US') + ' earnable' : '';
      return '<tr><td>' + esc(labels[c.category] || c.category) + '</td>' +
        '<td class="num">' + c.clicks.toLocaleString('en-US') + '<span class="tiny muted">' + esc(earnable) + '</span></td>' +
        '<td class="num">' + share + '%</td></tr>';
    }).join('') || '<tr><td colspan="3" class="muted">Nothing yet.</td></tr>';

    $('#statsSince').textContent = data.first ? when(data.first) : '—';
  }

  function load(key) {
    statusEl.textContent = 'Loading…';
    fetch('/api/stats', { headers: { 'x-stats-key': key } })
      .then(function (res) {
        if (res.status === 401) throw new Error('wrong-key');
        if (!res.ok) throw new Error('http-' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.ok) throw new Error('bad-payload');
        render(data);
      })
      .catch(function (err) {
        if (err && err.message === 'wrong-key') {
          forget();
          showForm('That key was rejected. Check the value you set as STATS_KEY.');
        } else {
          showForm('Could not load stats (' + (err && err.message ? err.message : 'network') + '). Try again.');
        }
      });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = (input.value || '').trim();
      if (!key) { errorEl.textContent = 'Enter your stats key.'; return; }
      errorEl.textContent = '';
      remember(key);
      load(key);
    });
  }

  if (refreshBtn) refreshBtn.addEventListener('click', function () {
    var key = signedIn();
    if (key) load(key); else showForm('');
  });

  if (forgetBtn) forgetBtn.addEventListener('click', function () {
    forget();
    showForm('Key cleared from this tab.');
  });

  var existing = signedIn();
  if (existing) load(existing); else showForm('');
})();
