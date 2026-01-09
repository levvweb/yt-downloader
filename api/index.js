export default async function handler(req, res) {
    // Config CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, key');

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Parse path dari URL
        // URL contoh: /api/v2/converter -> kita butuh /v2/converter
        const urlParts = req.url.split('/api/');
        const apiPath = urlParts.length > 1 ? urlParts[1] : '';

        if (!apiPath) {
            return res.status(400).json({ error: 'Invalid API path' });
        }

        const targetUrl = `https://api.x2download.is/${apiPath}`;
        console.log('Proxying to:', targetUrl);

        const headers = {
            'Accept': '*/*',
            'Origin': 'https://x2download.is',
            'Referer': 'https://x2download.is/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        };

        if (req.headers.key) headers['key'] = req.headers.key;
        if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];

        const fetchOptions = {
            method: req.method,
            headers: headers
        };

        if (req.method === 'POST') {
            fetchOptions.body = typeof req.body === 'object'
                ? new URLSearchParams(req.body).toString()
                : req.body;
        }

        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.text();

        try {
            const json = JSON.parse(data);
            return res.status(response.status).json(json);
        } catch (e) {
            return res.status(response.status).send(data);
        }
    } catch (error) {
        console.error('SERVER ERROR:', error);
        return res.status(500).json({ error: error.message });
    }
}
