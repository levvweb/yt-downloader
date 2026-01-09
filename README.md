# YTDL - YouTube Downloader

Aplikasi web untuk mengunduh video YouTube ke format MP3 atau MP4 dengan kualitas tinggi.

## Fitur

- Konversi ke MP3 (320kbps)
- Konversi ke MP4 (1080p)
- Mendukung youtube.com, youtu.be, dan YouTube Shorts
- Tampilkan thumbnail video
- UI responsif untuk mobile dan desktop
- Animasi smooth dengan GSAP

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- GSAP

## Struktur Project

```
project-ytdl/
├── public/
│   ├── favicon.svg
│   └── grid.svg
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── ytdl.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── vercel.json
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build untuk production
npm run build
```

## Deployment

Project ini dikonfigurasi untuk deploy di Vercel. Cukup connect repo GitHub ke Vercel dan deploy otomatis.

## Catatan

Aplikasi ini hanya untuk penggunaan pribadi. Pastikan untuk menghormati hak cipta konten yang diunduh.
