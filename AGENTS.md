Date: 2025-07-16

## Site Overview:
This project is a modern personal portfolio website built with Next.js, React, TypeScript, and Tailwind CSS. It features a terminal-inspired design and uses a Supabase database to manage and display curated lists of academic papers and AI-related links. The site is designed to be responsive, themeable (dark/light mode), and includes real-time search functionality.

## To-Do's:
- [x] **UI/UX Overhaul**: Redesigned the entire site with a terminal-inspired aesthetic.
- [x] **Navigation System**: Implemented a new fixed horizontal header with a theme toggle and hamburger menu.
- [x] **Theme Implementation**: Created a global dark/light theme system using React Context and localStorage.
- [x] **Content Pages**: Modernized the Papers, Links, Projects, and Blogs pages with consistent theming and layout.
- [x] **Profile Picture**: Added a dynamic profile picture with a hover effect.
- [x] **Papers DB Automation**: Migrated 22 academic papers from Markdown to Supabase and created a Python parsing script.
- [x] **Links DB Curation**: Preserved 8 high-value links while migrating 32 new links from a Markdown table, creating a new parsing script.
- [x] **Markdown Links Migration**: Developed a script to parse individual Markdown files in the `links/` directory and upload them to the database, replacing existing links with curated content.

## Notes:
##### Overview:
The project evolved from a basic portfolio into a polished, terminal-themed website. The initial focus was on a complete UI/UX redesign, establishing a consistent and modern navigation system and a persistent theme. Subsequent efforts focused on backend data management, creating Python scripts to automate the process of parsing local Markdown files (`papers-list.md`, `links-list-2.md`) and populating the Supabase database for the "Papers" and "Links" sections.
Afterwards, streamlined the project by creating a unified `db_manager.py` script to handle all database operations, replacing individual parsing scripts.

##### Key Steps:
*1. Frontend Development (Next.js & React):*
- **UI/UX**: The homepage was redesigned with terminal-style sections (`WHOAMI`, `BLOG`, etc.).
- **Navigation**: A fixed horizontal `HeaderNav.tsx` component was created, replacing a problematic vertical navigation bar. It includes a theme toggle and a functional hamburger menu.
- **Theming**: A `ThemeContext.tsx` was implemented to provide global state for the light/dark theme, with persistence in `localStorage`. All pages were updated to consume this context.
- **Layout**: Consistent padding (`pt-24`) was applied to all pages to account for the fixed header.

*2. Backend & Automation (Python & Supabase):*
- **Paper Parsing**: A script, `parse_papers.py`, was developed to read structured Markdown, extract fields (Title, Authors, Date, etc.) using regex, and batch-insert them into the Supabase `papers` table.
- **Link Parsing & Curation**: A second script, `parse_links_2.py`, was created to handle a more complex migration. It selectively preserves specific high-value links, deletes the rest, and then parses a Markdown table to insert 32 new curated links.
- **Database Interaction**: The Python scripts use the `supabase-py` library to connect to the database, leveraging credentials from a `.env.local` file.

##### Directory Structure:
```
/
├── app/                  # Next.js main application directory
│   ├── api/              # API routes
│   ├── blogs/            # Blog page
│   ├── links/            # Links page
│   ├── papers/           # Papers page
│   ├── projects/         # Projects page
│   ├── globals.css       # Global styles
│   ├── HeaderNav.tsx     # Main navigation component
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── ThemeContext.tsx  # Theme management
├── public/               # Static assets
│   ├── profile.jpg
│   └── warrior.webp
├── db_manager.py         # Unified database management module
├── package.json          # Project dependencies
└── tailwind.config.js    # Tailwind CSS configuration
```

## Things To Know:
- **Tech Stack**: Next.js 14, React, TypeScript, Tailwind CSS, Supabase, Python.
- **Styling**: The terminal aesthetic is achieved with the "IBM Plex Mono" font and custom Tailwind CSS configurations.
- **State Management**: Global theme state is managed via React Context (`ThemeContext.tsx`).
- **Data Flow**: The frontend fetches data directly from the Supabase database, which is populated by the Python automation scripts.
- **Automation**: Data management is handled by Python scripts (`parse_links_md.py`) that parse local Markdown files, with `db_manager.py` providing unified database operations.

## Troubleshooting:

##### Session 1: UI/UX Overhaul
- **Feature Change**: Redesigned navigation to a fixed horizontal header.
- **Error**: The new fixed navigation bar overlapped the main content on all pages.
- **Solution**: Applied a top padding class (`pt-24`) to all page containers to offset the header's height.

- **Feature Change**: Implemented a global theme system.
- **Error**: The theme did not persist when navigating between pages.
- **Solution**: Ensured the `useTheme()` hook was called in every page component, providing access to the global theme context.

- **Feature Change**: Styled the search bars on the Papers/Links pages.
- **Error**: Search bars had hardcoded styles and did not adapt to the new theme.
- **Solution**: Replaced old CSS classes with dynamic Tailwind CSS classes that change based on the current theme state.

##### Session 2: Papers Database Update
- **Feature Change**: Created a Python script (`parse_papers.py`) to automate paper ingestion.
- **Error**: No major errors occurred. The script was designed to handle "Unavailable" data fields and ensure compatibility with the existing Supabase schema.
- **Process**: The script successfully parsed 22 papers from `notes/papers-list.md` and inserted them into the database.

##### Session 3: Links Database Update
- **Feature Change**: Created a Python script (`parse_links_2.py`) to curate and update the links database.
- **Error**: A Supabase UUID type constraint error occurred when trying to perform bulk deletion operations using integer comparisons.
- **Solution**: The script was modified to fetch the actual UUIDs of the records to be deleted and then remove them individually, avoiding the type conflict.

- **Feature Change**: Parsing a complex Markdown table.
- **Error**: The table contained escaped characters (`\-`, `\_`) and inconsistent formatting.
- **Solution**: The parsing logic was made more robust to handle character cleanup and field validation, ensuring data integrity.

##### Session 4: db Manager Script
- **Feature Change**: Created a Python script (`db_manager.py`) to manage the database.
- **Error**: No major errors occurred. Just making a module parsing script for easy access tot the database.
- **Process**: The script successfully replaces all previous specific parsing scripts with a single module that can be use to handle all CRUD operations for both the links and papers tables.

##### Session 5: Markdown Links Migration
- **Feature Change**: Created a new Python script (`parse_links_md.py`) to parse individual markdown files from the `links/` directory and upload them to the database.
- **Challenge**: The script initially required the `yaml` library which wasn't available in the current environment.
- **Solution**: Implemented a custom frontmatter parser that manually parses YAML-like frontmatter without external dependencies, handling key-value pairs and arrays.
- **Process**: Successfully parsed 27 markdown files from the `links/` directory, each containing structured frontmatter (title, url, date, authors, tags) and content sections (description, additional notes). The script cleared 40 existing links and uploaded 27 new curated links to replace them completely.
- **Result**: The links database now contains only the user's curated collection of 27 AI-related articles and resources, parsed from individual markdown files with rich metadata.

##### Session 6: Project Cleanup
- **Feature Change**: Cleaned up the project directory.
- **Process**: Removed obsolete notes, analysis files, screenshots, and the `links` directory containing individual markdown files, as they have been migrated to the database. Updated project documentation to reflect the new structure.
- **Result**: The project is now streamlined, with all relevant data managed through `db_manager.py` and the Supabase database and accessible via the Next.js frontend.

---

# OS Mode Plan (Grounded) — 2025-09-29

This section captures the current repo state and a concrete, dependency‑free plan to add a Windows‑style “OS mode” (`/os`) inspired by ryo.lu and Dustin Brett. It incorporates the earlier ChatGPT response, fixes identified issues, and lists exact files to add/update so a future agent can continue seamlessly.

## Current State (Repo on 2025-09-29)
- No `/os` route or `components/os/*` folder yet.
- `app/HeaderNav.tsx` lacks an “OS” nav item and uses a hover‑only menu (limited a11y/touch).
- Theme system via `app/ThemeContext.tsx` is in place; pages add `pt-24` to clear fixed header.
- Supabase reads are duplicated in `app/papers/page.tsx` and `app/links/page.tsx`; no shared client.
- `app/globals.css` applies a global starry background animation that could clash with a full‑screen OS desktop.
- `app/api/keepalive/route.tsx` uses server‑side service key correctly; ensure service key never leaks to client.

## Source: ChatGPT OS‑Mode Skeleton (to adopt and correct)
- “Zero new deps, Tailwind only.” Desktop, Taskbar, Start Menu, custom draggable/resizable `Window` component.
- Mini apps: About, Papers (Supabase), Links (Supabase), Projects.
- File tree to add (kept, see below) with a critical correction: fix `onResize` handler bug.

## Files To Add (Phase 1)
- `app/os/page.tsx` — OS shell (window manager state, desktop, taskbar, start menu, app mounting).
- `components/os/Window.tsx` — draggable + resizable window (no external libs).
- `components/os/Desktop.tsx` — wallpaper + icon grid.
- `components/os/Taskbar.tsx` — Start, running apps, quick launch, clock.
- `components/os/StartMenu.tsx` — simple launcher.
- `components/os/apps/AboutApp.tsx`
- `components/os/apps/PapersApp.tsx` — lists `papers` from Supabase.
- `components/os/apps/LinksApp.tsx` — lists `links` from Supabase.
- `components/os/apps/ProjectsApp.tsx`

Planned Phase 2 additions:
- `lib/supabaseClient.ts` — shared client for all data readers.
- `components/ui/DataState.tsx` — tiny component for Loading/Empty/Error consistent UI.

## Updates To Existing Files
- `app/HeaderNav.tsx`
  - Add `{ label: 'os', href: '/os' }` to `navItems`.
  - Replace hover‑only dropdown with a button toggle: add `aria-expanded`, `aria-controls`, Escape to close, outside‑click handling, and keyboard nav (ArrowUp/Down, Enter). Keep hover as an enhancement only.
- `app/globals.css`
  - Scope starry background so `/os` can own its wallpaper. Two approaches:
    - Add a route/body class (e.g., `.site-mode`) and apply animation to `.site-mode` only; set `/os` to `.os-mode`.
    - Or ensure OS desktop container is full‑bleed and visually occludes the star animation.
- `app/papers/page.tsx`, `app/links/page.tsx`
  - Phase 2: import `lib/supabaseClient.ts`, unify error/loading/empty handling with `DataState`.
- `app/layout.tsx`
  - Optional: inject a body class based on the current route to support the background scoping noted above.

## Critical Fix from ChatGPT Draft
In `app/os/page.tsx`, ensure resize preserves position. Use this form in the `Window` render:

```
onResize={(W, H) => updateBounds(w.id, w.x, w.y, W, H)}
```

Do NOT use the broken form `updateBounds(w.id, w[w.length-1], h[h.length-1])` from the draft.

## Implementation Phases

### Phase 1 — Ship OS Mode (no new deps)
- Add the route and components listed above.
- Wire window manager: open/focus/minimize/close, z‑index, single instance per app.
- Desktop icons double‑click → open apps; Start Menu and Taskbar → open/focus/minimize.
- Basic a11y: `role="dialog"` on windows, `aria-label` for titles, focus ring on activation. Start menu closes on Escape and outside click.
- Header: add “OS” link; convert menu to accessible button.

Acceptance criteria
- Visit `/os` to see desktop + taskbar; About/Papers/Links/Projects open and render.
- Drag and resize work within viewport; minimize/restore via taskbar works.
- Resize preserves position; no console errors.
- Header shows “OS” and menu works with keyboard and touch.

### Phase 2 — Data + UX Hardening
- Extract shared Supabase client to `lib/supabaseClient.ts`.
- Add `DataState` for consistent loading/empty/error blocks.
- Persist window state (open apps + bounds) to `localStorage` with a simple versioned key.
- Mobile ergonomics: larger hit targets, optional resize disable under small widths, clamp to viewport.
- A11y polish: Tab cycle within active window content; `aria-live` for minimize/restore announcements.

### Phase 3 — Fit and Finish
- Visual: subtle acrylic blur on taskbar, refined window controls, curated wallpapers.
- Performance: respect `prefers-reduced-motion`; lazy‑load app panes after first open; guard star animation.
- Optional File Explorer: virtual folders mapping to Papers/Links (read‑only), quick search.

## Supabase & Env Vars
- Client keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY` (already used by pages and will be reused by OS apps).
- Server key: `SUPABASE_SERVICE_ROLE_KEY` must remain server‑only (e.g., API routes). Do not import into client bundles.

## Risks & Mitigations
- Service key leak — verify only server code references `SUPABASE_SERVICE_ROLE_KEY`.
- Drag/resize on mobile — increase hit areas, clamp bounds, optionally disable resize on narrow viewports.
- Global CSS collisions — scope starry background or ensure OS desktop fully overlays it.

## Testing Checklist
- Desktop: Chrome/Safari/Firefox — open/drag/resize/minimize/restore; Start menu keyboard navigation; tab order in windows.
- Mobile Safari/Chrome — open/drag, prevent accidental drag during scroll; menu touch targets.
- Lighthouse quick pass and reduced‑motion behavior.

## License Notes (re: references)
- Dustin Brett’s daedalOS is MIT — attribute if borrowing code.
- Ryo’s ryOS is AGPL‑3 — do not copy code unless comfortable with AGPL obligations. We are implementing cleanroom components.

## Next Actions
1) Implement Phase 1 file adds and header update.
2) Verify `/os` acceptance criteria.
3) Extract shared Supabase client and add `DataState` (Phase 2).
4) Add persistence + mobile a11y tweaks (Phase 2).
5) Optional visual polish/File Explorer (Phase 3).

Owner’s note: This plan is grounded against the repo state on 2025-09-29 and the ChatGPT OS‑mode draft. Follow the file list and acceptance criteria above to continue work.

---

### Update — 2025-09-29 (Phase 1 Complete)
- Implemented the `/os` desktop route with window manager, Start menu, taskbar, and desktop icon grid (app/os/page.tsx; components/os/*).
- Added mini apps for About, Papers, Links, Projects; Papers/Links windows query Supabase using existing public env keys and handle missing credentials gracefully.
- Built a shared `AppId` type and pointer-driven drag/resize window component; resize callback now calls `updateBounds(id, x, y, width, height)` to preserve position.
- Replaced the hamburger hover menu with an accessible toggle (button + `aria-expanded`, Escape/blur handling, keyboard navigation) and surfaced the new OS link (app/HeaderNav.tsx).
- Verified Phase 1 via `npm run build`; Next.js 15.1.3 build succeeded (static `/os` output ≈5.4 kB, first-load JS 149 kB).

#### Outstanding QA for Phase 1
- Manual browser sweep (desktop + touch) to confirm drag/resize bounds, minimize/restore cycles, and Start menu focus order.
- Check for reduced-motion preference handling (desktop animation currently disabled; follow-up needed).

#### Next Actions (post-Phase 1)
1. Extract shared Supabase client (`lib/supabaseClient.ts`) and swap Papers/Links (pages + OS apps) to reuse it.
2. Add `components/ui/DataState.tsx` (Loading/Empty/Error) and adopt across Papers/Links pages + OS apps.
3. Persist window state to `localStorage` with versioning; clamp positions for narrow viewports and consider disabling resize <640px.
4. Mobile & accessibility polish: larger hit targets, ensure touch drag doesn’t conflict with scroll, add `aria-live` announcements for minimize/restore.
5. Visual polish: taskbar blur/theming options, optional alternate wallpapers, reduced-motion handling.
6. Optional Phase 3: File Explorer app surfacing Supabase content, plus quick search.

#### References
- Acceptance criteria from “Phase 1 — Ship OS Mode” are now satisfied (desktop renders, windows focus/minimize/resize, header link live). Phase 2+ items remain open.
