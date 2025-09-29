'use client'

import { useEffect, useRef } from 'react'
import type { AppId } from './types'

interface StartMenuProps {
  isDark: boolean
  onSelect: (appId: AppId) => void
  onClose: () => void
}

export default function StartMenu({ isDark, onSelect, onClose }: StartMenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    const handlePointer = (event: MouseEvent | PointerEvent) => {
      if (!panelRef.current) return
      if (panelRef.current.contains(event.target as Node)) return
      onClose()
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('pointerdown', handlePointer)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('pointerdown', handlePointer)
    }
  }, [onClose])

  const items: { appId: AppId; label: string; hint?: string }[] = [
    { appId: 'about', label: 'About Me' },
    { appId: 'papers', label: 'Papers', hint: 'Supabase' },
    { appId: 'links', label: 'Links', hint: 'Supabase' },
    { appId: 'projects', label: 'Projects' },
  ]

  return (
    <div className="fixed inset-0" aria-hidden>
      <div
        ref={panelRef}
        className={`absolute bottom-12 left-3 w-72 overflow-hidden rounded-md border shadow-2xl ${
          isDark ? 'border-white/10 bg-[#101010]/95 text-white/85' : 'border-black/10 bg-white/95 text-slate-800'
        }`}
      >
        <div className={`px-3 py-2 text-[11px] uppercase tracking-wide ${isDark ? 'bg-white/5 text-white/60' : 'bg-slate-100 text-slate-500'}`}>
          All Apps
        </div>
        <ul className="max-h-96 overflow-auto p-2">
          {items.map(item => (
            <li key={item.appId}>
              <button
                type="button"
                onClick={() => {
                  onSelect(item.appId)
                  onClose()
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                  isDark
                    ? 'hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70'
                    : 'hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400'
                }`}
              >
                <span>{item.label}</span>
                {item.hint && <span className="text-[10px] uppercase tracking-wide opacity-60">{item.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
