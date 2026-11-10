/* Portfolio: filter + search + "show more" paging over window.PORTFOLIO. */
(function () {
  'use strict';
  var DATA = window.PORTFOLIO || [];
  var PAGE = 24;
  var DETAIL_URL = 'https://www.coreprewfilms.com/portfolio/{id}/details';
  var LABELS = { all: 'All', weddings: 'Weddings', ceremonies: 'Cultural ceremonies', couples: 'Engagements & couples', family: 'Birthdays & family', commercial: 'Commercial & events' };

  var grid = document.querySelector('[data-grid]');
  if (!grid) return;
  var moreBtn = document.querySelector('[data-more]');
  var note = document.querySelector('[data-results]');
  var empty = document.querySelector('[data-empty]');
  var search = document.querySelector('[data-search]');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));

  // Show how many galleries are in each filter.
  chips.forEach(function (c) {
    var g = c.getAttribute('data-filter');
    var n = g === 'all' ? DATA.length : DATA.filter(function (d) { return d.g === g; }).length;
    var s = document.createElement('span'); s.className = 'count'; s.textContent = n; c.appendChild(s);
  });

  var state = { filter: 'all', q: '', shown: 0, list: DATA };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(d) {
    var a = document.createElement('a');
    a.className = 'work-card';
    a.href = DETAIL_URL.replace('{id}', d.id);
    a.innerHTML = '<img src="assets/img/work/' + d.id + '.webp" alt="' + esc(d.t + ' – ' + d.c) + '" loading="lazy" decoding="async" width="' + d.w + '" height="' + d.h + '">' +
      '<div class="meta"><strong>' + esc(d.t) + '</strong><span>' + esc(d.c) + '</span></div>';
    return a;
  }

  function apply(reset) {
    var q = state.q.trim().toLowerCase();
    state.list = DATA.filter(function (d) {
      return (state.filter === 'all' || d.g === state.filter) &&
        (!q || d.t.toLowerCase().indexOf(q) > -1 || d.c.toLowerCase().indexOf(q) > -1);
    });
    if (reset) { grid.replaceChildren(); state.shown = 0; }
    renderMore();
  }

  function renderMore() {
    var frag = document.createDocumentFragment();
    var next = state.list.slice(state.shown, state.shown + PAGE);
    next.forEach(function (d) { frag.appendChild(card(d)); });
    grid.appendChild(frag);
    state.shown += next.length;
    var total = state.list.length;
    moreBtn.hidden = state.shown >= total;
    moreBtn.textContent = 'Show more galleries (' + (total - state.shown) + ' left)';
    empty.hidden = total > 0;
    note.textContent = total ? 'Showing ' + state.shown + ' of ' + total + ' ' + (state.filter === 'all' ? 'galleries' : LABELS[state.filter].toLowerCase() + ' galleries') + (state.q ? ' matching "' + state.q + '"' : '') + '.' : '';
  }

  function setFilter(g, push) {
    if (!LABELS[g]) g = 'all';
    state.filter = g;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === g)); });
    if (push) history.replaceState(null, '', g === 'all' ? location.pathname + location.search : '#' + g);
    apply(true);
  }

  chips.forEach(function (c) { c.addEventListener('click', function () { setFilter(c.getAttribute('data-filter'), true); }); });
  moreBtn.addEventListener('click', function () {
    var firstNew = state.shown;
    renderMore();
    var el = grid.children[firstNew];
    if (el) el.focus({ preventScroll: true });
  });
  var t;
  search.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = search.value; apply(true); }, 150); });
  document.querySelector('[data-reset]').addEventListener('click', function (e) { e.preventDefault(); search.value = ''; state.q = ''; setFilter('all', true); });
  window.addEventListener('hashchange', function () { setFilter(location.hash.slice(1), false); });

  setFilter(location.hash.slice(1) || 'all', false);
})();
