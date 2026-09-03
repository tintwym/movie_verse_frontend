# MovieVerse Web

Modern **Next.js 16 + React 19 + TypeScript** frontend for MovieVerse with a renewed cinematic UI.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **API:** TMDB + Spring Boot backend

## Getting Started

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_TMDB_API_KEY and NEXT_PUBLIC_BACKEND_URL

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Spring Boot API (default `http://localhost:8080`) |
| `NEXT_PUBLIC_TMDB_API_KEY` | TMDB API key (**required for movies to load**) |
| `NEXT_PUBLIC_TMDB_TOKEN` | TMDB bearer token (optional) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for Open Graph (e.g. `https://your-app.vercel.app`) |

## Deploy (Vercel)

1. Import `movie_verse_frontend` and set **Production Branch** to the branch you push (`development_v1` or `main`).
2. In **Settings → Environment Variables**, add for Production (and Preview):

```
NEXT_PUBLIC_TMDB_API_KEY=your_real_tmdb_key
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

3. Redeploy. `NEXT_PUBLIC_*` vars are baked in at **build** time — set them before building.

Build should succeed even without the TMDB key (empty catalog). Without the key in env, the live site will show no movies.

## Features

- Hero banner with featured movie
- Browse: trending, popular, top rated, upcoming, discover
- Movie detail with favorites, watched, reviews, ratings
- Search movies & browse people
- Auth: login, register with genre selection, forgot password
- Personalized recommendations by genre
- Profile with stats
- Notifications, actor follow, TV season tracker, admin dashboard

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## License

ISS GDipSA 50 Team 8
