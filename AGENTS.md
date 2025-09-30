Date: 2025-09-30

# Agent Notes

## High-Level Overview
- Next.js 15 portfolio now defaults to an "OS mode" (`/os`) that mimics a desktop with draggable windows, Start menu, and taskbar.
- Content (About, Papers, Links, Projects) is served through Supabase-backed mini apps; legacy static pages have been retired.
- Python automation (`db_manager.py`) keeps Supabase in sync with curated markdown sources.

## Phase Recap
- **Phase 1 – OS Shell**: Added `/os` route, window manager, desktop icons, Start menu, taskbar, and mini apps for About/Papers/Links/Projects. Replaced legacy header with OS entry point.
- **Phase 2 – Data & UX Hardening**: Centralized Supabase client, added shared loading/error UI, persisted window layouts (versioned), improved accessibility, mobile ergonomics, and reduced-motion support. Home redirects to `/os`; theme toggle moved into taskbar.
- **Phase 3 – Polish** *(current)*: Introduced Settings app, wallpaper presets (Aurora, Cyberwave, Matrix), accent-driven taskbar/window styling, and preference persistence (theme + wallpaper). Build verified via `npm run build`.

## Current Directory Structure
```
/
├── app/
│   ├── api/
│   │   └── keepalive/       # Supabase keep-alive route (server key safe)
│   ├── os/                  # OS desktop route + window manager
│   ├── ThemeContext.tsx     # Theme provider with local storage sync
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Landing page redirecting into /os
├── components/
│   ├── os/
│   │   ├── Desktop.tsx      # Wallpaper + icon grid
│   │   ├── Taskbar.tsx      # Start, running apps, theme toggle
│   │   ├── StartMenu.tsx
│   │   ├── Window.tsx       # Draggable/resizable shell
│   │   ├── types.ts
│   │   ├── utils.ts         # Shared helpers (e.g., hexToRgba)
│   │   ├── wallpapers.ts
│   │   └── apps/            # Mini app surfaces (About, Papers, Links, Projects, Settings)
│   └── ui/DataState.tsx     # Loading/empty/error helper
├── lib/supabaseClient.ts    # Reusable browser Supabase client
├── db_manager.py            # Python automation layer for Supabase
├── public/                  # Static assets
├── package.json
└── README.md
```

## Operational Notes
- Environment: expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_KEY` for client fetches; service key stays server-side in API routes.
- Local storage key `terminal-os/state` (version 2) stores window layout + preferences with legacy migration from `terminal-os/windows`.
- Wallpapers drive accent color shared across desktop, taskbar, window chrome, and Settings UI.

## Next Steps
1. Refresh browserslist data (`npx update-browserslist-db@latest`) and rerun lint.
2. Cross-device QA for wallpapers/accent contrast and reduced-motion behavior; tweak token values if needed.
3. Consider Phase 3 extras: File Explorer/search window, richer theming presets, and optional lazy-loading for Supabase panes.
