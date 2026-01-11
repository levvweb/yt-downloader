import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cn } from './lib/utils';
import { Link2, Music2, Video, Download, Play, RotateCcw, Github, ChevronDown } from 'lucide-react';
import { ytdl } from './lib/ytdl';

const getYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (url: string): string | null => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
};

const VIDEO_QUALITIES = [
  { value: '360', label: '360p' },
  { value: '480', label: '480p' },
  { value: '720', label: '720p HD' },
  { value: '1080', label: '1080p FHD' },
];

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [format, setFormat] = useState<'mp3' | 'video'>('mp3');
  const [quality, setQuality] = useState('720');

  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(heroRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(cardRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo(statsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.2');

    if (underlineRef.current) {
      gsap.fromTo(underlineRef.current,
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [result]);

  const handleConvert = async () => {
    if (!url) {
      setError('Masukkan link YouTube');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const fmt = format === 'mp3' ? 'mp3' : quality;
      const res = await ytdl.convert(url, { format: fmt });
      if (res.success) {
        setResult(res);
      } else {
        setError(res.error || 'Gagal mengkonversi');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (resultRef.current) {
      gsap.to(resultRef.current, {
        opacity: 0, y: -10, duration: 0.2,
        onComplete: () => { setUrl(''); setResult(null); setError(''); }
      });
    } else {
      setUrl(''); setResult(null); setError('');
    }
  };

  const isLocked = result !== null || loading;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-white/5">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-1.5">
              <Play className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="text-lg font-bold">YTDL</span>
          </div>
          <a href="https://github.com/levvweb/yt-downloader" target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div ref={heroRef} className="text-center mb-8 opacity-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Unduh Video{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">YouTube</span>
              <svg className="absolute -bottom-1 left-0 w-full h-4" viewBox="0 0 120 16" preserveAspectRatio="none" fill="none">
                <defs>
                  <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                    <stop offset="15%" stopColor="#ef4444" stopOpacity="1" />
                    <stop offset="85%" stopColor="#dc2626" stopOpacity="1" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path ref={underlineRef} d="M2 10 C20 4, 35 14, 60 8 S100 12, 118 6" stroke="url(#brushGradient)"
                  strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" strokeDashoffset="200" opacity="0" />
              </svg>
            </span>
          </h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">Konversi ke MP3 atau MP4 dengan kualitas tinggi. Cepat dan gratis.</p>
        </div>

        <div ref={cardRef} className="max-w-xl mx-auto opacity-0">
          <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
            <div className="relative mb-2">
              <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 transition-colors", url ? "text-red-400" : "text-white/30")}>
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <input type="text" placeholder="Tempel link YouTube..." value={url} onChange={(e) => setUrl(e.target.value)} disabled={isLocked}
                className={cn("w-full h-10 pl-9 pr-3 bg-[#272727] rounded-md text-sm border border-white/5 outline-none transition-colors",
                  "placeholder:text-white/30 focus:border-red-500/50", isLocked && "opacity-50 cursor-not-allowed")} />
            </div>

            <div className="flex gap-1.5">
              <div className={cn("flex flex-1 bg-[#272727] rounded-md p-0.5", isLocked && "opacity-50")}>
                <button onClick={() => !isLocked && setFormat('mp3')} disabled={isLocked}
                  className={cn("flex-1 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1",
                    format === 'mp3' ? "bg-red-600 text-white" : "text-white/50", isLocked && "cursor-not-allowed")}>
                  <Music2 className="w-3 h-3" />MP3
                </button>
                <button onClick={() => !isLocked && setFormat('video')} disabled={isLocked}
                  className={cn("flex-1 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1",
                    format === 'video' ? "bg-red-600 text-white" : "text-white/50", isLocked && "cursor-not-allowed")}>
                  <Video className="w-3 h-3" />MP4
                </button>
              </div>

              {format === 'video' && (
                <div className={cn("relative", isLocked && "opacity-50")}>
                  <select value={quality} onChange={(e) => setQuality(e.target.value)} disabled={isLocked}
                    className="h-full px-2 pr-6 bg-[#272727] rounded-md text-xs border border-white/5 outline-none appearance-none cursor-pointer">
                    {VIDEO_QUALITIES.map((q) => (<option key={q.value} value={q.value}>{q.label}</option>))}
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/50 pointer-events-none" />
                </div>
              )}

              {result ? (
                <button onClick={handleClear} className="px-3 py-2 rounded-md text-xs font-semibold bg-[#272727] hover:bg-[#333] text-white flex items-center gap-1 transition-colors">
                  <RotateCcw className="w-3 h-3" />
                </button>
              ) : (
                <button onClick={handleConvert} disabled={loading}
                  className={cn("px-4 py-2 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors", loading && "opacity-70 cursor-not-allowed")}>
                  {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Konversi"}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">{error}</div>
          )}

          {result && (
            <div ref={resultRef} className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/10">
              {(result.thumbnail || getYouTubeThumbnail(url)) && (
                <div className="relative">
                  <img src={result.thumbnail || getYouTubeThumbnail(url)!} alt="Thumbnail" className="w-full h-32 sm:h-40 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-medium text-white">
                    {result.type === 'audio' ? <Music2 className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                    {result.quality}
                  </div>
                  {result.duration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-medium">{result.duration}</div>
                  )}
                </div>
              )}
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-xs sm:text-sm truncate">{result.title || result.filename || 'Siap Diunduh'}</p>
                    <p className="text-white/40 text-[10px] sm:text-xs mt-0.5">{result.type === 'audio' ? 'Audio MP3' : `Video ${result.quality}`}</p>
                  </div>
                  <button onClick={() => window.open(result.downloadUrl, '_blank')}
                    className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors">
                    <Download className="w-3.5 h-3.5" />Unduh
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={statsRef} className="mt-8 py-4 border-y border-white/5 opacity-0">
            <div className="flex items-center justify-center gap-4 sm:gap-12">
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-white">320<span className="text-red-500 text-sm sm:text-lg">kbps</span></p>
                <p className="text-[10px] sm:text-xs text-white/40">Audio</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-white">1080<span className="text-red-500 text-sm sm:text-lg">p</span></p>
                <p className="text-[10px] sm:text-xs text-white/40">Video</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-white">100<span className="text-red-500 text-sm sm:text-lg">%</span></p>
                <p className="text-[10px] sm:text-xs text-white/40">Gratis</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-white/30 text-xs">Mendukung:</span>
            <div className="flex items-center gap-2">
              <img src="https://api.deline.web.id/OOf7fsZpif.png" alt="YouTube" className="h-7 w-auto" />
              <div className="flex items-center gap-1">
                <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/youtube-shorts-icon.png" alt="YouTube Shorts" className="h-5 w-auto" />
                <span className="text-white/50 text-xs">Short</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-white/30 text-xs">
          YTDL &copy; 2026 • Hanya untuk penggunaan pribadi •{' '}
          <a href="https://github.com/levvweb/yt-downloader" target="_blank" rel="noopener noreferrer" className="text-white/50 underline hover:text-white transition-colors">Source</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
