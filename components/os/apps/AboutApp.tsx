'use client'

import Link from 'next/link'

export default function AboutApp() {
  return (
    <div className="space-y-3 text-sm">
      <h2 className="text-base font-semibold">Hey, I’m Will — SWE & indie ML researcher.</h2>
      <p className="opacity-80">
        This experimental desktop mode mirrors the projects, papers, and links that power my portfolio.
        Explore the windows or jump back to the traditional pages below.
      </p>
      <ul className="space-y-1">
        <li>
          <Link href="/projects" className="underline hover:text-blue-400">
            Projects directory
          </Link>
        </li>
        <li>
          <Link href="/papers" className="underline hover:text-blue-400">
            Papers library
          </Link>
        </li>
        <li>
          <Link href="/links" className="underline hover:text-blue-400">
            Curated links
          </Link>
        </li>
      </ul>
      <p className="text-xs opacity-60">Tip: Use the Start menu or desktop icons to launch additional apps.</p>
    </div>
  )
}
