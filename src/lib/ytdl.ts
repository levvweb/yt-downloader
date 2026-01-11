const FORMATS = {
    mp3: 'MP3 (Audio Only)',
    '144': '144p',
    '240': '240p',
    '360': '360p',
    '480': '480p',
    '720': '720p (HD)',
    '1080': '1080p (Full HD)'
};

function formatDuration(seconds: number): string {
    if (!seconds) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
        ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        : `${m}:${s.toString().padStart(2, '0')}`;
}

export class YouTubeDownloader {
    static FORMATS = FORMATS;

    async convert(youtubeUrl: string, options: { format?: string } = {}) {
        const format = options.format || 'mp3';

        try {
            const response = await fetch(`/api?url=${encodeURIComponent(youtubeUrl)}&format=${format}`);
            const data = await response.json();

            if (!data.status || data.code !== 200) {
                return {
                    success: false,
                    error: data.message || 'Gagal mengambil data'
                };
            }

            const r = data.result;
            return {
                success: true,
                title: r.title || 'Tanpa Judul',
                duration: formatDuration(r.duration),
                thumbnail: r.thumbnail,
                quality: r.quality || format.toUpperCase(),
                downloadUrl: r.download,
                filename: r.title || 'download',
                type: format === 'mp3' ? 'audio' : 'video',
                ext: format === 'mp3' ? 'mp3' : 'mp4'
            };

        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Terjadi kesalahan'
            };
        }
    }
}

export const ytdl = new YouTubeDownloader();
