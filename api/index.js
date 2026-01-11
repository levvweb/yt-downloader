export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url, format } = req.query;

    if (!url || !format) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: 'Missing url or format parameter'
        });
    }

    const targetUrl = `https://host.optikl.ink/download/youtube?url=${encodeURIComponent(url)}&format=${encodeURIComponent(format)}`;

    console.log('Proxying to:', targetUrl);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 55000);

        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const text = await response.text();
        console.log('API Response:', text.substring(0, 500));

        try {
            const data = JSON.parse(text);
            return res.status(response.status).json(data);
        } catch (parseError) {
            return res.status(502).json({
                status: false,
                code: 502,
                message: 'Invalid response from upstream API',
                raw: text.substring(0, 200)
            });
        }

    } catch (error) {
        console.error('Fetch error:', error.name, error.message);

        if (error.name === 'AbortError') {
            return res.status(504).json({
                status: false,
                code: 504,
                message: 'Request timeout - API took too long'
            });
        }

        return res.status(500).json({
            status: false,
            code: 500,
            message: error.message || 'Internal server error'
        });
    }
}
