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
| `NEXT_PUBLIC_TMDB_API_KEY` | TMDB API key |
| `NEXT_PUBLIC_TMDB_TOKEN` | TMDB bearer token (optional) |

## Features

- Hero banner with featured movie
- Browse: trending, popular, top rated, upcoming, discover
- Movie detail with favorites, watched, reviews, ratings
- Search movies & browse people
- Auth: login, register with genre selection, forgot password
- Personalized recommendations by genre
- Profile with stats

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## License

ISS GDipSA 50 Team 8
