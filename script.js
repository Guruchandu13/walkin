/**
 * Sivion Global Technologies - Recruitment Landing Page Script
 * Flow:
 * 1. Initial Scan: Displays ONLY the LinkedIn card.
 * 2. Click LinkedIn: Opens LinkedIn in a new tab.
 * 3. Return ("Malli vasthey"): Displays ONLY the Application Form.
 */
(function () {
  'use strict';

  function init() {
    var STORAGE_KEY = 'sivion_hiring_linkedin_clicked';
    var stepLinkedin = document.getElementById('step-linkedin');
    var stepApply = document.getElementById('step-apply');
    var linkedinBtn = document.getElementById('linkedin-btn');
    var resetFlowBtn = document.getElementById('reset-flow-btn');

    if (!stepLinkedin || !stepApply || !linkedinBtn) {
      return;
    }

    /**
     * Check URL query parameter: ?reset=1 or ?test=1 to reset demo state
     */
    if (window.location.search.indexOf('reset=1') !== -1 || window.location.search.indexOf('test=1') !== -1) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {}
    }

    /**
     * Safe localStorage wrappers
     */
    function saveState() {
      try {
        window.localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {}
    }

    function readState() {
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        return null;
      }
    }

    function clearState() {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
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
     */
    function showApplyView(animated) {
      linkedinBtn.setAttribute('aria-expanded', 'true');

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

      // Fade out LinkedIn view and slide in Application view
      stepLinkedin.style.opacity = '0';
      stepLinkedin.style.transform = 'translateY(-6px)';
      stepLinkedin.style.transition = 'opacity 180ms ease, transform 180ms ease';

      setTimeout(function () {
        stepLinkedin.setAttribute('hidden', '');
        stepLinkedin.style.opacity = '';
        stepLinkedin.style.transform = '';
        stepLinkedin.style.transition = '';

        stepApply.removeAttribute('hidden');
        stepApply.classList.add('is-entering');
      }, 180);
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

    // Step A: Initial render on page load
    updateViewState(false);

    // Step B: User clicks the LinkedIn button
    function handleLinkedInClick(event) {
      if (event.type === 'auxclick' && event.button !== 1) {
        return;
      }

      // Record that user opened LinkedIn
      saveState();

      // Switch to Application view immediately so when they return ("malli vasthey"),
      // the Application Form is ready and waiting for them
      showApplyView(true);
    }

    linkedinBtn.addEventListener('click', handleLinkedInClick);
    linkedinBtn.addEventListener('auxclick', handleLinkedInClick);

    // Step C: "Malli vasthey" - Detect when user returns from LinkedIn tab/window
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
