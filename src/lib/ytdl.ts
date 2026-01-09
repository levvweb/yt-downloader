export class YouTubeDownloader {
    private keyEndpoint = '/api/v2/sanity/key';
    private converterEndpoint = '/api/v2/converter';

    async getKey(): Promise<string> {
        try {
            const response = await fetch(this.keyEndpoint, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.key) {
                return data.key;
            }
            throw new Error('Key not found in response');
        } catch (error: any) {
            console.error('Failed to get key:', error);
            throw new Error(`Failed to get key: ${error.message}`);
        }
    }

    async convert(youtubeUrl: string, options: {
        format?: string,
        audioBitrate?: string,
        videoQuality?: string,
        vCodec?: string
    } = {}) {
        const {
            format = 'mp3',
            audioBitrate = '320',
            videoQuality = '720',
            vCodec = 'h264'
        } = options;

        try {
            const apiKey = await this.getKey();

            const params = new URLSearchParams();
            params.append('link', youtubeUrl);
            params.append('format', format);
            params.append('audioBitrate', audioBitrate);
            params.append('videoQuality', videoQuality);
            params.append('vCodec', vCodec);

            const response = await fetch(this.converterEndpoint, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/x-www-form-urlencoded',
                    'key': apiKey,
                },
                body: params.toString()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.status === 'tunnel' && data.url) {
                return {
                    success: true,
                    downloadUrl: data.url,
                    filename: data.filename,
                    status: data.status
                };
            } else {
                return {
                    success: false,
                    error: data?.error || 'Conversion failed or invalid response',
                    raw: data
                };
            }

        } catch (error: any) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export const ytdl = new YouTubeDownloader();
