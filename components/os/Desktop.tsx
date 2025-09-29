'use client'

import { useMemo } from 'react'
import type { AppId } from './types'

interface DesktopProps {
  isDark: boolean
  onOpen: (app: AppId) => void
}

export default function Desktop({ isDark, onOpen }: DesktopProps) {
  const icons = useMemo(
    () => [
      { id: 'icon-about', label: 'About', appId: 'about' as AppId, emoji: '👤' },
      { id: 'icon-papers', label: 'Papers', appId: 'papers' as AppId, emoji: '📄' },
      { id: 'icon-links', label: 'Links', appId: 'links' as AppId, emoji: '🔗' },
      { id: 'icon-projects', label: 'Projects', appId: 'projects' as AppId, emoji: '🗂️' },
    ],
    [],
  )

  return (
    <div
      className={`pointer-events-none fixed inset-0 ${
        isDark
          ? 'bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1c1c1c] text-white'
          : 'bg-gradient-to-br from-[#e9f1ff] via-[#edf3ff] to-[#f6f7fb] text-slate-900'
      }`}
      style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(255,255,255,0.12) 0, transparent 55%)' }}
    >
      <ul className="pointer-events-auto grid w-[280px] gap-3 p-4 sm:w-[360px]">
        {icons.map(icon => (
          <li key={icon.id}>
            <button
              type="button"
              className={`group flex h-24 w-24 flex-col items-center justify-center rounded-md border text-xs transition ${
                isDark
                  ? 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400'
                  : 'border-black/10 bg-white/70 text-slate-700 hover:border-blue-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500'
              }`}
              onDoubleClick={() => onOpen(icon.appId)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpen(icon.appId)
                }
              }}
              onClick={event => {
                // Allow single tap on touch devices to open apps.
                if (event.detail === 1 && window.matchMedia('(pointer: coarse)').matches) {
                  onOpen(icon.appId)
                }
              }}
            >
              <span className="text-2xl" aria-hidden>
                {icon.emoji}
              </span>
              <span className="mt-2 px-1 text-center text-[11px] font-medium">{icon.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
