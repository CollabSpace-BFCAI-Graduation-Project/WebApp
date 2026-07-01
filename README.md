# CollabSpace

A browser-based 3D virtual collaboration platform. Teams can create and join virtual spaces with real-time chat, file sharing, and 3D collaboration via Unity WebGL.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (base-mira) |
| Animations | Motion (Framer Motion successor) |
| State | Zustand 5 + TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| Real-time | SignalR (`/chathub`) |
| HTTP | Axios (custom `api-client` wrapper) |
| Backend | .NET 8 + SignalR + PostgreSQL |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/               # Next.js App Router pages & layouts
│   ├── (auth)/        # Login & Register
│   ├── (landing)/     # Marketing / root landing page
│   └── (dashboard)/   # Dashboard, Spaces, Chat, Team, Settings
├── components/
│   ├── ui/            # shadcn/ui primitives (50+)
│   ├── shared/        # Reusable components
│   └── layout/        # App sidebar & layout
├── features/          # Feature modules
│   ├── auth/          # Auth forms, schemas, API calls
│   ├── spaces/        # Spaces CRUD, details, invites
│   ├── chat/          # Real-time messaging
│   ├── team/          # Team management
│   ├── notifications/ # Notifications & invites
│   └── settings/      # User settings
├── store/             # Zustand stores (auth, notifications, etc.)
├── context/           # Theme, Query, Breadcrumb providers
└── lib/               # API client, utilities, types
```

## API

Base URL: `http://collabspace-dev.runasp.net`

Interactive docs: [http://collabspace-dev.runasp.net/scalar/](http://collabspace-dev.runasp.net/scalar/)

## Available Commands

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Features

- **Auth** — Login and registration with JWT + refresh token
- **Dashboard** — Spaces overview with stats and recent activity
- **Spaces** — Create, browse, and manage 3D collaboration spaces with file sharing and member invites
- **Chat** — Real-time messaging via SignalR with per-space channels
- **Team** — Team member management
- **Notifications** — Real-time notifications and invite handling
- **Settings** — Profile editing and preferences

## Theme

Supports light/dark mode (via `next-themes`) with configurable accent colors (orange, lime, indigo, yellow, purple).
