export default async function handler(req, res) {
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    const targetUrl = `https://api.x2download.is/${apiPath}`;

    try {
        const headers = {
            'accept': '*/*',
            'origin': 'https://x2download.is',
            'referer': 'https://x2download.is/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };

        if (req.headers.key) {
            headers['key'] = req.headers.key;
        }
        if (req.headers['content-type']) {
            headers['content-type'] = req.headers['content-type'];
        }

        const fetchOptions = {
            method: req.method,
            headers
        };

        if (req.method === 'POST' && req.body) {
            fetchOptions.body = typeof req.body === 'string' ? req.body : new URLSearchParams(req.body).toString();
        }

        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
