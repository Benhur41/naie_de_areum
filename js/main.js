/* NAIL DE AREUM — main.js
   필요한 최소 동작만 담당합니다. 핵심 콘텐츠는 모두 index.html에 있으며 JS 없이도 읽을 수 있습니다.
   1) 모바일 메뉴 토글  2) 헤더 스크롤 상태  3) 포트폴리오 필터  4) 사진 확대 보기(<dialog>) */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

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
    onScroll();
  }

  /* 3) Portfolio filter */
  var filters = document.querySelectorAll('.filter');
  var items = document.querySelectorAll('.gallery > li');
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
    });
  });

  /* 4) Lightbox */
  var dialog = document.querySelector('.lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    var dImg = dialog.querySelector('.lightbox-img');
    var dCap = dialog.querySelector('.lightbox-caption');
    var lastTrigger = null;

    document.querySelectorAll('.gallery-open').forEach(function (btn) {
      var thumb = btn.querySelector('img');
      btn.setAttribute('aria-label', '크게 보기: ' + thumb.alt);
      btn.addEventListener('click', function () {
        lastTrigger = btn;
        dImg.src = btn.dataset.full || thumb.currentSrc || thumb.src;
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

  /* Footer year */
  var year = document.querySelector('.copyright span');
  if (year) year.textContent = new Date().getFullYear();
})();
