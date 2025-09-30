'use client'

import { useEffect, useState } from 'react'
import type { AppId } from './types'
import { hexToRgba } from './utils'

type RunningWindow = {
  id: string
  title: string
  minimized: boolean
}

type TaskbarProps = {
  isDark: boolean
  accentColor: string
  runningWindows: RunningWindow[]
  apps: { appId: AppId; label: string }[]
  onToggleStart: () => void
  onToggleTheme: () => void
  onTaskClick: (id: string) => void
  onQuickLaunch: (appId: AppId) => void
}

export default function Taskbar({
  isDark,
  accentColor,
  runningWindows,
  apps,
  onToggleStart,
  onToggleTheme,
  onTaskClick,
  onQuickLaunch,
}: TaskbarProps) {
  const [time, setTime] = useState<string>('')
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)
  const accent = accentColor || (isDark ? '#38bdf8' : '#2563eb')
  const accentGlow = hexToRgba(accent, 0.28)
  const accentSurface = hexToRgba(accent, isDark ? 0.45 : 0.6)
  const startSizing = isCoarsePointer ? 'px-5 py-2.5 text-sm' : 'px-4 py-1.5 text-sm'
  const quickLaunchSizing = isCoarsePointer ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
  const taskSizing = isCoarsePointer ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
  const controlSizing = isCoarsePointer ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    update()
    const interval = window.setInterval(update, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const query = window.matchMedia('(pointer: coarse)')
    const update = () => setIsCoarsePointer(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-2 shadow-lg backdrop-blur-xl transition-colors motion-reduce:transition-none ${
        isDark ? 'border-white/10 bg-black/65 text-white/80' : 'border-slate-200/80 bg-white/80 text-slate-800'
      }`}
      style={{ boxShadow: `0 24px 48px -28px ${accentGlow}` }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleStart}
          className={`flex items-center gap-2 rounded-full font-semibold transition-colors motion-reduce:transition-none ${startSizing} ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
              : 'bg-slate-900/5 hover:bg-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
          }`}
          style={{ boxShadow: `0 8px 12px -8px ${accentGlow}` }}
        >
          <span aria-hidden className="text-lg">
            🪟
          </span>
          <span className="hidden sm:inline">Start</span>
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {apps.map(app => (
            <button
              key={app.appId}
              type="button"
              onClick={() => onQuickLaunch(app.appId)}
              className={`rounded-full font-medium transition motion-reduce:transition-none ${quickLaunchSizing} ${
                isDark
                  ? 'text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70'
                  : 'text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400'
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {runningWindows.map(win => {
            const isActiveTask = !win.minimized
            return (
              <li key={win.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onTaskClick(win.id)}
                  aria-pressed={isActiveTask}
                  className={`flex max-w-[200px] items-center justify-between gap-2 truncate rounded-full font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${taskSizing} ${
                    isActiveTask
                      ? 'text-white shadow-md'
                      : isDark
                        ? 'bg-white/10 text-white/65'
                        : 'bg-slate-200/70 text-slate-600'
                  }`}
                  style={
                    isActiveTask
                      ? { backgroundColor: accentSurface, boxShadow: `0 10px 20px -12px ${accentGlow}` }
                      : undefined
                  }
                >
                  <span className="truncate">{win.title}</span>
                  <span aria-hidden>{isActiveTask ? '—' : '▢'}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className={`flex items-center gap-2 rounded-full font-medium transition-colors motion-reduce:transition-none ${controlSizing} ${
            isDark
              ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70'
              : 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
          }`}
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(148,163,184,0.14)',
          }}
        >
          <span aria-hidden>{isDark ? '☀️' : '🌙'}</span>
          <span className="hidden sm:inline">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div className={`w-16 text-right text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
          {time}
        </div>
      </div>
    </div>
  )
}
