/**
 * Sivion Global Technologies - Recruitment Landing Page Script
 *
 * Flow:
 * 1. Initial Scan:
 *    - Displays the LinkedIn Recruitment card with the LinkedIn button ("Click Here ↗").
 *    - The downside application button is hidden.
 * 2. Click LinkedIn:
 *    - On Mobile: Launches the native LinkedIn app directly (via Android Intents / iOS Universal Links),
 *      or falls back cleanly to the company web page.
 *    - On Desktop: Opens LinkedIn in a new tab.
 *    - Immediately reveals the downside Application Form button ("Continue to Application Form →").
 * 3. Page Reload / Tab Return ("once we reload the page again" / "malli vasthey"):
 *    - Retains the LinkedIn card view at the top.
 *    - Downside (replacing the old reset place), displays the "Continue to Application Form →" button.
 */
(function () {
  'use strict';

  function init() {
    var STORAGE_KEY = 'sivion_hiring_linkedin_clicked';
    var LINKEDIN_COMPANY_SLUG = 'sivionglobaltechnologies';
    var LINKEDIN_WEB_URL = 'https://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/';
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
    var isMobile = isAndroid || isIOS || /Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    // In-memory fallback
    var inMemoryClicked = false;

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
     * Multi-tier state persistence across localStorage, sessionStorage, cookie, and memory
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

      if (!animated || isReducedMotionPreferred()) {
        applySection.removeAttribute('hidden');
        applySection.classList.remove('is-entering');
        return;
      }

      if (!applySection.hasAttribute('hidden')) {
        return;
      }

      applySection.removeAttribute('hidden');
      applySection.classList.remove('is-entering');
      void applySection.offsetWidth; // Trigger reflow for clean animation
      applySection.classList.add('is-entering');
    }

    /**
     * Hide downside Application Form button (initial state)
     */
    function hideApplySection() {
      linkedinBtn.setAttribute('aria-expanded', 'false');
      applySection.setAttribute('hidden', '');
      applySection.classList.remove('is-entering');
    }

    /**
     * Check stored state:
     * - Once clicked or on reload after clicking: LinkedIn page is displayed,
     *   and downside reveals the Application Form button.
     * - Initial scan: LinkedIn page is displayed; downside application button is hidden.
     */
    function updateViewState(animated) {
      if (readState() === 'true') {
        showApplySection(animated);
      } else {
        hideApplySection();
      }
    }

    /**
     * Mobile vs Desktop Link Behavior:
     * - On mobile: Remove target="_blank" so iOS Universal Links and Android App Links
     *   can hand off directly to the native LinkedIn app.
     * - On desktop: Keep target="_blank" to open in a new tab.
     */
    if (isMobile) {
      linkedinBtn.removeAttribute('target');
      linkedinBtn.removeAttribute('rel');

      if (isAndroid) {
        linkedinBtn.setAttribute('href', LINKEDIN_ANDROID_INTENT);
      } else {
        linkedinBtn.setAttribute('href', LINKEDIN_WEB_URL);
      }
    } else {
      linkedinBtn.setAttribute('href', LINKEDIN_WEB_URL);
    }

    // Step A: Initial render on page load / reload
    updateViewState(false);

    // Step B: User clicks the LinkedIn button
    function handleLinkedInClick(event) {
      if (event.type === 'auxclick' && event.button !== 1) {
        return;
      }

      // 1. Record state synchronously
      saveState();

      // 2. Reveal downside Application Form button immediately
      showApplySection(true);

      // 3. Android Intent Redirection (Direct to App or Browser Fallback)
      if (isAndroid) {
        if (event && event.preventDefault) {
          event.preventDefault();
        }
        window.location.href = LINKEDIN_ANDROID_INTENT;
      }
      // On iOS: Native link navigation to LINKEDIN_WEB_URL without target="_blank"
      // triggers iOS Universal Links to open the LinkedIn App directly if installed.
      // On Desktop: Native link opens in target="_blank".
    }

    linkedinBtn.addEventListener('click', handleLinkedInClick);
    linkedinBtn.addEventListener('auxclick', handleLinkedInClick);

    // Step C: "Malli vasthey" / Tab return / Visibility change
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
