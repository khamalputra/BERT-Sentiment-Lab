// Vercel Serverless Function: GPU Health Check Proxy
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const GPU_URL = 'https://irritably-tipper-january.ngrok-free.dev/api/health';
  const RAILWAY_URL = 'https://nurturing-creation-production-4414.up.railway.app/api/health';

  try {
    const gpuRes = await fetch(`${GPU_URL}?ngrok-skip-browser-warning=true`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'BERT-Sentiment-Lab-Vercel-Proxy/1.0',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!gpuRes.ok) throw new Error(`GPU ${gpuRes.status}`);
    const ct = gpuRes.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('Non-JSON from GPU');
    const data = await gpuRes.json();
    return res.status(200).json(data);
  } catch (e) {
    try {
      const railRes = await fetch(RAILWAY_URL, { signal: AbortSignal.timeout(10000) });
      if (!railRes.ok) throw new Error(`Railway ${railRes.status}`);
      const data = await railRes.json();
      return res.status(200).json(data);
    } catch (e2) {
      return res.status(503).json({ error: 'All backends unavailable' });
    }
  }
}
