// Compare the published CV bytes with the corpus fingerprint of the deployed function.
import { createHash } from 'node:crypto';
const site = process.env.PORTFOLIO_URL || 'https://marcorhs.github.io/';
const endpoint = process.env.ASK_CV_URL || 'https://ulkqedfxgogayealzqpv.supabase.co/functions/v1/ask-cv';
try {
  const [cv, metadata] = await Promise.all([
    fetch(new URL('resume.md', site), { cache: 'no-store', signal: AbortSignal.timeout(15000) }),
    fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(15000) }),
  ]);
  if (!cv.ok || !metadata.ok) throw new Error(`HTTP status: CV ${cv.status}, assistant ${metadata.status}`);
  const digest = createHash('sha256').update(Buffer.from(await cv.arrayBuffer())).digest('hex');
  const data = await metadata.json();
  if (!/^[a-f0-9]{64}$/.test(data.corpusSha256 || '')) throw new Error('Assistant does not expose a valid corpus fingerprint; it may need deploying.');
  if (digest !== data.corpusSha256) throw new Error(`Corpus mismatch: website ${digest}; assistant ${data.corpusSha256}`);
  console.log(`Published CV and deployed assistant match: SHA-256 ${digest}`);
} catch (error) {
  console.error(`Corpus check failed: ${error.message}`);
  process.exitCode = 1;
}
