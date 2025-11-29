import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Construct the URL to forward the request to, including any query parameters
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = `https://www.freetogame.com/api/games?${searchParams.toString()}`;

  try {
    const apiResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Vercel-Proxy/1.0' // Some APIs require a user-agent
      }
    });

    if (!apiResponse.ok) {
      // Forward the error status from the external API
      return res.status(apiResponse.status).json({ message: 'Error from FreeToGame API' });
    }

    const data = await apiResponse.json();

    // Set cache headers to improve performance and reduce API calls
    // Cache for 1 hour on Vercel's CDN, allow stale for 1 day while revalidating
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ message: 'Internal Server Error in proxy' });
  }
}