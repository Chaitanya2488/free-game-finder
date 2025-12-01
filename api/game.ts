import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Game ID is required.' });
  }

  const targetUrl = `https://www.freetogame.com/api/game?id=${id}`;

  try {
    const apiResponse = await fetch(targetUrl);

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ message: 'Error from FreeToGame API' });
    }

    const data = await apiResponse.json();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ message: 'Internal Server Error in proxy' });
  }
}