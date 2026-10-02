const endpoint = 'https://ulkqedfxgogayealzqpv.supabase.co/functions/v1/ask-cv';
const probes = [
  { name: 'invalid_json', origin: 'https://marcorhs.github.io', body: '{', status: 400, error: 'bad_request' },
  { name: 'long_question', origin: 'https://marcorhs.github.io', body: JSON.stringify({ question: 'x'.repeat(601) }), status: 413, error: 'too_long' },
  { name: 'oversize_utf8_body', origin: 'https://marcorhs.github.io', body: JSON.stringify({ question: 'hi', history: ['漢'.repeat(2700)] }), status: 413, error: 'too_long' },
  { name: 'foreign_origin', origin: 'https://example.com', body: JSON.stringify({ question: 'What has Marco built?' }), status: 403, error: 'origin_not_allowed' },
];
let failures = 0;
for (const p of probes) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: p.origin },
    body: p.body,
    signal: AbortSignal.timeout(10000),
  });
  const data = await response.json();
  const passed = response.status === p.status && data.error === p.error;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${p.name}: ${response.status} ${data.error}`);
  if (!passed) failures++;
}
if (failures) process.exitCode = 1;
