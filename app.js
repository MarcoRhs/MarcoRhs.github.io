document.documentElement.classList.add("js");

const ENDPOINT = "https://ulkqedfxgogayealzqpv.supabase.co/functions/v1/ask-cv";
const SUGGESTIONS = [
  {label: "AI engineering fit", question: "What evidence in Marco's CV supports his fit for an AI engineering role?"},
  {label: "Production proof", question: "What production evidence shows that Marco can ship AI products end to end?"},
  {label: "Technical stack", question: "Which technologies has Marco used across AI, backend and mobile product development?"},
  {label: "Enterprise adoption", question: "How has Marco helped enterprise teams adopt AI products and improve customer outcomes?"},
  {label: "Role fit", question: "Which roles best match Marco's experience, based on his CV?"}
];
const COPY = {
  rate_limited: "The question limit for today is reached. Email Marco directly, or ask again tomorrow.",
  refused: "That question can't be answered here. Ask about Marco's work instead.",
  too_long: "That question is too long. Keep it under 600 characters.",
  bad_request: "That question couldn't be read. Rephrase it and ask again.",
  unavailable: "The assistant is briefly unavailable. Ask again in a minute.",
  not_configured: "The assistant is being set up. Email Marco directly in the meantime.",
  upstream_error: "The answer service didn't respond. Ask again in a minute.",
  empty: "No answer came back. Rephrase the question and ask again.",
  invalid_answer: "The answer was incomplete. Please ask again.",
  timeout: "The answer took too long. Ask again.",
  network: "The assistant can't be reached. Check your connection and ask again.",
  default: "The answer didn't come through. Ask again."
};
const CLIENT_TIMEOUT_MS = 30000;
const $ = (id) => document.getElementById(id);
const q = $("q"), askBtn = $("askBtn"), stopBtn = $("stopBtn"), thread = $("thread");
let asked = [], ctl = null, busy = false, suggestionButtons = [];

SUGGESTIONS.forEach(s => {
  const b = document.createElement("button");
  b.className = "chip"; b.type = "button"; b.textContent = s.label;
  b.setAttribute("aria-label", `${s.label}: ${s.question}`);
  b.onclick = () => ask(s.question);
  suggestionButtons.push(b);
  $("chips").append(b);
});

function setBusy(nextBusy){
  busy = nextBusy;
  askBtn.disabled = nextBusy;
  stopBtn.hidden = !nextBusy;
  suggestionButtons.forEach(button => { button.disabled = nextBusy; });
}

function appendInline(el, text){
  const bold = /\*\*([^*\n]+)\*\*/g;
  let end = 0;
  for (const match of text.matchAll(bold)) {
    el.append(document.createTextNode(text.slice(end, match.index)));
    const strong = document.createElement("strong");
    strong.textContent = match[1];
    el.append(strong);
    end = match.index + match[0].length;
  }
  el.append(document.createTextNode(text.slice(end)));
}

function joinCategoryPairs(body){
  const lines = body.split("\n");
  const isPair = i => {
    const label = lines[i]?.trim() || "";
    const value = lines[i + 1]?.trim() || "";
    return /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9 &/+\-]{2,40}$/.test(label)
      && value.length > label.length + 8 && !/^[-*•]/.test(value);
  };
  if (lines.filter((_, i) => isPair(i)).length < 2) return body;
  const joined = [];
  for (let i = 0; i < lines.length; i++) {
    if (isPair(i)) { joined.push(`${lines[i].trim()}: ${lines[i + 1].trim()}`); i++; }
    else joined.push(lines[i]);
  }
  return joined.join("\n");
}

function formatSourceLine(sourceLine){
  const labels = sourceLine.replace(/^source:\s*/i, "").split("; ");
  const hasGap = labels.includes("not in CV");
  const evidence = labels.filter(label => label !== "not in CV");
  if (!evidence.length) return "CV source: Not stated in the CV";
  const prefix = hasGap ? "CV evidence (with a gap noted): " : "CV evidence: ";
  return `${prefix}${evidence.join(" · ")}`;
}

function renderAnswer(el, text){
  el.replaceChildren();
  const lines = text.trim().split(/\r?\n/);
  const src = /^source:/i.test(lines[lines.length - 1]?.trim() || "") ? lines.pop().trim() : null;
  // Keep model line breaks. A single text node collapses them into one paragraph in HTML.
  const body = joinCategoryPairs(lines.join("\n")).replace(/([^\n])\s+-\s+(?=(?:\*\*)?[^:\n]{2,40}:(?:\*\*)?\s)/g, "$1\n- ");
  const entries = body.split("\n").map(raw => {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.+)$/);
    const content = bullet ? bullet[1] : line;
    const category = content.replace(/\*\*/g, "").match(/^([^:.!?]{2,40}):\s+(.+)$/);
    return {line, bullet, category};
  });
  const hasCategories = entries.filter(entry => entry.category).length >= 2;
  let list = null, details = null;
  for (const {line, bullet, category} of entries) {
    if (!line) { list = null; details = null; continue; }
    if (hasCategories && category) {
      if (!details) { details = document.createElement("dl"); details.className = "answer-details"; el.append(details); }
      const row = document.createElement("div");
      const label = document.createElement("dt"); label.textContent = category[1];
      const value = document.createElement("dd"); value.textContent = category[2];
      row.append(label, value); details.append(row);
      list = null;
    } else if (bullet) {
      details = null;
      if (!list) { list = document.createElement("ul"); el.append(list); }
      const li = document.createElement("li");
      appendInline(li, bullet[1]);
      list.append(li);
    } else {
      list = null; details = null;
      const p = document.createElement("p");
      appendInline(p, line);
      el.append(p);
    }
  }
  if (src){ const s = document.createElement("span"); s.className = "src"; s.textContent = formatSourceLine(src); el.append(s); }
}

async function ask(question = q.value){
  const fromInput = arguments.length === 0;
  const text = question.trim();
  if (!text || busy) return;
  setBusy(true);
  const item = document.createElement("div");
  const qe = document.createElement("div"); qe.className = "q"; qe.textContent = text;
  const ae = document.createElement("div"); ae.className = "a";
  const st = document.createElement("span"); st.className = "status"; st.textContent = "Thinking...";
  ae.append(st); item.append(qe, ae); thread.prepend(item);
  item.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  if (fromInput) q.value = "";
  const history = asked.slice(-4);
  asked.push(text);
  ctl = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; ctl.abort(); }, CLIENT_TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({question: text, history}), signal: ctl.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.text) throw {code: data.error || "default"};
    renderAnswer(ae, data.text);
  } catch (e) {
    asked.pop();
    if (e && e.name === "AbortError" && !timedOut){ ae.textContent = "Stopped."; }
    else {
      const code = timedOut ? "timeout" : (e && e.code) || (e instanceof TypeError ? "network" : "default");
      ae.textContent = "";
      const er = document.createElement("p"); er.className = "err"; er.textContent = COPY[code] || COPY.default; ae.append(er);
    }
  } finally {
    clearTimeout(timer);
    setBusy(false); ctl = null;
  }
}
askBtn.onclick = () => ask();
stopBtn.onclick = () => ctl && ctl.abort();
q.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); ask(); } });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && "IntersectionObserver" in window) {
  const revealItems = [...document.querySelectorAll(".reveal")];
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {rootMargin: "0px 0px -8%", threshold: .08});

  revealItems.forEach(item => {
    item.classList.add("reveal-ready");
    if (item.getBoundingClientRect().top < window.innerHeight * .94) item.classList.add("is-visible");
    else revealObserver.observe(item);
  });
}

const heroProfile = document.querySelector(".hero-profile");
if (heroProfile && !reduceMotion) {
  if ("IntersectionObserver" in window) {
    const ambientObserver = new IntersectionObserver(([entry]) => {
      heroProfile.classList.toggle("is-ambient", entry.isIntersecting);
    }, {threshold: .08});
    ambientObserver.observe(heroProfile);
  } else {
    heroProfile.classList.add("is-ambient");
  }
}

const productShots = $("product-shots");
const screenButtons = [...document.querySelectorAll("[data-screen-target]")];
if (productShots && screenButtons.length) {
  screenButtons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.screenTarget;
      productShots.dataset.active = target;
      screenButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    });
  });
}

if (productShots && !reduceMotion) {
  productShots.classList.add("shots-ready");
  const revealShots = () => {
    if (productShots.classList.contains("shots-visible")) return;
    productShots.classList.add("shots-visible");
    window.setTimeout(() => productShots.classList.add("shots-entered"), 850);
  };
  if ("IntersectionObserver" in window) {
    const shotsObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      revealShots();
      shotsObserver.disconnect();
    }, {rootMargin: "0px 0px -7%", threshold: .08});
    shotsObserver.observe(productShots);
  } else {
    requestAnimationFrame(revealShots);
  }
}

const progressFill = reduceMotion ? null : document.querySelector(".scroll-progress span");
const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')]
  .map(link => ({link, section: document.querySelector(link.getAttribute("href"))}))
  .filter(item => item.section);
let scrollFrame = 0;

function updateScrollUI(){
  scrollFrame = 0;
  if (progressFill) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressFill.style.transform = `scaleX(${progress})`;
  }
  const marker = Math.min(180, window.innerHeight * .28);
  let activeLink = null;
  sectionLinks.forEach(({link, section}) => {
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= marker && bounds.bottom > marker) activeLink = link;
  });
  sectionLinks.forEach(({link}) => {
    if (link === activeLink) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function requestScrollUI(){
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUI);
}

window.addEventListener("scroll", requestScrollUI, {passive: true});
window.addEventListener("resize", requestScrollUI, {passive: true});
updateScrollUI();

const navToggle = $("navToggle");
const navLinks = $("nav-links");
if (navToggle && navLinks) {
  const setNav = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    navLinks.classList.toggle("is-open", open);
  };
  navToggle.addEventListener("click", () => setNav(navToggle.getAttribute("aria-expanded") !== "true"));
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest(".nav-link")) setNav(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#nav-links") && !event.target.closest("#navToggle")) setNav(false);
  });
}
