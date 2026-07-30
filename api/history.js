// Vercel Serverless Function: History Proxy
// Supports GET (fetch history), DELETE (clear history)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const GPU_URL = 'https://irritably-tipper-january.ngrok-free.dev';
  const RAILWAY_URL = 'https://nurturing-creation-production-4414.up.railway.app';

  // Reconstruct query string
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';

  async function tryBackend(baseUrl) {
    const separator = qs ? `${qs}&ngrok-skip-browser-warning=true` : '?ngrok-skip-browser-warning=true';
    const url = baseUrl === GPU_URL
      ? `${baseUrl}/api/history${separator}`
      : `${baseUrl}/api/history${qs}`;

    const opts = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'BERT-Sentiment-Lab-Vercel-Proxy/1.0',
      },
      signal: AbortSignal.timeout(10000),
    };

    if (req.method === 'POST' || req.method === 'PUT') {
      opts.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, opts);
    if (!response.ok) throw new Error(`${response.status}`);
    const ct = response.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('Non-JSON');
    return await response.json();
  }

  try {
    const data = await tryBackend(GPU_URL);
    return res.status(200).json(data);
  } catch (e) {
    try {
      const data = await tryBackend(RAILWAY_URL);
      return res.status(200).json(data);
    } catch (e2) {
      return res.status(503).json({ error: 'All backends unavailable' });
    }
  }
}
