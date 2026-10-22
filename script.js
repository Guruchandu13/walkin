/**
 * Sivion Global Technologies - Recruitment Landing Page Script
 * Flow:
 * 1. Initial Scan: Displays ONLY Step 1 (LinkedIn card).
 * 2. Click LinkedIn:
 *    - On Mobile: Directly redirects/opens the native LinkedIn app if installed,
 *      or falls back cleanly to the company page.
 *    - On Desktop: Opens LinkedIn in a new tab.
 * 3. Return to Tab ("Malli vasthey"):
 *    - Immediately displays Step 2 ("Ready to Apply?" with Application Form button).
 */
(function () {
  'use strict';

  function init() {
    var STORAGE_KEY = 'sivion_hiring_linkedin_clicked';
    var LINKEDIN_COMPANY_SLUG = 'sivionglobaltechnologies';
    var LINKEDIN_WEB_URL = 'https://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/';
    var LINKEDIN_ANDROID_INTENT = 'intent://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/#Intent;package=com.linkedin.android;scheme=https;S.browser_fallback_url=' + encodeURIComponent(LINKEDIN_WEB_URL) + ';end;';

    var stepLinkedin = document.getElementById('step-linkedin');
    var stepApply = document.getElementById('step-apply');
    var linkedinBtn = document.getElementById('linkedin-btn');
    var revisitLinkedinLink = document.getElementById('revisit-linkedin-link');
    var resetFlowBtn = document.getElementById('reset-flow-btn');

    if (!stepLinkedin || !stepApply || !linkedinBtn) {
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
     * Multi-layer safe storage wrappers (localStorage, sessionStorage, cookie, memory)
     * Guarantees persistence even in restricted in-app mobile webviews (WhatsApp, Instagram, Safari Private)
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
     * Show ONLY the Application Form View (Step 2)
     * Synchronous DOM update ensures it is immediately ready before app switch
     */
    function showApplyView(animated) {
      linkedinBtn.setAttribute('aria-expanded', 'true');

      // Reset inline styles from any previous transitions
      stepLinkedin.style.opacity = '';
      stepLinkedin.style.transform = '';
      stepLinkedin.style.transition = '';

      if (!animated || isReducedMotionPreferred()) {
        stepLinkedin.setAttribute('hidden', '');
        stepApply.removeAttribute('hidden');
        stepApply.classList.remove('is-entering');
        return;
      }

      // If already on apply step, do not repeat
      if (stepLinkedin.hasAttribute('hidden') && !stepApply.hasAttribute('hidden')) {
        return;
      }

      // Immediate DOM switch with CSS entrance animation
      stepLinkedin.setAttribute('hidden', '');
      stepApply.removeAttribute('hidden');
      stepApply.classList.remove('is-entering');
      // Trigger reflow for clean CSS animation replay
      void stepApply.offsetWidth;
      stepApply.classList.add('is-entering');
    }

    /**
     * Show ONLY the LinkedIn View (Step 1)
     */
    function showLinkedinView() {
      linkedinBtn.setAttribute('aria-expanded', 'false');
      stepApply.setAttribute('hidden', '');
      stepLinkedin.removeAttribute('hidden');
      stepLinkedin.style.opacity = '';
      stepLinkedin.style.transform = '';
      stepApply.classList.remove('is-entering');
    }

    /**
     * Check stored state and show the appropriate single step
     */
    function updateViewState(animated) {
      if (readState() === 'true') {
        showApplyView(animated);
      } else {
        showLinkedinView();
      }
    }

    /**
     * Configure Mobile vs Desktop Link Behavior:
     * - On mobile: Remove target="_blank" so iOS Universal Links and Android App Links
     *   can hand off directly to the native LinkedIn app.
     * - On desktop: Keep target="_blank" to open in a new tab.
     */
    if (isMobile) {
      linkedinBtn.removeAttribute('target');
      linkedinBtn.removeAttribute('rel');
      if (revisitLinkedinLink) {
        revisitLinkedinLink.removeAttribute('target');
        revisitLinkedinLink.removeAttribute('rel');
      }

      if (isAndroid) {
        linkedinBtn.setAttribute('href', LINKEDIN_ANDROID_INTENT);
        if (revisitLinkedinLink) {
          revisitLinkedinLink.setAttribute('href', LINKEDIN_ANDROID_INTENT);
        }
      } else {
        linkedinBtn.setAttribute('href', LINKEDIN_WEB_URL);
        if (revisitLinkedinLink) {
          revisitLinkedinLink.setAttribute('href', LINKEDIN_WEB_URL);
        }
      }
    } else {
      linkedinBtn.setAttribute('href', LINKEDIN_WEB_URL);
      if (revisitLinkedinLink) {
        revisitLinkedinLink.setAttribute('href', LINKEDIN_WEB_URL);
      }
    }

    // Step A: Initial render on page load
    updateViewState(false);

    // Step B: User clicks the LinkedIn button
    function handleLinkedInClick(event) {
      if (event.type === 'auxclick' && event.button !== 1) {
        return;
      }

      // 1. Record state synchronously
      saveState();

      // 2. Synchronously switch this browser tab to Step 2 (Application Form)
      // Done synchronously BEFORE app redirection so the tab is ALREADY showing
      // the Application Form button the instant the user returns to this tab!
      showApplyView(false);

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

    if (revisitLinkedinLink && isAndroid) {
      revisitLinkedinLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = LINKEDIN_ANDROID_INTENT;
      });
    }

    // Step C: "Malli vasthey" - Detect when candidate returns from LinkedIn app/tab
    // When switching back from the LinkedIn mobile app to the browser tab,
    // these events trigger immediately to ensure Step 2 is active.
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

    // Step D: Reset button for easy testing
    if (resetFlowBtn) {
      resetFlowBtn.addEventListener('click', function () {
        clearState();
        showLinkedinView();
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
