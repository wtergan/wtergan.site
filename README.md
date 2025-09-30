# Terminal OS Portfolio

A Next.js 15 personal site that boots directly into a windowed “OS mode.” The desktop hosts Supabase-backed mini apps for About, Papers, Links, and Projects, while Python tooling keeps the content curated from local markdown.

## Features
- **Desktop UI**: Drag-and-resize windows, Start menu, taskbar with live clock, and persistent layouts via localStorage.
- **Theming**: Global light/dark toggle plus accent-driven wallpapers (Aurora, Cyberwave, Matrix) managed through a Settings app.
- **Realtime Content**: Papers and Links read from Supabase using a shared browser client and consistent loading/error states.
- **Automation**: `db_manager.py` and companion scripts parse markdown exports and push updates into Supabase.

## Tech Stack
- Next.js 15 (App Router) · React · TypeScript
- Tailwind CSS for styling and animation fallbacks
- Supabase (PostgreSQL + Auth) via `@supabase/supabase-js`
- Python 3 tooling for database ingestion

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment** – create `.env.local` with:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=... # used by server-side routes only
   ```
3. **Run the desktop**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 to auto-redirect into `/os`.

## Scripts
- `npm run dev` – local development server
- `npm run build` – production build check (used after Phase 3 polish)
- `npm run lint` – optional lint/type check (run after refreshing Browserslist data)

## Data Automation
Use `db_manager.py` to sync curated markdown into Supabase. The script expects Supabase credentials in `.env.local` and supports CRUD helpers shared by the older parsing scripts.

## Project Structure
```
app/
  api/keepalive/        # Supabase keepalive route (server key safe)
  os/                   # Desktop UI state + window manager
  ThemeContext.tsx
  layout.tsx
  page.tsx              # Redirect into /os
components/
  os/                   # Desktop, taskbar, window shell, mini apps, presets
  ui/DataState.tsx      # Loading/empty/error helper
lib/
  supabaseClient.ts     # Shared browser client factory
public/
  ...
```

## Next Steps
- Update Browserslist data (`npx update-browserslist-db@latest`) before the next release build.
- QA wallpapers, reduced-motion behavior, and touch ergonomics on real devices.
- Explore optional Phase 3 additions: File Explorer/search window, richer wallpaper presets, Supabase lazy loading.

---
Built with ❤️, caffeine, and way too many draggable divs.
