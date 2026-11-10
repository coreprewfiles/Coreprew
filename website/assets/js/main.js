/* Coreprew Films — site behaviour. No dependencies. */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '61493843768';
  var EMAIL = 'coreprewfilms@gmail.com';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: solid after scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menu = document.getElementById('mobile-menu');
  var openBtn = document.querySelector('.site-header .menu-toggle');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var first = menu.querySelector('nav a'); if (first) first.focus(); }
    else openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  document.querySelectorAll('[data-close-menu]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
  if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false); });

  /* ---------- Current page in nav ---------- */
  var page = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav [data-nav]').forEach(function (a) {
    if (a.getAttribute('data-nav') === page) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Hero crossfade (loads extra photos only after the page is ready) ---------- */
  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('img'));
    var dotsWrap = document.querySelector('[data-hero-dots]');
    var current = 0, timer = null;
    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show photo ' + (i + 1));
      b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { show(i); restart(); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });
    function show(i) {
      var img = slides[i];
      if (img.dataset.srcset && !img.srcset) img.srcset = img.dataset.srcset;
      slides[current].classList.remove('active');
      dots[current].setAttribute('aria-current', 'false');
      current = i;
      var activate = function () { img.classList.add('active'); };
      if (img.complete && img.naturalWidth) activate(); else img.addEventListener('load', activate, { once: true });
      dots[current].setAttribute('aria-current', 'true');
    }
    function restart() {
      if (reduceMotion || slides.length < 2) return;
      clearInterval(timer);
      timer = setInterval(function () { show((current + 1) % slides.length); }, 6500);
    }
    window.addEventListener('load', function () {
      // Preload the other slides once the first view is done, so they don't slow the first paint.
      setTimeout(function () {
        slides.forEach(function (img) { if (img.dataset.srcset && !img.srcset) img.srcset = img.dataset.srcset; });
        restart();
      }, 1200);
    });
  }

  /* ---------- Tabs (packages) ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        var next = tabs[(i + n + tabs.length) % tabs.length];
        select(next); next.focus();
      });
    });
  });
  document.querySelectorAll('[data-open-tab]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = document.getElementById(a.getAttribute('data-open-tab'));
      if (t) t.click();
    });
  });

  /* ---------- YouTube: load the player only when clicked ---------- */
  document.querySelectorAll('[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-yt');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      btn.replaceChildren(f);
      btn.removeAttribute('aria-label');
    }, { once: true });
  });

  /* ---------- Maps: load only when asked (saves ~1 MB per page) ---------- */
  document.querySelectorAll('[data-map]').forEach(function (box) {
    var btn = box.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-map');
      f.title = 'Map';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.replaceChildren(f);
    }, { once: true });
  });

  /* ---------- Booking form ---------- */
  var form = document.getElementById('booking-form');
  if (form) {
    var dateInput = form.querySelector('[name="date"]');
    if (dateInput) {
      var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
      dateInput.min = t.toISOString().slice(0, 10);
    }

    // Pre-fill from links like contact-us.html?package=Gold…#book or ?event=Drone
    var params = new URLSearchParams(location.search);
    ['package', 'event'].forEach(function (key) {
      var v = params.get(key), sel = form.querySelector('[name="' + key + '"]');
      if (!v || !sel) return;
      var match = Array.prototype.find.call(sel.options, function (o) { return o.value === v || o.text === v || o.text.indexOf(v) === 0; });
      if (match) sel.value = match.value || match.text;
    });

    function formatDate(iso) {
      if (!iso) return '';
      var d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
    }

    function buildMessage(data) {
      var lines = ['Hi Coreprew Films! I\'d like to check availability.', ''];
      var rows = [
        ['Name', data.get('name')],
        ['Phone', data.get('phone')],
        ['Event', data.get('event')],
        ['Date', formatDate(data.get('date'))],
        ['Service', data.get('service')],
        ['Location', data.get('location')],
        ['Package', data.get('package')],
        ['Notes', data.get('message')]
      ];
      rows.forEach(function (r) { if (r[1]) lines.push(r[0] + ': ' + r[1]); });
      return lines.join('\n');
    }

    var status = form.querySelector('.form-status');
    function say(html) { status.innerHTML = html; status.classList.add('show'); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        var bad = form.querySelector(':invalid'); if (bad) bad.focus();
        return;
      }
      var data = new FormData(form);
      var via = (e.submitter && e.submitter.value) || 'whatsapp';
      var msg = buildMessage(data);

      // Optional: post to your own backend instead (set data-endpoint on the <form>).
      var endpoint = form.getAttribute('data-endpoint');
      if (endpoint) {
        fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); say('<strong>Thanks!</strong> Your enquiry has been sent. We\'ll be in touch soon.'); })
          .catch(function () { say('Sorry, that didn\'t send. Please <a href="https://wa.me/' + WHATSAPP_NUMBER + '">WhatsApp us</a> or call 0493 843 768.'); });
        return;
      }

      if (via === 'email') {
        var subject = 'Booking enquiry: ' + (data.get('event') || 'shoot') + ' on ' + formatDate(data.get('date'));
        location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg);
        say('Your email app should open with your details filled in. Just press <strong>Send</strong>. Nothing opened? Email us at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.');
      } else {
        var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
        var w = window.open(url, '_blank', 'noopener');
        if (!w) location.href = url;
        say('WhatsApp is opening with your details filled in. Just press <strong>Send</strong>. No WhatsApp? Call <a href="tel:+61493843768">0493 843 768</a> or use <em>Email instead</em>.');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hide the floating WhatsApp button when it would cover the form or footer ---------- */
  var floatWa = document.querySelector('.float-wa');
  var blockers = document.querySelectorAll('#book, .site-footer');
  if (floatWa && blockers.length && 'IntersectionObserver' in window) {
    var visible = new Set();
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      floatWa.classList.toggle('away', visible.size > 0);
    }, { threshold: 0.15 });
    blockers.forEach(function (el) { fio.observe(el); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
