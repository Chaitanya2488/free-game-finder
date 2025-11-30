import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { searchParams } = new URL(req.url || '/', `http://${req.headers.host}`);
  const targetUrl = `https://www.freetogame.com/api/games?${searchParams.toString()}`;

  try {
    const apiResponse = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Vercel-Proxy/1.0' }
    });

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ message: 'Error from FreeToGame API' });
    }

    const data = await apiResponse.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ message: 'Internal Server Error in proxy' });
  }
}
