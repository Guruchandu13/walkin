/**
 * Sivion Global Technologies - Recruitment Landing Page Script
 *
 * Requirements:
 * 1. Initial State: Displays the LinkedIn Recruitment card with "Click Here ↗".
 *    Downside application section is hidden.
 * 2. Click LinkedIn:
 *    - Immediately displays the Application Form button downside on THIS tab.
 *    - On Mobile with LinkedIn app: Launches the LinkedIn app WITHOUT navigating the Chrome tab away.
 *    - When the candidate switches back from the LinkedIn app to Chrome ("malli aa chrome chusinappudu"):
 *      The Chrome tab remains directly on this recruitment page, showing the Application Form button.
 *    - If LinkedIn opens in Chrome ("chrome lo linkedin open aythy em problem ledu"):
 *      It opens in a new tab without overwriting this recruitment tab.
 * 3. Page Reload: Retains the LinkedIn card view and keeps the Application Form button active downside.
 */
(function () {
  'use strict';

  function init() {
    var STORAGE_KEY = 'sivion_hiring_linkedin_clicked';
    var LINKEDIN_COMPANY_SLUG = 'sivionglobaltechnologies';
    var LINKEDIN_WEB_URL = 'https://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/';
    // Android Intent WITHOUT S.browser_fallback_url so Chrome does NOT navigate the active tab!
    var LINKEDIN_ANDROID_INTENT = 'intent://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/#Intent;package=com.linkedin.android;scheme=https;end;';
    var LINKEDIN_APP_SCHEME = 'linkedin://company/' + LINKEDIN_COMPANY_SLUG;

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
     * Explicitly sets visibility & display so no interrupted animation can hide it
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

      // 2. Immediately reveal the application button right on THIS tab
      showApplySection(false);

      // 3. Prevent default link navigation so THIS Chrome tab is NEVER navigated away
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      var clickTime = Date.now();

      if (isAndroid) {
        // Launch LinkedIn app via Android Intent (without fallback URL, so this tab NEVER loads LinkedIn web)
        window.location.href = LINKEDIN_ANDROID_INTENT;

        // If the LinkedIn app is not installed, the browser remains visible;
        // fallback to opening LinkedIn web in a NEW tab after 1200ms
        setTimeout(function () {
          if (!document.hidden && (Date.now() - clickTime < 2500)) {
            window.open(LINKEDIN_WEB_URL, '_blank');
          }
        }, 1200);

      } else if (isIOS) {
        // Attempt to open the native LinkedIn iOS app
        window.location.href = LINKEDIN_APP_SCHEME;

        // Fallback to opening in a new tab if app not installed
        setTimeout(function () {
          if (!document.hidden && (Date.now() - clickTime < 2500)) {
            window.open(LINKEDIN_WEB_URL, '_blank');
          }
        }, 1200);

      } else {
        // Desktop: open LinkedIn in a new tab
        window.open(LINKEDIN_WEB_URL, '_blank');
      }
    }

    // Listen on click and touchstart for instant response
    linkedinBtn.addEventListener('click', handleLinkedInClick);
    linkedinBtn.addEventListener('auxclick', handleLinkedInClick);

    // Step C: "Malli vasthey" / Tab Return / Window Focus
    // When switching back from the LinkedIn mobile app to Chrome,
    // these events ensure the Application Form button is actively displayed
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
