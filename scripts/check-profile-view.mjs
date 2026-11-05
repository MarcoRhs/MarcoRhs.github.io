import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initProfileView } from '../profile-view.js';

class Events {
  listeners = new Map();
  addEventListener(name, callback) {
    const callbacks = this.listeners.get(name) || [];
    callbacks.push(callback);
    this.listeners.set(name, callbacks);
  }
  async dispatch(name, event = {}) {
    for (const callback of this.listeners.get(name) || []) await callback(event);
  }
}

class Element extends Events {
  constructor(id, { hidden = false, parent = null } = {}) {
    super();
    this.id = id;
    this.hidden = hidden;
    this.parent = parent;
    this.attributes = new Map();
    this.textContent = '';
  }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  contains(node) {
    for (let cursor = node; cursor; cursor = cursor.parent) if (cursor === this) return true;
    return false;
  }
  closest(selector) {
    if (selector === 'a[href]' && this.attributes.has('href')) return this;
    return this.parent?.closest(selector) ?? null;
  }
}

function setup({
  url = 'https://marcorhs.github.io/',
  profile = '# Marco\nEvidence: https://marcorhs.github.io/docs/milo-evaluation.md\nHistorical v117 routing only; one known failure.',
  writeText,
  reducedMotion = false,
} = {}) {
  const document = new Events();
  document.title = 'Marco Rohns — AI Engineer & Product Builder';
  const classes = new Set();
  document.body = { classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) } };
  const nodes = new Map();
  const add = (id, options) => { const node = new Element(id, options); nodes.set(id, node); return node; };
  const main = add('main');
  const human = add('human-profile', { parent: main });
  const agent = add('agent-profile', { hidden: true, parent: main });
  const work = add('work', { parent: human });
  const ask = add('askzone', { parent: human });
  const toggle = add('agentViewToggle');
  const copy = add('copyAgentProfile', { parent: agent });
  const status = add('agentCopyStatus', { parent: agent });
  document.getElementById = id => nodes.get(id) ?? null;
  const window = new Events();
  window.location = { href: url };
  window.matchMedia = () => ({ matches: reducedMotion });
  window.MARCO_PROFILE_TEXT = profile;
  const scrolls = [];
  window.scrollTo = options => scrolls.push(options);
  const replacements = [];
  const history = { replaceState: (_state, _title, value) => {
    window.location.href = String(value);
    replacements.push(String(value));
  } };
  const copied = [];
  const navigator = { clipboard: { writeText: writeText || (async text => { copied.push(text); }) } };
  const api = initProfileView({ document, window, history, navigator });
  const clickLink = async (href, modifiers = {}) => {
    const link = new Element('test-link');
    link.setAttribute('href', href);
    // Nested text/icon targets are common in the actual navigation.
    const icon = new Element('icon', { parent: link });
    await document.dispatch('click', { target: icon, button: 0, defaultPrevented: false, ...modifiers });
  };
  return { document, window, navigator, main, human, agent, work, ask, toggle, copy, status, api, classes, scrolls, copied, replacements, clickLink };
}

test('switches panels, aria state and URL without hiding the main landmark', async () => {
  const s = setup({ url: 'https://marcorhs.github.io/?utm_source=linkedin#work' });
  const originalTitle = s.document.title;
  assert.equal(s.human.hidden, false);
  assert.equal(s.agent.hidden, true);
  await s.toggle.dispatch('click');
  assert.equal(s.human.hidden, true);
  assert.equal(s.agent.hidden, false);
  assert.equal(s.main.hidden, false);
  assert.equal(s.toggle.getAttribute('aria-checked'), 'true');
  assert.equal(s.classes.has('agent-mode'), true);
  assert.equal(new URL(s.window.location.href).searchParams.get('utm_source'), 'linkedin');
  assert.equal(new URL(s.window.location.href).searchParams.get('view'), 'agent');
  assert.equal(new URL(s.window.location.href).hash, '#agent-profile');
  await s.toggle.dispatch('click');
  assert.equal(s.human.hidden, false);
  assert.equal(s.agent.hidden, true);
  assert.equal(s.main.hidden, false);
  assert.equal(s.toggle.getAttribute('aria-checked'), 'false');
  assert.equal(s.classes.has('agent-mode'), false);
  assert.equal(new URL(s.window.location.href).searchParams.has('view'), false);
  assert.equal(s.document.title, originalTitle);
});

test('a human deep link overrides agent mode and retains the requested section', () => {
  const s = setup({ url: 'https://marcorhs.github.io/?view=agent#work' });
  assert.equal(s.human.hidden, false);
  assert.equal(s.agent.hidden, true);
  assert.equal(new URL(s.window.location.href).hash, '#work');
  assert.equal(new URL(s.window.location.href).searchParams.has('view'), false);
});

test('agent query and direct agent fragment both reveal the AI profile', () => {
  for (const url of ['https://marcorhs.github.io/?view=agent', 'https://marcorhs.github.io/#agent-profile']) {
    const s = setup({ url });
    assert.equal(s.agent.hidden, false);
    assert.equal(s.human.hidden, true);
    assert.equal(s.main.hidden, false);
  }
});

test('in-page human navigation reveals its destination before default fragment navigation', async () => {
  const s = setup({ url: 'https://marcorhs.github.io/?view=agent' });
  await s.clickLink('#askzone');
  assert.equal(s.human.hidden, false);
  assert.equal(s.agent.hidden, true);
  assert.equal(s.toggle.getAttribute('aria-checked'), 'false');
  assert.equal(new URL(s.window.location.href).searchParams.has('view'), false);
});

test('external, another page, modifier, middle-button and prevented clicks leave the current mode alone', async () => {
  const s = setup({ url: 'https://marcorhs.github.io/?view=agent' });
  const clicks = [
    ['https://example.com/#work', {}],
    ['architecture.html#work', {}],
    ['#work', { metaKey: true }],
    ['#work', { ctrlKey: true }],
    ['#work', { shiftKey: true }],
    ['#work', { altKey: true }],
    ['#work', { button: 1 }],
    ['#work', { defaultPrevented: true }],
  ];
  for (const [href, modifiers] of clicks) {
    await s.clickLink(href, modifiers);
    assert.equal(s.agent.hidden, false, href + JSON.stringify(modifiers));
    assert.equal(s.human.hidden, true);
  }
  assert.equal(s.replacements.length, 0);
});

test('back/forward and fragment changes synchronize the visible reading mode', async () => {
  const s = setup();
  s.window.location.href = 'https://marcorhs.github.io/?view=agent';
  await s.window.dispatch('popstate');
  assert.equal(s.agent.hidden, false);
  s.window.location.href = 'https://marcorhs.github.io/?view=agent#work';
  await s.window.dispatch('hashchange');
  assert.equal(s.human.hidden, false);
  assert.equal(new URL(s.window.location.href).hash, '#work');
  s.window.location.href = 'https://marcorhs.github.io/#agent-profile';
  await s.window.dispatch('hashchange');
  assert.equal(s.agent.hidden, false);
});

test('skip link keeps the visible main landmark available in agent mode', async () => {
  const s = setup({ url: 'https://marcorhs.github.io/?view=agent' });
  await s.clickLink('#main');
  assert.equal(s.main.hidden, false);
  assert.equal(s.agent.hidden, false);
  assert.equal(s.main.contains(s.agent), true);
});

test('reduced-motion preference removes smooth scrolling on mode switches', async () => {
  const s = setup({ reducedMotion: true });
  await s.toggle.dispatch('click');
  assert.deepEqual(s.scrolls, [{ top: 0, behavior: 'auto' }]);
});

test('copies the generated profile verbatim, preserving proof links and qualifications', async () => {
  const s = setup();
  await s.copy.dispatch('click');
  assert.deepEqual(s.copied, [s.window.MARCO_PROFILE_TEXT]);
  assert.match(s.copied[0], /docs\/milo-evaluation\.md/);
  assert.match(s.copied[0], /one known failure/);
  assert.match(s.status.textContent, /Full profile copied/);
});

test('clipboard failure never reports success and explains the available fallback', async () => {
  const s = setup({ writeText: async () => { throw new Error('Permission denied'); } });
  await s.copy.dispatch('click');
  assert.doesNotMatch(s.status.textContent, /copied/i);
  assert.match(s.status.textContent, /Open the full AI profile/);
  assert.deepEqual(s.copied, []);
});

test('missing clipboard API and missing generated source fail honestly', async () => {
  const noClipboard = setup();
  delete noClipboard.navigator.clipboard;
  await noClipboard.copy.dispatch('click');
  assert.match(noClipboard.status.textContent, /Copy is unavailable/);
  const noSource = setup({ profile: '' });
  await noSource.copy.dispatch('click');
  assert.match(noSource.status.textContent, /Open the full AI profile/);
  assert.doesNotMatch(noSource.status.textContent, /copied/i);
  assert.deepEqual(noSource.copied, []);
});

test('malformed percent-encoded fragments do not break initialization or navigation', async () => {
  const s = setup({ url: 'https://marcorhs.github.io/?view=agent#%E0%A4%A' });
  assert.equal(s.agent.hidden, false);
  await s.clickLink('#%E0%A4%A');
  assert.equal(s.agent.hidden, false);
  s.window.location.href = 'https://marcorhs.github.io/#%';
  await s.window.dispatch('hashchange');
  assert.equal(s.human.hidden, false);
});
