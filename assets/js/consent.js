/* ==========================================================================
   CompareAI — analytics consent gate
   Microsoft Clarity is loaded only after an explicit "Allow analytics".
   Without a stored choice the banner appears; declining is remembered and
   nothing is loaded. No cookies of our own, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'compareai-analytics-consent';
  var CLARITY_ID = 'z9b2qgdh46';
  var COPY =
    'We use Microsoft Clarity to record session replays and heatmaps so we can see ' +
    'which pages are unclear. It sets its own cookies. Everything works if you decline, ' +
    'and you can change this later on the about page.';

  function loadClarity() {
    if (window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i + '?ref=bwt';
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function write(value) {
    try { window.localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
  }

  function clear() {
    try { window.localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
  }

  function decide(value) {
    write(value);
    var box = document.querySelector('.consent');
    if (box) box.remove();
    if (value === 'granted') loadClarity();
  }

  function render() {
    if (document.querySelector('.consent') || !document.body) return;

    var box = document.createElement('div');
    box.className = 'consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Analytics choice');
    box.innerHTML =
      '<p class="consent__text">' + COPY + '</p>' +
      '<div class="consent__actions">' +
      '<button type="button" class="btn btn--ghost btn--sm" data-consent="denied">Essential only</button>' +
      '<button type="button" class="btn btn--primary btn--sm" data-consent="granted">Allow analytics</button>' +
      '</div>';
    document.body.appendChild(box);

    box.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (button) decide(button.getAttribute('data-consent'));
    });
  }

  // A "change your choice" control lives on the about page; it clears the
  // stored answer and reloads so the banner can appear again.
  document.addEventListener('click', function (event) {
    var reset = event.target.closest('[data-consent-reset]');
    if (!reset) return;
    event.preventDefault();
    clear();
    window.location.reload();
  });

  var choice = read();
  if (choice === 'granted') { loadClarity(); return; }
  if (choice === 'denied') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
