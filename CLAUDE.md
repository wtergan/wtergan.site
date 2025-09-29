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
