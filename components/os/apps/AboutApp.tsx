'use client'

export default function AboutApp() {
  return (
    <div className="space-y-3 text-sm">
      <h2 className="text-base font-semibold">Hey, I’m Will — SWE & indie ML researcher.</h2>
      <p className="opacity-80">
        This experimental desktop is now the primary way to browse my work. Each window maps to the
        same Supabase-backed content that used to live on separate site pages.
      </p>
      <p className="opacity-80">
        Use the Start menu or desktop icons to launch apps like Papers, Links, and Projects. Your window layouts
        persist locally, so feel free to arrange the workspace however you want.
      </p>
      <p className="text-xs opacity-60">Tip: Right-click or long-press the desktop to discover upcoming shortcuts.</p>
    </div>
  )
}
