export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/', '');
    const targetUrl = `https://api.x2download.is/${path}`;

    try {
        const headers = {
            'accept': '*/*',
            'origin': 'https://x2download.is',
            'referer': 'https://x2download.is/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };

        const keyHeader = request.headers.get('key');
        if (keyHeader) {
            headers['key'] = keyHeader;
        }

        const contentType = request.headers.get('content-type');
        if (contentType) {
            headers['content-type'] = contentType;
        }

        const fetchOptions = {
            method: request.method,
            headers
        };

        if (request.method === 'POST') {
            fetchOptions.body = await request.text();
        }

        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.text();

        return new Response(data, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
