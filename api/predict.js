// Vercel Serverless Function: GPU Proxy
// Proxies POST /api/predict to the Ngrok GPU backend (Google Colab Tesla T4)
// This solves:
//   1. Vercel rewrites returning 502 (Ngrok interstitial page)
//   2. Browser CORS restrictions (same-origin request)

export default async function handler(req, res) {
  // CORS headers for preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GPU_URL = 'https://irritably-tipper-january.ngrok-free.dev/api/predict';
  const RAILWAY_URL = 'https://nurturing-creation-production-4414.up.railway.app/api/predict';

  try {
    // Try GPU backend first
    const gpuResponse = await fetch(`${GPU_URL}?ngrok-skip-browser-warning=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'BERT-Sentiment-Lab-Vercel-Proxy/1.0',
      },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!gpuResponse.ok) {
      throw new Error(`GPU backend returned ${gpuResponse.status}`);
    }

    const contentType = gpuResponse.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Ngrok returned HTML warning page, not JSON
      throw new Error('GPU backend returned non-JSON (Ngrok warning page)');
    }

    const data = await gpuResponse.json();
    return res.status(200).json(data);

  } catch (gpuError) {
    console.warn('GPU backend failed, falling back to Railway CPU:', gpuError.message);

    try {
      // Fallback to Railway CPU
      const railwayResponse = await fetch(RAILWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(15000),
      });

      if (!railwayResponse.ok) {
        throw new Error(`Railway backend returned ${railwayResponse.status}`);
      }

      const data = await railwayResponse.json();
      return res.status(200).json(data);

    } catch (railwayError) {
      return res.status(503).json({
        error: 'Both GPU and CPU backends are unavailable',
        gpu_error: gpuError.message,
        cpu_error: railwayError.message,
      });
    }
  }
}
