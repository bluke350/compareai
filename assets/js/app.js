/* ==========================================================================
   CompareAI — site behaviour
   Classic script (no modules) so everything works over file:// as well as
   a static host. Features: theme, mobile nav, affiliate link resolution,
   compare tray + dialog, category filters/sort, site search, cost
   calculators, monetization monitor, copy buttons, deep links.
   ========================================================================== */

(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var SITES = {
    jasper: 'https://www.jasper.ai/',
    writesonic: 'https://writesonic.com/',
    surfer: 'https://surfer.ai/',
    grammarly: 'https://www.grammarly.com/',
    copyai: 'https://www.copy.ai/',
    rytr: 'https://rytr.me/',
    firefly: 'https://www.adobe.com/products/firefly.html',
    midjourney: 'https://www.midjourney.com/',
    ideogram: 'https://ideogram.ai/',
    canva: 'https://www.canva.com/',
    leonardo: 'https://leonardo.ai/',
    synthesia: 'https://www.synthesia.io/',
    heygen: 'https://www.heygen.com/',
    invideo: 'https://invideo.io/',
    veed: 'https://www.veed.io/',
    descript: 'https://www.descript.com/',
    opusclip: 'https://www.opus.pro/',
    elevenlabs: 'https://elevenlabs.io/',
    murf: 'https://murf.ai/',
    playht: 'https://play.ht/',
    cartesia: 'https://cartesia.ai/',
    copilot: 'https://github.com/features/copilot',
    cursor: 'https://cursor.com/',
    windsurf: 'https://windsurf.com/',
    tabnine: 'https://www.tabnine.com/',
    coderabbit: 'https://www.coderabbit.ai/',
    claude: 'https://claude.com/'
  };

  var THEME_KEY = 'compareai.theme';
  var COMPARE_KEY = 'compareai.compare.v1';

  var memory = {};

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === null) return key in memory ? memory[key] : fallback;
      return JSON.parse(raw);
    } catch (e) {
      return key in memory ? memory[key] : fallback;
    }
  }

  function write(key, value) {
    memory[key] = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* file:// or private mode — memory only */ }
  }

  function tools() { return window.TOOLS || []; }
  function bySlug(slug) {
    var list = tools();
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }
  function money(n) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      maximumFractionDigits: n % 1 ? 2 : 0
    }).format(n);
  }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ------------------------------- Toast -------------------------------- */
  var toastTimer;
  function toast(message) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2400);
  }

  /* ------------------------------- Theme -------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = $('[data-theme-toggle]');
    if (btn) btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
  }
  applyTheme(read(THEME_KEY, 'dark'));
  $$('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      write(THEME_KEY, next);
    });
  });

  /* ----------------------------- Mobile nav ----------------------------- */
  var navToggle = $('[data-nav-toggle]');
  var navLinks = $('#navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', navLinks).forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('is-open'); });
    });
  }

  /* ------------------------- Affiliate resolution ------------------------ */
  function trackAffiliateClick(a) {
    try {
      if (!/^https?:$/.test(window.location.protocol)) return;
      var slug = a.getAttribute('data-aff');
      var t = bySlug(slug);
      var body = JSON.stringify({
        s: slug,
        c: t ? t.category : '',
        p: window.location.pathname,
        st: a.getAttribute('data-aff-status') || ''
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/click', new Blob([body], { type: 'application/json' }));
      } else if (window.fetch) {
        fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          keepalive: true
        }).catch(function () { /* a lost count must never block the click */ });
      }
    } catch (e) { /* ignore */ }
  }

  function wireAffiliates() {
    var config = window.AFFILIATE_LINKS || {};
    $$('a[data-aff]').forEach(function (a) {
      var slug = a.getAttribute('data-aff');
      var custom = config[slug];
      var tool = bySlug(slug);
      if (custom && /^https?:\/\//i.test(custom)) {
        a.setAttribute('href', custom);
        a.setAttribute('data-aff-status', 'live');
      } else if (tool && window.AFFILIATE_FALLBACK === 'program' && tool.affiliate && tool.affiliate.url) {
        a.setAttribute('href', tool.affiliate.url);
        a.setAttribute('data-aff-status', 'program');
      } else {
        a.setAttribute('href', SITES[slug] || (tool && tool.affiliate && tool.affiliate.url) || '#');
        a.setAttribute('data-aff-status', 'fallback');
      }
      a.setAttribute('target', '_blank');
      /* "sponsored" is only accurate when money can change hands. Vendor
         fallbacks (no link configured, or no/closed program) get plain
         noopener so the markup does not claim a relationship that is absent. */
      var monetized = a.getAttribute('data-aff-status') === 'live' ||
        a.getAttribute('data-aff-status') === 'program';
      a.setAttribute('rel', monetized ? 'sponsored noopener' : 'noopener');

      if (!a.dataset.affTracked) {
        a.dataset.affTracked = '1';
        a.addEventListener('click', function () { trackAffiliateClick(a); });
        a.addEventListener('auxclick', function (e) { if (e.button === 1) trackAffiliateClick(a); });
      }
    });
  }
  wireAffiliates();

  /* ----------------------------- Compare tray ---------------------------- */
  var compare = read(COMPARE_KEY, []);
  if (!Array.isArray(compare)) compare = [];

  function saveCompare() {
    write(COMPARE_KEY, compare);
    renderTray();
    syncCompareButtons();
  }

  function renderTray() {
    var tray = $('#compareTray');
    if (!tray) return;
    var chips = $('[data-tray-chips]', tray);
    var openBtns = $$('[data-open-compare]');

    if (chips) {
      if (!compare.length) {
        chips.innerHTML = '<span class="tray-empty">Pick up to 3 tools to compare</span>';
      } else {
        chips.innerHTML = compare.map(function (slug) {
          var t = bySlug(slug);
          var name = t ? t.name : slug;
          return '<span class="tray-chip">' + esc(name) +
            '<button type="button" data-remove-compare="' + esc(slug) + '" aria-label="Remove ' + esc(name) + '">&times;</button></span>';
        }).join('');
        $$('[data-remove-compare]', chips).forEach(function (btn) {
          btn.addEventListener('click', function () {
            compare = compare.filter(function (s) { return s !== btn.getAttribute('data-remove-compare'); });
            saveCompare();
          });
        });
      }
    }

    tray.classList.toggle('is-open', compare.length > 0);
    $$('[data-tray-count]', tray).forEach(function (el) {
      el.textContent = compare.length + '/3 selected';
    });
    openBtns.forEach(function (btn) {
      btn.disabled = compare.length < 2;
      btn.setAttribute('aria-disabled', compare.length < 2 ? 'true' : 'false');
    });
  }

  function syncCompareButtons() {
    $$('[data-compare]').forEach(function (btn) {
      var slug = btn.getAttribute('data-compare');
      var active = compare.indexOf(slug) !== -1;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      var label = btn.querySelector('span') || btn;
      label.textContent = active ? 'Added' : 'Compare';
    });
  }

  $$('[data-compare]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slug = btn.getAttribute('data-compare');
      if (compare.indexOf(slug) !== -1) {
        compare = compare.filter(function (s) { return s !== slug; });
      } else {
        if (compare.length >= 3) { toast('You can compare 3 tools at a time'); return; }
        compare.push(slug);
      }
      saveCompare();
    });
  });

  $$('[data-clear-compare]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      compare = [];
      saveCompare();
      toast('Comparison cleared');
    });
  });

  function buildCompareTable() {
    var dialog = $('#compareDialog');
    if (!dialog) return;
    var table = $('table', dialog);
    if (!table) return;
    var heads = $('thead', table);
    var body = $('tbody', table);
    var selected = compare.map(bySlug).filter(Boolean);

    heads.innerHTML = '<tr><th scope="col">Attribute</th>' + selected.map(function (t) {
      return '<th scope="col">' + esc(t.name) + '<br><span class="tiny muted">' + esc(t.categoryLabel) + '</span></th>';
    }).join('') + '</tr>';

    function row(label, cells) {
      return '<tr><td class="nowrap muted">' + label + '</td>' + cells.map(function (c) {
        return '<td>' + c + '</td>';
      }).join('') + '</tr>';
    }

    body.innerHTML = [
      row('Entry price', selected.map(function (t) {
        return '<strong class="win">' + esc(t.price) + '</strong><br><span class="tiny muted">' + esc(t.planLabel) + '</span>';
      })),
      row('Editor score', selected.map(function (t) {
        return '<strong>' + t.rating.toFixed(1) + '</strong> <span class="tiny muted">/ 5</span>';
      })),
      row('Best for', selected.map(function (t) { return esc(t.bestFor); })),
      row('Trial', selected.map(function (t) { return esc(t.trial); })),
      row('Standouts', selected.map(function (t) {
        return '<ul class="mini-pros">' + t.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>';
      })),
      row('Watch out for', selected.map(function (t) {
        return '<ul class="mini-pros">' + (t.cons || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>';
      })),
      row('Affiliate program', selected.map(function (t) {
        var status = t.affiliate.status;
        var cls = status === 'open' ? 'status--live' : status === 'verify' ? 'status--verify' : status === 'closed' ? 'status--closed' : 'status--none';
        var label = status === 'open' ? 'Open' : status === 'verify' ? 'Verify terms' : status === 'closed' ? 'Closed' : 'None';
        return '<span class="status ' + cls + '">' + label + '</span>';
      })),
      row('Verdict', selected.map(function (t) { return esc(t.verdict); })),
      row('', selected.map(function (t) {
        return '<a class="btn btn--sm btn--primary" data-aff="' + esc(t.slug) + '" href="' + esc(SITES[t.slug] || '#') + '" target="_blank" rel="sponsored noopener">Visit ' + esc(t.name) + '</a>';
      }))
    ].join('');

    wireAffiliates();
  }

  function openCompare() {
    var dialog = $('#compareDialog');
    if (!dialog) return;
    if (compare.length < 2) { toast('Add at least two tools first'); return; }
    buildCompareTable();
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', 'open');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeCompare() {
    var dialog = $('#compareDialog');
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    document.body.style.overflow = '';
  }

  $$('[data-open-compare]').forEach(function (btn) { btn.addEventListener('click', openCompare); });
  $$('[data-close-compare]').forEach(function (btn) { btn.addEventListener('click', closeCompare); });
  var dialogEl = $('#compareDialog');
  if (dialogEl) {
    dialogEl.addEventListener('click', function (e) {
      if (e.target === dialogEl) closeCompare();
    });
    dialogEl.addEventListener('close', function () { document.body.style.overflow = ''; });
  }

  renderTray();
  syncCompareButtons();

  /* ------------------------- Category filter/sort ------------------------ */
  $$('[data-sortable]').forEach(function (grid) {
    var scope = grid.closest('[data-filter-scope]') || document;
    var buttons = $$('[data-filter]', scope);
    var select = $('[data-sort]', scope);
    var counter = $('[data-count]', scope);
    var empty = $('[data-empty]', scope);
    var cards = $$('.tool-card', grid);
    var original = cards.slice();
    var activeFilter = 'all';

    cards.forEach(function (card) { card.setAttribute('data-original', original.indexOf(card)); });

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
        var show = activeFilter === 'all' || tags.indexOf(activeFilter) !== -1;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      if (counter) counter.textContent = visible + (visible === 1 ? ' tool' : ' tools');
      if (empty) empty.classList.toggle('hidden', visible !== 0);
    }

    function sortBy(mode) {
      var ordered = original.slice();
      if (mode === 'price-asc' || mode === 'price-desc') {
        ordered.sort(function (a, b) {
          var av = parseFloat(a.getAttribute('data-price'));
          var bv = parseFloat(b.getAttribute('data-price'));
          if (isNaN(av)) av = Infinity;
          if (isNaN(bv)) bv = Infinity;
          return mode === 'price-asc' ? av - bv : bv - av;
        });
      } else if (mode === 'rating') {
        ordered.sort(function (a, b) {
          return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
        });
      } else if (mode === 'name') {
        ordered.sort(function (a, b) {
          return (a.getAttribute('data-name') || '').localeCompare(b.getAttribute('data-name') || '');
        });
      }
      ordered.forEach(function (card) { grid.appendChild(card); });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        apply();
      });
    });

    if (select) {
      select.addEventListener('change', function () {
        sortBy(select.value);
        apply();
      });
    }

    apply();
  });

  /* -------------------------------- Search ------------------------------- */
  var searchInput = $('#toolSearch');
  if (searchInput) {
    var results = $('#searchResults');
    var searchCount = $('#searchCount');

    function renderSearch(query) {
      if (!results) return;
      var q = query.trim().toLowerCase();
      if (!q) {
        results.innerHTML = '';
        if (searchCount) searchCount.textContent = '';
        return;
      }
      var hits = tools().filter(function (t) {
        var hay = [t.name, t.categoryLabel, t.tagline, t.bestFor, (t.highlights || []).join(' '), (t.pros || []).join(' ')]
          .join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      }).slice(0, 8);

      if (searchCount) {
        searchCount.textContent = hits.length
          ? hits.length + (hits.length === 1 ? ' match' : ' matches')
          : 'No matches';
      }
      if (!hits.length) {
        results.innerHTML = '<p class="search-empty">Nothing matched “' + esc(query) +
          '”. Try “voice”, “avatar”, “SEO” or “free”.</p>';
        return;
      }
      results.innerHTML = hits.map(function (t) {
        return '<a class="search-hit" href="' + esc(t.page) + '#' + esc(t.slug) + '">' +
          '<span class="badge">' + esc(t.categoryLabel) + '</span>' +
          '<span class="hit-main"><strong>' + esc(t.name) + '</strong><span>' + esc(t.tagline) + '</span></span>' +
          '<span class="tiny nowrap">' + esc(t.price) + '</span>' +
          '</a>';
      }).join('');
    }

    searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== searchInput && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  /* ------------------------------ Calculators ---------------------------- */
  $$('[data-calc]').forEach(function (root) {
    var slugs = (root.getAttribute('data-calc-tools') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var select = $('[data-calc-tool]', root);
    var seats = $('[data-calc-seats]', root);
    var months = $('[data-calc-months]', root);
    var outMonthly = $('[data-calc-monthly]', root);
    var outAnnual = $('[data-calc-annual]', root);
    var outDiscounted = $('[data-calc-discounted]', root);

    if (!select || !outMonthly) return;

    select.innerHTML = slugs.map(function (slug) {
      var t = bySlug(slug);
      if (!t) return '';
      return '<option value="' + esc(slug) + '">' + esc(t.name) + ' — ' + esc(t.price) + '</option>';
    }).join('');

    function update() {
      var t = bySlug(select.value);
      var seatCount = Math.max(1, Math.min(500, parseInt(seats && seats.value, 10) || 1));
      var monthCount = Math.max(1, Math.min(36, parseInt(months && months.value, 10) || 12));
      var price = t && typeof t.priceNum === 'number' ? t.priceNum : 0;
      var monthly = price * seatCount;
      var total = monthly * monthCount;
      outMonthly.textContent = money(monthly) + '/mo';
      if (outAnnual) outAnnual.textContent = money(total);
      if (outDiscounted) outDiscounted.textContent = money(monthly * 0.8 * monthCount);
    }

    [select, seats, months].forEach(function (el) {
      if (el) { el.addEventListener('input', update); el.addEventListener('change', update); }
    });
    update();
  });

  /* -------------------------- Monetization monitor ----------------------- */
  var monitor = $('[data-aff-monitor]');
  if (monitor) {
    var config = window.AFFILIATE_LINKS || {};
    var list = tools();
    var monetizable = list.filter(function (t) { return t.affiliate.status === 'open'; });
    var live = monetizable.filter(function (t) { return config[t.slug] && /^https?:\/\//i.test(config[t.slug]); });
    var totalLinks = Object.keys(config).length;

    $$('[data-aff-live]', monitor).forEach(function (el) { el.textContent = live.length; });
    $$('[data-aff-open]', monitor).forEach(function (el) { el.textContent = monetizable.length; });
    $$('[data-aff-total]', monitor).forEach(function (el) { el.textContent = totalLinks; });

    var rows = $('[data-aff-rows]', monitor);
    if (rows) {
      rows.innerHTML = monetizable.map(function (t) {
        var configured = !!(config[t.slug] && /^https?:\/\//i.test(config[t.slug]));
        return '<tr>' +
          '<td class="tool-name">' + esc(t.name) + '<small>' + esc(t.affiliate.program) + '</small></td>' +
          '<td>' + esc(t.affiliate.commission) + '</td>' +
          '<td class="num">' + esc(t.affiliate.cookie) + '</td>' +
          '<td>' + (configured
            ? '<span class="status status--live">Link live</span>'
            : '<span class="status status--verify">Add your link</span>') + '</td>' +
          '<td><a class="btn btn--sm" href="' + esc(t.affiliate.url) + '" target="_blank" rel="noopener">Apply free →</a></td>' +
          '</tr>';
      }).join('');
    }
  }

  /* -------------------------- Earnings calculator ------------------------ */
  var earnings = $('[data-earnings]');
  if (earnings) {
    var eSelect = $('[data-earnings-tool]', earnings);
    var eRefs = $('[data-earnings-refs]', earnings);
    var eMonths = $('[data-earnings-months]', earnings);
    var ePer = $('[data-earnings-per]', earnings);
    var eMonthly = $('[data-earnings-monthly]', earnings);
    var eTotal = $('[data-earnings-total]', earnings);
    var eVolume = $('[data-earnings-volume]', earnings);

    var eList = tools().filter(function (t) {
      var a = t.affiliate;
      return a && (typeof a.pct === 'number' || typeof a.flat === 'number');
    });

    if (eSelect) {
      eSelect.innerHTML = eList.map(function (t) {
        var a = t.affiliate;
        var model = typeof a.flat === 'number'
          ? money(a.flat) + ' per lead'
          : a.pct + '% for ' + a.months + ' mo';
        return '<option value="' + esc(t.slug) + '">' + esc(t.name) + ' — ' + esc(model) + '</option>';
      }).join('');
    }

    function updateEarnings() {
      var t = bySlug(eSelect ? eSelect.value : '');
      if (!t) return;
      var a = t.affiliate;
      var refs = Math.max(1, Math.min(1000, parseInt(eRefs && eRefs.value, 10) || 10));
      var months = Math.max(1, Math.min(24, parseInt(eMonths && eMonths.value, 10) || 12));
      var windowMonths = Math.max(1, Math.min(months, a.months || 1));

      var perReferral = typeof a.flat === 'number'
        ? a.flat
        : (a.avgPrice || 0) * ((a.pct || 0) / 100) * windowMonths;
      var monthlyRun = (perReferral / windowMonths) * refs;
      var total = monthlyRun * months;

      if (ePer) ePer.textContent = money(perReferral);
      if (eMonthly) eMonthly.textContent = money(monthlyRun);
      if (eTotal) eTotal.textContent = money(total);
      if (eVolume) eVolume.textContent = (refs * months).toLocaleString('en-US');
    }

    [eSelect, eRefs, eMonths].forEach(function (el) {
      if (el) { el.addEventListener('input', updateEarnings); el.addEventListener('change', updateEarnings); }
    });
    updateEarnings();
  }

  /* ------------------------------- Copy ---------------------------------- */
  $$('[data-copy-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = $(btn.getAttribute('data-copy-target'));
      if (!target) return;
      copyText(target.innerText || target.textContent || '');
    });
  });
  $$('[data-copy-text]').forEach(function (btn) {
    btn.addEventListener('click', function () { copyText(btn.getAttribute('data-copy-text')); });
  });

  function copyText(text) {
    function done() { toast('Copied to clipboard'); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', 'readonly');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Press Ctrl/Cmd+C to copy'); }
      document.body.removeChild(area);
    }
  }

  /* ------------------------------ Deep links ----------------------------- */
  function highlightHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return;
    var card = document.getElementById(hash);
    if (!card) return;
    card.classList.add('is-highlighted');
    setTimeout(function () { card.classList.remove('is-highlighted'); }, 2600);
    var y = card.getBoundingClientRect().top + window.pageYOffset - 92;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  if (window.location.hash) {
    window.addEventListener('load', function () { setTimeout(highlightHash, 120); });
  }
  window.addEventListener('hashchange', highlightHash);

  /* -------------------------------- Year --------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
