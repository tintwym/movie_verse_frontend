# Movie Verse Frontend

React single-page app for **MovieVerse**, built with **Vite** and **React 17**. State uses **Redux** and **redux-saga**; styling includes **Sass** and shared UI libraries (see `package.json`).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm or yarn

## Install and run

```bash
cd movie_verse_frontend
npm install
npm run dev
```

The dev server URL is printed in the terminal (Vite defaults apply unless overridden in `vite.config.js`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build to `dist/` |
| `npm run serve` | Preview the production build (`vite preview`) |

## Environment variables

Create a `.env` file in this directory (do **not** commit real API keys). Vite exposes only variables prefixed with `VITE_`:

| Variable | Purpose |
|----------|---------|
| `VITE_BACKEND_URL` | Base URL for the Spring backend API |
| `VITE_TMDB_KEY` | [TMDB](https://www.themoviedb.org/) API key |
| `VITE_TMDB_TOKEN` | TMDB read access JWT, if your code uses bearer auth |

See `.env.example` for placeholders. Use your own TMDB credentials from the TMDB developer dashboard.

## Docker

A `Dockerfile` and `nginx.conf` are included for containerized deployment of the built static assets.

## Source layout

- `src/` — application code (`@app` → `src` via `vite.config.js`)

This project is part of the **Movie Verse** workspace; see the root `README.md` for sibling services (Android, Spring Boot, ML).

Additional team notes may appear in [`ReadMe.md`](ReadMe.md).
