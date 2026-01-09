export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, key');
        return res.status(200).end();
    }

    try {
        const { path } = req.query;
        // Vercel path segments are arrays. Join them.
        const pathStr = Array.isArray(path) ? path.join('/') : path;
        const targetUrl = `https://api.x2download.is/${pathStr}`;

        console.log(`Proxying to: ${targetUrl}`);

        const headers = {
            'Accept': '*/*',
            'Origin': 'https://x2download.is',
            'Referer': 'https://x2download.is/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        };

        // Forward specific headers
        if (req.headers.key) headers['key'] = req.headers.key;
        if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];

        const options = {
            method: req.method,
            headers: headers,
        };

        if (req.method === 'POST') {
            options.body = req.body; // Vercel parses body for us in Node runtime
            // If body is object, we might need to stringify form data if upstream expects urlencoded
            if (typeof req.body === 'object') {
                const searchParams = new URLSearchParams();
                for (const key in req.body) {
                    searchParams.append(key, req.body[key]);
                }
                options.body = searchParams.toString();
            }
        }

        const response = await fetch(targetUrl, options);

        // Read response
        const data = await response.text();

        // Set headers for response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');

        try {
            const json = JSON.parse(data);
            res.status(response.status).json(json);
        } catch (e) {
            // Fallback if response is not JSON
            res.status(response.status).send(data);
        }

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
