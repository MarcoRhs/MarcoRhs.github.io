const ENDPOINT = "https://ulkqedfxgogayealzqpv.supabase.co/functions/v1/ask-cv";
const SUGGESTIONS = [
  "What has Marco built with AI?",
  "How does the health safety gate in ManeMap work?",
  "Which tech stack does he use?",
  "How has Marco driven enterprise AI adoption?",
  "Is he available, and how does he work?"
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
let asked = [], ctl = null, busy = false;

SUGGESTIONS.forEach(s => {
  const b = document.createElement("button");
  b.className = "chip"; b.type = "button"; b.textContent = s;
  b.onclick = () => { q.value = s; ask(); };
  $("chips").append(b);
});

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

function renderAnswer(el, text){
  el.replaceChildren();
  const lines = text.trim().split(/\r?\n/);
  const src = /^source:/i.test(lines[lines.length - 1]?.trim() || "") ? lines.pop().trim() : null;
  // Keep model line breaks. A single text node collapses them into one paragraph in HTML.
  const body = lines.join("\n").replace(/([^\n])\s+-\s+(?=(?:\*\*)?[^:\n]{2,40}:(?:\*\*)?\s)/g, "$1\n- ");
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
  if (src){ const s = document.createElement("span"); s.className = "src"; s.textContent = src; el.append(s); }
}

async function ask(){
  const text = q.value.trim();
  if (!text || busy) return;
  busy = true; askBtn.disabled = true; stopBtn.hidden = false;
  const item = document.createElement("div");
  const qe = document.createElement("div"); qe.className = "q"; qe.textContent = text;
  const ae = document.createElement("div"); ae.className = "a";
  const st = document.createElement("span"); st.className = "status"; st.textContent = "Thinking...";
  ae.append(st); item.append(qe, ae); thread.prepend(item);
  q.value = "";
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
    busy = false; askBtn.disabled = false; stopBtn.hidden = true; ctl = null;
  }
}
askBtn.onclick = ask;
stopBtn.onclick = () => ctl && ctl.abort();
q.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); ask(); } });
