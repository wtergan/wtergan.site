'use client'

export default function ProjectsApp() {
  return (
    <div className="space-y-3 text-sm">
      <p className="opacity-80">
        Project breakdowns will live directly inside this window going forward. The legacy `/projects` page has been
        retired, so the OS is now the single source of truth.
      </p>
      <p className="opacity-80">
        Short term: surface a curated list of current builds with quick context and live demos. Longer term: hook this
        into Supabase so projects share the same filtering/search experience as Papers and Links.
      </p>
      <p className="text-xs opacity-60">Future idea: filter by status (shipping, in-progress, archived) and stack.</p>
    </div>
  )
}
