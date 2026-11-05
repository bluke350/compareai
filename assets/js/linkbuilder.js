/* ==========================================================================
   CompareAI — affiliate link builder (monetize.html#builder)
   Renders one field per slug from window.TOOLS, validates the URLs, and
   writes a complete replacement for assets/js/affiliates.js.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.querySelector('[data-link-builder]');
  if (!root) return;

  var tools = window.TOOLS || [];
  var initial = window.AFFILIATE_LINKS || {};

  var GROUPS = [
    ['writing', 'AI writing'],
    ['image', 'AI image'],
    ['video', 'AI video'],
    ['voice', 'AI voice'],
    ['coding', 'AI coding'],
    ['seo', 'AI SEO / visibility']
  ];

  var GROUP_LABELS = {
    writing: 'AI writing',
    image: 'AI image',
    video: 'AI video',
    voice: 'AI voice',
    coding: 'AI coding',
    seo: 'AI SEO / visibility'
  };

  var fieldsEl = root.querySelector('[data-lb-fields]');
  var outputEl = root.querySelector('[data-lb-output]');
  var countEl = root.querySelector('[data-lb-count]');
  var statusEl = root.querySelector('[data-lb-status]');
  var copyBtn = root.querySelector('[data-lb-copy]');
  var resetBtn = root.querySelector('[data-lb-reset]');

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isValid(url) {
    return /^https?:\/\/[^\s"'<>\\]+$/i.test(url);
  }

  function toolBySlug(slug) {
    for (var i = 0; i < tools.length; i++) if (tools[i].slug === slug) return tools[i];
    return null;
  }

  function buildFields() {
    var html = '';
    GROUPS.forEach(function (group) {
      var inGroup = tools.filter(function (t) { return t.category === group[0]; });
      if (!inGroup.length) return;
      html += '<div class="lb-group"><span class="eyebrow">' + esc(group[1]) + '</span>' +
        '<div class="lb-grid">';
      inGroup.forEach(function (tool) {
        var value = typeof initial[tool.slug] === 'string' ? initial[tool.slug] : '';
        var badge = tool.affiliate && tool.affiliate.status === 'open'
          ? '<span class="lb-open">Open</span>' : '';
        html += '<div class="field lb-field" data-slug="' + esc(tool.slug) + '">' +
          '<label for="lb-' + esc(tool.slug) + '"><span>' + esc(tool.name) + '</span>' + badge + '</label>' +
          '<input id="lb-' + esc(tool.slug) + '" type="url" inputmode="url" autocomplete="off" spellcheck="false"' +
          ' placeholder="https://…" value="' + esc(value) + '">' +
          '<span class="lb-error" hidden>Use a full https:// tracking URL</span>' +
          '</div>';
      });
      html += '</div></div>';
    });
    fieldsEl.innerHTML = html;
  }

  function readEntries() {
    var entries = [];
    var invalid = 0;
    var filled = 0;
    var openFilled = 0;

    Array.prototype.forEach.call(fieldsEl.querySelectorAll('.lb-field'), function (wrap) {
      var slug = wrap.getAttribute('data-slug');
      var input = wrap.querySelector('input');
      var error = wrap.querySelector('.lb-error');
      var tool = toolBySlug(slug);
      var raw = (input.value || '').trim();
      var ok = raw === '' || isValid(raw);

      wrap.classList.toggle('is-invalid', !ok);
      error.hidden = ok;
      if (!ok) invalid += 1;

      if (ok && raw) {
        filled += 1;
        if (tool && tool.affiliate && tool.affiliate.status === 'open') openFilled += 1;
      }

      entries.push({ slug: slug, tool: tool, value: ok ? raw : '' });
    });

    return { entries: entries, invalid: invalid, filled: filled, openFilled: openFilled };
  }

  function render() {
    var state = readEntries();
    var entries = state.entries;
    var maxKey = 0;
    entries.forEach(function (e) { maxKey = Math.max(maxKey, e.slug.length + 1); });

    var lines = [
      '/* ==========================================================================',
      '   CompareAI — affiliate links',
      '   Generated on monetize.html from the links you pasted.',
      '   Paste over the whole of assets/js/affiliates.js.',
      '   ========================================================================== */',
      '',
      'window.AFFILIATE_LINKS = {'
    ];

    var lastCategory = null;
    entries.forEach(function (entry, index) {
      var category = entry.tool ? entry.tool.category : '';
      if (category !== lastCategory) {
        if (index) lines.push('');
        lines.push('  /* --- ' + (GROUP_LABELS[category] || category) + ' --- */');
        lastCategory = category;
      }
      var pad = new Array(Math.max(1, maxKey + 2 - (entry.slug.length + 1))).join(' ');
      var comment = entry.tool && entry.tool.affiliate && entry.tool.affiliate.commission
        ? '   // ' + entry.tool.affiliate.commission
        : '';
      var comma = index === entries.length - 1 ? '' : ',';
      lines.push('  ' + entry.slug + ':' + pad + JSON.stringify(entry.value) + comma + comment);
    });

    lines.push('};');
    lines.push('');
    lines.push('window.AFFILIATE_FALLBACK = "vendor";');

    outputEl.textContent = lines.join('\n');

    var openTotal = tools.filter(function (t) {
      return t.affiliate && t.affiliate.status === 'open';
    }).length;

    countEl.textContent = state.filled + ' of ' + entries.length + ' filled · ' +
      state.openFilled + '/' + openTotal + ' open programs ready';

    statusEl.textContent = state.invalid
      ? state.invalid + (state.invalid === 1 ? ' entry was' : ' entries were') +
        ' ignored — fix the highlighted fields.'
      : '';
  }

  function copyOutput() {
    var text = outputEl.textContent;

    function done(message) {
      copyBtn.textContent = message;
      setTimeout(function () { copyBtn.textContent = 'Copy config'; }, 1800);
    }
    function fallback() {
      var area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); done('Copied'); }
      catch (e) { done('Press Ctrl/Cmd+C'); }
      document.body.removeChild(area);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done('Copied'); }).catch(fallback);
    } else {
      fallback();
    }
  }

  buildFields();
  render();

  fieldsEl.addEventListener('input', render);
  if (copyBtn) copyBtn.addEventListener('click', copyOutput);
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      buildFields();
      render();
    });
  }
})();
