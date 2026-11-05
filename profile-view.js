// Reading modes share one visible main landmark and one generated profile source.
function initProfileView({ document, window, history, navigator }) {
  const toggle = document.getElementById('agentViewToggle');
  const human = document.getElementById('human-profile');
  const agent = document.getElementById('agent-profile');
  const copy = document.getElementById('copyAgentProfile');
  const status = document.getElementById('agentCopyStatus');
  if (!toggle || !human || !agent) return;
  const title = document.title;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setMode(mode, updateUrl = true) {
    const isAgent = mode === 'agent';
    human.hidden = isAgent;
    agent.hidden = !isAgent;
    document.body.classList.toggle('agent-mode', isAgent);
    toggle.setAttribute('aria-checked', String(isAgent));
    toggle.setAttribute('aria-label', isAgent ? 'Switch to the people view' : 'Switch to the AI agent view');
    document.title = isAgent ? 'Marco Rohns — AI Agent Profile' : title;
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (isAgent) {
        url.searchParams.set('view', 'agent');
        // A human-section fragment must not point into the hidden view.
        url.hash = 'agent-profile';
      } else {
        url.searchParams.delete('view');
        if (url.hash === '#agent-profile') url.hash = 'main';
      }
      history.replaceState({}, '', url);
    }
  }

  function syncFromUrl() {
    const url = new URL(window.location.href);
    const target = document.getElementById(decodeHash(url.hash));
    const humanTarget = target && human.contains(target);
    const mode = humanTarget ? 'human' : (url.searchParams.get('view') === 'agent' || target === agent ? 'agent' : 'human');
    setMode(mode, Boolean(humanTarget && url.searchParams.get('view') === 'agent'));
  }

  toggle.addEventListener('click', () => {
    const mode = toggle.getAttribute('aria-checked') === 'true' ? 'human' : 'agent';
    setMode(mode);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  // Capture before the browser follows a fragment into a hidden panel.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.getAttribute('href'), window.location.href);
    const current = new URL(window.location.href);
    if (url.origin !== current.origin || url.pathname !== current.pathname) return;
    const target = document.getElementById(decodeHash(url.hash));
    if (target && human.contains(target)) setMode('human');
    if (target === agent) setMode('agent');
  }, true);
  window.addEventListener('popstate', syncFromUrl);
  window.addEventListener('hashchange', syncFromUrl);
  syncFromUrl();

  copy?.addEventListener('click', async () => {
    const text = window.MARCO_PROFILE_TEXT;
    if (!text || !status) {
      if (status) status.textContent = 'Open the full AI profile below to copy it.';
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Full profile copied, including evidence links and scope.';
    } catch {
      // Keep an honest failure state if clipboard access is blocked.
      status.textContent = 'Copy is unavailable in this browser. Open the full AI profile below and copy its text.';
    }
  });
  return { setMode };
}

function decodeHash(hash) {
  try { return decodeURIComponent(hash.slice(1)); } catch { return ''; }
}

// Also expose the initializer to Node for deterministic interaction checks.
if (typeof module !== 'undefined' && module.exports) module.exports = { initProfileView };
