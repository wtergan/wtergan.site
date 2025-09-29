'use client'

import Link from 'next/link'

export default function ProjectsApp() {
  return (
    <div className="space-y-3 text-sm">
      <p className="opacity-80">
        Projects live on the main site as long-form write-ups. Open the Projects page to browse everything or use the
        taskbar to keep this shortcut handy.
      </p>
      <Link href="/projects" className="inline-flex items-center gap-2 rounded-md bg-blue-500/90 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-blue-500">
        View /projects
      </Link>
      <p className="text-xs opacity-60">Future idea: add a dedicated Projects window with Supabase-backed filters.</p>
    </div>
  )
}
