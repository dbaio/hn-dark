# HN Dark - Project Notes

## Overview

Dark mode frontend for reading Hacker News.

## Setup

The dev server runs on port 5173 by default.

Commands:
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
hn-dark/
├── src/
│   ├── components/
│   │   ├── Comment.jsx
│   │   ├── Loading.jsx
│   │   ├── Navigation.jsx
│   │   ├── Pagination.jsx
│   │   └── Post.jsx
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Comments.jsx
│   │   ├── ItemDetail.jsx
│   │   ├── Past.jsx
│   │   └── StoryList.jsx
│   ├── services/
│   │   └── hnApi.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── README.md
```

## Features

- Dark theme with slate color palette
- Multiple content views
- Pagination
- Threaded comments
- Mobile responsive

## API

Uses official Hacker News API endpoints:
- topstories.json
- newstories.json
- beststories.json
- askstories.json
- showstories.json
- jobstories.json
- item/{id}.json

## Read-Only

This is a read-only interface. No login, posting, or voting functionality.
