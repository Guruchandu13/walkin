/**
 * Sivion Global Technologies - Recruitment Landing Page Script
 *
 * Requirements:
 * 1. Previous Format of Steps:
 *    - Main recruitment card with LinkedIn section always visible at the top.
 *    - Downside contains the Application Form section ("Step 2: Apply"), revealed upon click / return / reload.
 * 2. Fallback Behavior:
 *    - If user has the LinkedIn mobile app: Redirects into native app.
 *    - If user DOES NOT have the app: Opens directly on the browser only (no errors, no Play Store redirects).
 * 3. Chrome Intactness:
 *    - Dispatches intent / link with target="_blank" so this recruitment tab is never navigated away or lost.
 * 4. Transparent Watermark:
 *    - SIVION GLOBAL TECHNOLOGIES transparent letter watermark preserved downside of the Apply button.
 * 5. State Persistence & Reload:
 *    - Reloading or returning to the page keeps the LinkedIn card and reveals the Application Form button downside.
 *    - Reset demo by tapping company logo 3 times or loading with ?reset=1.
 */
(function () {
  'use strict';

  function init() {
    var STORAGE_KEY = 'sivion_hiring_linkedin_clicked';
    var LINKEDIN_COMPANY_SLUG = 'sivionglobaltechnologies';
    var LINKEDIN_WEB_URL = 'https://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/';
    // Android Intent WITH S.browser_fallback_url:
    // If LinkedIn app is installed -> launches app.
    // If LinkedIn app is NOT installed -> opens on the browser only!
    var LINKEDIN_ANDROID_INTENT = 'intent://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/#Intent;package=com.linkedin.android;scheme=https;S.browser_fallback_url=' + encodeURIComponent(LINKEDIN_WEB_URL) + ';end;';

    var linkedinBtn = document.getElementById('linkedin-btn');
    var applySection = document.getElementById('apply-section');
    var companyLogo = document.querySelector('.company-logo');

    if (!linkedinBtn || !applySection) {
      return;
    }

    // Mobile & OS Detection
    var ua = navigator.userAgent || navigator.vendor || window.opera || '';
    var isAndroid = /Android/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // In-memory fallback
    var inMemoryClicked = false;

    /**
     * Configure anchor href and target:
     * - Android: intent:// with S.browser_fallback_url (App if installed, browser only if not)
     * - iOS & Desktop: https:// (Universal Link / Web in browser)
     * Target is _blank so the recruitment tab remains undisturbed
     */
    if (isAndroid) {
      linkedinBtn.setAttribute('href', LINKEDIN_ANDROID_INTENT);
    } else {
      linkedinBtn.setAttribute('href', LINKEDIN_WEB_URL);
    }
    linkedinBtn.setAttribute('target', '_blank');
    linkedinBtn.setAttribute('rel', 'noopener noreferrer');

    /**
     * Check URL query parameter: ?reset=1 or ?test=1 to reset demo state
     */
    if (window.location.search.indexOf('reset=1') !== -1 || window.location.search.indexOf('test=1') !== -1) {
      clearState();
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    /**
     * Multi-tier safe state persistence (localStorage, sessionStorage, cookie, memory)
     */
    function saveState() {
      inMemoryClicked = true;
      try {
        window.localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {}
      try {
        window.sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {}
      try {
        document.cookie = STORAGE_KEY + '=true; path=/; max-age=604800; SameSite=Lax';
      } catch (e) {}
    }

    function readState() {
      if (inMemoryClicked) {
        return 'true';
      }
      try {
        var ls = window.localStorage.getItem(STORAGE_KEY);
        if (ls === 'true') return 'true';
      } catch (e) {}
      try {
        var ss = window.sessionStorage.getItem(STORAGE_KEY);
        if (ss === 'true') return 'true';
      } catch (e) {}
      try {
        if (document.cookie && document.cookie.indexOf(STORAGE_KEY + '=true') !== -1) {
          return 'true';
        }
      } catch (e) {}
      return null;
    }

    function clearState() {
      inMemoryClicked = false;
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      try {
        document.cookie = STORAGE_KEY + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      } catch (e) {}
    }

    function isReducedMotionPreferred() {
      try {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (e) {
        return false;
      }
    }

    /**
     * Reveal downside Application Form button
     */
    function showApplySection(animated) {
      linkedinBtn.setAttribute('aria-expanded', 'true');
      applySection.removeAttribute('hidden');
      applySection.style.display = 'block';
      applySection.style.opacity = '1';
      applySection.style.visibility = 'visible';

      if (!animated || isReducedMotionPreferred()) {
        applySection.classList.remove('is-entering');
        return;
      }

      applySection.classList.remove('is-entering');
      void applySection.offsetWidth; // Trigger reflow for clean CSS animation replay
      applySection.classList.add('is-entering');
    }

    /**
     * Hide downside Application Form button (initial state)
     */
    function hideApplySection() {
      linkedinBtn.setAttribute('aria-expanded', 'false');
      applySection.setAttribute('hidden', '');
      applySection.style.display = 'none';
      applySection.style.opacity = '0';
      applySection.style.visibility = 'hidden';
      applySection.classList.remove('is-entering');
    }

    /**
     * Check stored state and show/hide the downside application button
     */
    function updateViewState(animated) {
      if (readState() === 'true') {
        showApplySection(animated);
      } else {
        hideApplySection();
      }
    }

    // Step A: Initial render on page load / reload
    updateViewState(false);

    // Step B: User clicks the LinkedIn button
    function handleLinkedInClick(event) {
      if (event.type === 'auxclick' && event.button !== 1) {
        return;
      }

      // 1. Immediately persist state
      saveState();

      // 2. Immediately reveal the application button downside right on THIS tab
      showApplySection(true);

      // 3. Native anchor behavior will dispatch target="_blank" to launch app or browser tab
      // leaving this recruitment tab active and undisturbed
    }

    linkedinBtn.addEventListener('click', handleLinkedInClick);
    linkedinBtn.addEventListener('auxclick', handleLinkedInClick);

    // Step C: "Malli vasthey" / Tab Return / Window Focus
    // When switching back from the LinkedIn mobile app to Chrome,
    // these events ensure the Application Form button is actively displayed downside
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        updateViewState(false);
      }
    });

    window.addEventListener('focus', function () {
      updateViewState(false);
    });

    window.addEventListener('pageshow', function () {
      updateViewState(false);
    });

    // Step D: Discreet test reset by tapping company logo 3 times
    if (companyLogo) {
      var logoTaps = 0;
      var logoTapTimer = null;
      companyLogo.addEventListener('click', function () {
        logoTaps++;
        clearTimeout(logoTapTimer);
        logoTapTimer = setTimeout(function () {
          logoTaps = 0;
        }, 1200);

        if (logoTaps >= 3) {
          logoTaps = 0;
          clearState();
          hideApplySection();
        }
      });
    }
  }

  // DOMContentLoaded-safe initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
