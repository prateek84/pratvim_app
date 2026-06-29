/**
 * scroll-effects.js — Pratvim scroll fade-out animation
 *
 * Behaviour (mirrors codepen.io/nickcil/pen/RwRwXXN):
 *   As an element scrolls past the top of its scrollable container,
 *   its opacity decreases proportionally and it drifts slightly upward.
 *   When the element is fully in view → opacity 1, no offset.
 *   When the element has scrolled fully out of view → opacity 0.
 *
 * Usage:
 *   Automatically applied on DOMContentLoaded to:
 *   - The chat hero section (.chat-feature-summary) as messages scroll in
 *   - The first heading / panel on every inner app-screen
 *
 * The module exports `PratvimScroll` on `window` so app.js can call
 *   PratvimScroll.attach(scrollEl, targetEl) for dynamic screens.
 */

(function (global) {
  'use strict';

  // ── Core fade calculation ─────────────────────────────────
  /**
   * Returns opacity and translateY values based on how far
   * `targetEl` has scrolled past the top of `containerEl`.
   *
   * When elemTop >= 0 (element fully below container top): opacity 1
   * When elemTop < 0 (element scrolling out the top):
   *   opacity = 1 - (|elemTop| / fadeHeight)
   *   translateY drifts up slightly (parallax feel)
   */
  function calcFade(containerEl, targetEl) {
    var containerRect = containerEl.getBoundingClientRect();
    var elemRect      = targetEl.getBoundingClientRect();
    var elemTop       = elemRect.top - containerRect.top;
    var fadeHeight    = elemRect.height || 1;

    if (elemTop >= 0) {
      return { opacity: 1, translateY: 0 };
    }

    var ratio      = Math.abs(elemTop) / fadeHeight;
    var opacity    = Math.max(0, 1 - ratio);
    // Subtle upward drift: element moves up 20% of the distance scrolled
    var translateY = Math.max(-fadeHeight * 0.2, elemTop * 0.2);

    return { opacity: opacity, translateY: translateY };
  }

  // ── Apply styles ─────────────────────────────────────────
  function applyFade(targetEl, values) {
    targetEl.style.opacity   = values.opacity;
    targetEl.style.transform = 'translateY(' + values.translateY + 'px)';
    // Pointer-events off when invisible so hidden elements can't intercept taps
    targetEl.style.pointerEvents = values.opacity < 0.05 ? 'none' : '';
  }

  // ── Attach scroll listener ───────────────────────────────
  /**
   * Watches `containerEl` scroll and fades `targetEl` accordingly.
   * Returns a detach function.
   */
  function attach(containerEl, targetEl) {
    if (!containerEl || !targetEl) return function () {};

    // Use will-change for smoother compositing
    targetEl.style.willChange = 'opacity, transform';
    // Ensure transitions don't fight with scroll-driven changes
    targetEl.style.transition = 'none';

    function onScroll() {
      applyFade(targetEl, calcFade(containerEl, targetEl));
    }

    // Run once immediately to set initial state
    onScroll();

    containerEl.addEventListener('scroll', onScroll, { passive: true });

    return function detach() {
      containerEl.removeEventListener('scroll', onScroll);
      targetEl.style.willChange = '';
    };
  }

  // ── Auto-wire all app screens ────────────────────────────
  function wireAllScreens() {
    // 1. Chat hero — fades as messages scroll in
    var chatScreen = document.querySelector('.screen-chat');
    var chatHero   = document.querySelector('.chat-feature-summary');
    var msgPane    = document.getElementById('messageArea');

    if (chatScreen && chatHero && msgPane) {
      // The message pane's parent scrolls; the hero sits above it
      var chatScrollEl = chatHero.closest('.screen-chat') || chatScreen;
      attach(chatScrollEl, chatHero);
    }

    // 2. First significant heading on every inner screen
    var screens = document.querySelectorAll('.app-screen:not(.screen-splash):not(.screen-chat)');
    screens.forEach(function (screen) {
      // Priority: h1, then panel h2, then any h2, then p.step-label
      var target =
        screen.querySelector('h1') ||
        screen.querySelector('.register-panel h2, .login-panel h2, .onboarding-card h2, .welcome-panel h2') ||
        screen.querySelector('h2') ||
        screen.querySelector('.step-label');

      if (target) {
        attach(screen, target);
      }
    });
  }

  // ── Re-wire when a screen becomes active ─────────────────
  // Watches for data-view changes or .is-active class additions
  function observeScreenChanges() {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          var el = mutation.target;
          if (el.classList.contains('app-screen') && el.classList.contains('is-active')) {
            var target =
              el.querySelector('h1') ||
              el.querySelector('.register-panel h2, .login-panel h2, .onboarding-card h2, .welcome-panel h2') ||
              el.querySelector('h2');
            if (target) {
              attach(el, target);
            }
          }
        }
      });
    });

    document.querySelectorAll('.app-screen').forEach(function (screen) {
      observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
    });
  }

  // ── Public API ───────────────────────────────────────────
  var PratvimScroll = {
    attach: attach,
    wireAllScreens: wireAllScreens
  };

  // ── Boot ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wireAllScreens();
      observeScreenChanges();
    });
  } else {
    // DOM already ready (script loaded after parse)
    wireAllScreens();
    observeScreenChanges();
  }

  global.PratvimScroll = PratvimScroll;

}(typeof window !== 'undefined' ? window : this));
