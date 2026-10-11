/* NAIL DE AREUM — main.js
   필요한 최소 동작만 담당합니다. 핵심 콘텐츠는 모두 index.html에 있으며 JS 없이도 읽을 수 있습니다.
   1) 모바일 메뉴 토글  2) 헤더 스크롤 상태  3) 포트폴리오 필터 · 더 보기
   4) 사진 확대 보기(<dialog>)  5) 이달의 아트 연도·월 선택
   처음 보이는 상태(앞 12장, 최신 달)는 HTML의 is-collapsed / is-active 클래스 + CSS로 정해져 있어 JS 실행 전에도 레이아웃이 흔들리지 않습니다. */
(function () {
  'use strict';

  /* 1) Mobile nav */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open ? '메뉴 닫기' : '메뉴 열기';
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* 2) Header border on scroll */
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    // 첫 측정은 다음 프레임으로 미뤄 페이지 로드 중 강제 레이아웃 계산(forced reflow)을 피한다
    requestAnimationFrame(onScroll);
  }

  /* 3) Portfolio filter + 더 보기 */
  var gallery = document.querySelector('.gallery');
  var galleryToggle = document.querySelector('.gallery-toggle');
  var galleryToggleWrap = document.querySelector('.gallery-toggle-wrap');
  var filters = document.querySelectorAll('.filter');
  var items = document.querySelectorAll('.gallery > li');
  var galleryExpanded = false;

  function syncGalleryCollapse(filterKey) {
    if (!gallery) return;
    // 분류 필터를 고르면 해당 사진을 모두 보여주고, All 로 돌아오면 접힌 상태를 되살린다
    var collapse = filterKey === 'all' && !galleryExpanded;
    gallery.classList.toggle('is-collapsed', collapse);
    if (galleryToggleWrap) galleryToggleWrap.hidden = !collapse;
  }

  if (galleryToggle) {
    galleryToggle.addEventListener('click', function () {
      galleryExpanded = true;
      galleryToggle.setAttribute('aria-expanded', 'true');
      syncGalleryCollapse('all');
      // 새로 보이는 첫 사진으로 포커스 이동 (키보드 사용자)
      var next = gallery.querySelector('li:nth-child(13) .gallery-open');
      if (next) next.focus({ preventScroll: true });
    });
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.filter;
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      items.forEach(function (li) {
        var cats = (li.dataset.category || '').split(/\s+/);
        li.hidden = key !== 'all' && cats.indexOf(key) === -1;
      });
      syncGalleryCollapse(key);
    });
  });

  /* 4) Lightbox — 갤러리 링크는 JS 없이도 원본 이미지로 이동하고, JS가 있으면 <dialog>로 띄운다 */
  var dialog = document.querySelector('.lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    var dCap = dialog.querySelector('.lightbox-caption');
    var dImg = document.createElement('img');
    dImg.className = 'lightbox-img';
    dImg.alt = '';
    dialog.insertBefore(dImg, dCap);
    var lastTrigger = null;

    document.querySelectorAll('.gallery-open').forEach(function (btn) {
      var thumb = btn.querySelector('img');
      btn.setAttribute('aria-label', '크게 보기: ' + thumb.alt);
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        lastTrigger = btn;
        dImg.src = btn.getAttribute('href');
        dImg.alt = thumb.alt;
        var cap = btn.closest('figure').querySelector('figcaption');
        dCap.textContent = cap ? cap.innerText.trim().replace(/\s*\n\s*/g, ' · ') : '';
        dialog.showModal();
      });
    });

    dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () {
      dImg.removeAttribute('src');
      if (lastTrigger) lastTrigger.focus();
    });
  }

  /* 5) 이달의 아트 — 연도 버튼 → 월 링크 → 해당 달만 표시. 링크는 JS 없이도 #art-YYYY-MM 으로 이동 */
  var archive = document.querySelector('.archive-nav');
  if (archive) {
    var yearBtns = archive.querySelectorAll('.archive-year');
    var groups = archive.querySelectorAll('.archive-month-group');
    var monthLinks = archive.querySelectorAll('.archive-months a');
    var months = document.querySelectorAll('.art-month');
    var label = document.querySelector('.monthly-month');

    var showMonth = function (id, updateHash) {
      var target = document.getElementById('art-' + id);
      if (!target) return false;
      var y = id.slice(0, 4);
      yearBtns.forEach(function (b) {
        var on = b.dataset.year === y;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      groups.forEach(function (g) { g.classList.toggle('is-active', g.dataset.year === y); });
      monthLinks.forEach(function (a) {
        var on = a.dataset.month === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      months.forEach(function (m) { m.classList.toggle('is-active', m === target); });
      if (label) {
        label.querySelector('.m-en').textContent = target.dataset.labelEn;
        label.querySelector('.m-num').textContent = y + ' · ' + id.slice(5);
      }
      if (updateHash && history.replaceState) history.replaceState(null, '', '#art-' + id);
      return true;
    };

    monthLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        showMonth(a.dataset.month, true);
      });
    });

    yearBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        // 연도를 고르면 그 해의 가장 최근 달을 보여준다
        var links = archive.querySelectorAll('.archive-month-group[data-year="' + b.dataset.year + '"] a');
        if (links.length) showMonth(links[links.length - 1].dataset.month, true);
      });
    });

    // #art-2025-07 같은 주소로 들어오면 그 달을 열고 이동
    var m = /^#art-(\d{4}-\d{2})$/.exec(location.hash);
    if (m && showMonth(m[1], false)) {
      document.getElementById('monthly').scrollIntoView();
    }
  }

  /* Footer year */
  var year = document.querySelector('.copyright span');
  if (year) year.textContent = new Date().getFullYear();
})();
