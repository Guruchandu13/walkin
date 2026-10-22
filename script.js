/**
 * Sivion Global Technologies - Recruitment Landing Page Script
 *
 * Flow:
 * 1. Step 1 (First View):
 *    - Displays ONLY Step 1 (LinkedIn card with "Click Here ↗").
 *    - Step 2 and Step 3 are hidden.
 * 2. Click LinkedIn ("Click Here ↗"):
 *    - If user has LinkedIn app: Launches the mobile app.
 *    - If user DOES NOT have LinkedIn app: Opens on the browser only!
 *    - Switches card to ONLY Step 2.
 * 3. Step 2 (Upon Return / Reload):
 *    - Displays ONLY Step 2 ("Ready to Apply?" with "Continue to Application Form →" button).
 *    - Features subtle transparent letter watermark directly downside of the Apply button.
 * 4. Step 3 (Completion -> LinkedIn Direct Page):
 *    - When candidate clicks "Continue to Application Form →", Google Form opens in a new tab.
 *    - The card transitions to Step 3 and redirects this tab to the official LinkedIn direct page!
 * 5. Reset:
 *    - Triple-tap on Sivion logo or load with ?reset=1 to reset demo to Step 1.
 */
(function () {
  'use strict';

  function init() {
    var STEP_STORAGE_KEY = 'sivion_hiring_active_step';
    var LINKEDIN_COMPANY_SLUG = 'sivionglobaltechnologies';
    var LINKEDIN_WEB_URL = 'https://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/';
    // Android Intent WITH S.browser_fallback_url:
    // If app installed -> launches app. If app NOT installed -> opens on the browser only!
    var LINKEDIN_ANDROID_INTENT = 'intent://www.linkedin.com/company/' + LINKEDIN_COMPANY_SLUG + '/#Intent;package=com.linkedin.android;scheme=https;S.browser_fallback_url=' + encodeURIComponent(LINKEDIN_WEB_URL) + ';end;';
    var APPLICATION_FORM_URL = 'https://forms.gle/3MqJjTt8rDVob79G9';

    var step1 = document.getElementById('step-1');
    var step2 = document.getElementById('step-2');
    var step3 = document.getElementById('step-3');
    var linkedinBtn = document.getElementById('linkedin-btn');
    var applyBtn = document.getElementById('apply-btn');
    var revisitLinkedinLink = document.getElementById('revisit-linkedin-link');
    var finalLinkedinBtn = document.getElementById('final-linkedin-btn');
    var companyLogo = document.querySelector('.company-logo');

    if (!step1 || !step2 || !linkedinBtn) {
      return;
    }

    // Mobile & OS Detection
    var ua = navigator.userAgent || navigator.vendor || window.opera || '';
    var isAndroid = /Android/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // In-memory fallback
    var inMemoryStep = '1';

    /**
     * Configure anchor targets and URLs:
     * - Android: intent:// with S.browser_fallback_url (App if installed, browser only if not)
     * - iOS & Desktop: https:// (App via Universal Link if installed, browser only if not)
     */
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
    linkedinBtn.setAttribute('target', '_blank');
    linkedinBtn.setAttribute('rel', 'noopener noreferrer');
    if (revisitLinkedinLink) {
      revisitLinkedinLink.setAttribute('target', '_blank');
      revisitLinkedinLink.setAttribute('rel', 'noopener noreferrer');
    }

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
    function saveStep(stepNum) {
      inMemoryStep = String(stepNum);
      try {
        window.localStorage.setItem(STEP_STORAGE_KEY, inMemoryStep);
      } catch (e) {}
      try {
        window.sessionStorage.setItem(STEP_STORAGE_KEY, inMemoryStep);
      } catch (e) {}
      try {
        document.cookie = STEP_STORAGE_KEY + '=' + inMemoryStep + '; path=/; max-age=604800; SameSite=Lax';
      } catch (e) {}
    }

    function readStep() {
      if (inMemoryStep && inMemoryStep !== '1') {
        return inMemoryStep;
      }
      try {
        var ls = window.localStorage.getItem(STEP_STORAGE_KEY);
        if (ls) return ls;
      } catch (e) {}
      try {
        var ss = window.sessionStorage.getItem(STEP_STORAGE_KEY);
        if (ss) return ss;
      } catch (e) {}
      try {
        var match = document.cookie && document.cookie.match(new RegExp('(?:^|; )' + STEP_STORAGE_KEY + '=([^;]*)'));
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      } catch (e) {}
      return '1';
    }

    function clearState() {
      inMemoryStep = '1';
      try {
        window.localStorage.removeItem(STEP_STORAGE_KEY);
      } catch (e) {}
      try {
        window.sessionStorage.removeItem(STEP_STORAGE_KEY);
      } catch (e) {}
      try {
        document.cookie = STEP_STORAGE_KEY + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
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
     * Render the active single step
     */
    function renderStep(stepNum, animated) {
      var activePane = step1;
      if (stepNum === '2') {
        activePane = step2;
      } else if (stepNum === '3' && step3) {
        activePane = step3;
      }

      // Hide all panes
      [step1, step2, step3].forEach(function (pane) {
        if (pane) {
          pane.setAttribute('hidden', '');
          pane.classList.remove('is-entering');
        }
      });

      // Show ONLY the active step pane
      activePane.removeAttribute('hidden');

      if (animated && !isReducedMotionPreferred()) {
        void activePane.offsetWidth; // Reflow for clean entrance animation
        activePane.classList.add('is-entering');
      }

      // Accessibility expanded state
      if (stepNum === '1') {
        linkedinBtn.setAttribute('aria-expanded', 'false');
      } else {
        linkedinBtn.setAttribute('aria-expanded', 'true');
      }
    }

    function updateViewState(animated) {
      var currentStep = readStep();
      renderStep(currentStep, animated);
    }

    // Step A: Initial render on page load / reload
    updateViewState(false);

    // Step B: User clicks LinkedIn button on Step 1 ("Click Here ↗")
    function handleLinkedInClick(event) {
      if (event.type === 'auxclick' && event.button !== 1) {
        return;
      }

      // 1. Advance state to Step 2
      saveStep('2');

      // 2. Switch card to display ONLY Step 2
      renderStep('2', true);

      // We do NOT preventDefault:
      // The anchor's target="_blank" natively opens the link:
      // - If mobile has LinkedIn app -> launches the app!
      // - If mobile DOES NOT have LinkedIn app -> opens on the browser only!
      // - On Desktop -> opens on the browser only!
      // And this tab stays 100% intact displaying Step 2 with the Application Form button!
    }

    linkedinBtn.addEventListener('click', handleLinkedInClick);
    linkedinBtn.addEventListener('auxclick', handleLinkedInClick);

    // Revisit LinkedIn button on Step 2
    if (revisitLinkedinLink) {
      revisitLinkedinLink.addEventListener('click', function () {
        // Native target="_blank" opens app if installed, browser only if not
      });
    }

    // Step C: User clicks "Continue to Application Form →" on Step 2
    if (applyBtn) {
      applyBtn.addEventListener('click', function (event) {
        if (event && event.preventDefault) {
          event.preventDefault();
        }

        // 1. Advance state to Step 3 (completion)
        saveStep('3');

        // 2. Open Google Form in a new tab
        window.open(APPLICATION_FORM_URL, '_blank');

        // 3. Switch card to Step 3
        renderStep('3', true);

        // 4. Redirect this tab to the direct LinkedIn page after 1.5 seconds
        setTimeout(function () {
          window.location.href = LINKEDIN_WEB_URL;
        }, 1500);
      });
    }

    // Final LinkedIn button on Step 3
    if (finalLinkedinBtn) {
      finalLinkedinBtn.setAttribute('href', LINKEDIN_WEB_URL);
      finalLinkedinBtn.setAttribute('target', '_blank');
      finalLinkedinBtn.setAttribute('rel', 'noopener noreferrer');
    }

    // Step D: Tab Return / Window Focus ("malli vasthey")
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

    // Step E: Discreet test reset by tapping company logo 3 times
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
          renderStep('1', true);
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
