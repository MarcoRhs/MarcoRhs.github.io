import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { SYSTEM_PROMPT, buildUserTurn, hasValidSourceLine } from '../../supabase/functions/ask-cv/prompt.ts';
import { normalizeHistory } from '../../supabase/functions/ask-cv/request.ts';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || true];
}));
const mode = args.mode || 'offline';
if (!['offline', 'live'].includes(mode)) throw new Error('Use --mode=offline or --mode=live');
const model = args.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
if (mode === 'offline' && !process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required for offline mode');
const cases = JSON.parse(await readFile(new URL('./cases.json', import.meta.url), 'utf8'));
const ids = args.ids ? new Set(String(args.ids).split(',')) : null;
const selected = cases.filter((c) => !ids || ids.has(c.id));
if (!selected.length) throw new Error('No matching cases');
const repeat = Number(args.repeat || 1);
if (!Number.isInteger(repeat) || repeat < 1 || repeat > 5) throw new Error('Use --repeat=1..5');
if (mode === 'live' && selected.length * repeat > 12) throw new Error('Live runs are capped at 12 calls to preserve the public daily allowance');

const liveUrl = 'https://ulkqedfxgogayealzqpv.supabase.co/functions/v1/ask-cv';
const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const results = [];
for (const [index, c] of Array.from({ length: repeat }, () => selected).flat().entries()) {
  const started = performance.now();
  const history = normalizeHistory(c.history || []);
  let status = 0, text = '', error = '', finishReason = '';
  try {
    const payload = mode === 'live'
      ? { question: c.question, history }
      : {
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: buildUserTurn(c.question, history) }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 700, thinkingConfig: { thinkingBudget: 0 } },
        };
    const response = await fetch(mode === 'live' ? liveUrl : modelUrl, {
      method: 'POST',
      headers: mode === 'live'
        ? { 'Content-Type': 'application/json', Origin: 'https://marcorhs.github.io' }
        : { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(35000),
    });
    status = response.status;
    const data = await response.json();
    if (mode === 'live') text = data.text || '';
    else {
      text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
      finishReason = data.candidates?.[0]?.finishReason || '';
    }
    error = typeof data.error === 'string' ? data.error : data.error?.message || (!text ? JSON.stringify(data).slice(0, 240) : '');
  } catch (e) { error = e instanceof Error ? e.message : String(e); }
  const elapsedMs = Math.round(performance.now() - started);
  const source = text.trim().match(/(?:^|\n)Source: ([^\n]+)$/i)?.[1] || null;
  const checks = {
    response: status === 200 && Boolean(text),
    complete: mode === 'live' || finishReason === 'STOP',
    sourceLine: hasValidSourceLine(text),
    expectedSource: Boolean(source && new RegExp(c.expectSource, 'i').test(source)),
    mustMention: !c.mustMention || new RegExp(c.mustMention, 'i').test(text),
    forbid: !c.forbid || !new RegExp(c.forbid, 'i').test(text),
  };
  const passed = Object.values(checks).every(Boolean);
  const attempt = Math.floor(index / selected.length) + 1;
  results.push({ id: c.id, attempt, category: c.category, question: c.question, history, status, elapsedMs, text, error, finishReason, source, checks, passed });
  console.log(`${passed ? 'PASS' : 'FAIL'} ${c.id}#${attempt} ${elapsedMs}ms ${source || error || 'no source'}`);
  if (mode === 'live' && status === 429) break;
}
const durations = results.map((r) => r.elapsedMs).sort((a, b) => a - b);
const percentile = (p) => durations.length ? durations[Math.min(durations.length - 1, Math.ceil(p * durations.length) - 1)] : 0;
const report = { mode, model: mode === 'offline' ? model : 'production-configured', runAt: new Date().toISOString(), total: results.length, passed: results.filter((r) => r.passed).length, p50Ms: percentile(.5), p95Ms: percentile(.95), results };
const resultDir = new URL('./results/', import.meta.url);
await mkdir(resultDir, { recursive: true });
const file = new URL(`${new Date().toISOString().replace(/[:.]/g, '-')}-${mode}.json`, resultDir);
await writeFile(file, JSON.stringify(report, null, 2));
console.log(`RESULT ${report.passed}/${report.total} passed; p50 ${report.p50Ms}ms, p95 ${report.p95Ms}ms; ${file.pathname}`);
if (report.passed !== report.total) process.exitCode = 1;
