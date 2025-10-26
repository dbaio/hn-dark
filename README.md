# HN Dark

Dark mode interface for Hacker News.

## Features

- Dark theme with comfortable contrast
- All HN sections: Top, New, Best, Ask, Show, Jobs
- Threaded comment display
- Pagination on all pages
- Responsive layout
- Uses Hacker News API

## Installation

```bash
git clone https://github.com/dbaio/hn-dark.git
cd hn-dark
npm install
npm run dev
```

Visit http://localhost:5173

## Build

Build for production:

```bash
npm run build
```

This creates an optimized `dist/` directory with all static assets.

Preview the production build locally:

```bash
npm run preview
```

The output can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## Tech

- React
- Vite
- TailwindCSS
- React Router
- Hacker News API

## License

BSD 2-Clause License
