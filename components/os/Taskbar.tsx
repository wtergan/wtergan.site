'use client'

import { useEffect, useState } from 'react'
import type { AppId } from './types'

type RunningWindow = {
  id: string
  title: string
  minimized: boolean
}

type TaskbarProps = {
  isDark: boolean
  runningWindows: RunningWindow[]
  apps: { appId: AppId; label: string }[]
  onToggleStart: () => void
  onTaskClick: (id: string) => void
  onQuickLaunch: (appId: AppId) => void
}

export default function Taskbar({
  isDark,
  runningWindows,
  apps,
  onToggleStart,
  onTaskClick,
  onQuickLaunch,
}: TaskbarProps) {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    update()
    const interval = window.setInterval(update, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 flex h-12 items-center gap-2 border-t px-3 transition backdrop-blur-md ${
        isDark ? 'border-white/10 bg-black/60 text-white/80' : 'border-black/10 bg-white/70 text-slate-800'
      }`}
    >
      <button
        type="button"
        onClick={onToggleStart}
        className={`flex items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold shadow-sm transition ${
          isDark
            ? 'bg-white/15 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
            : 'bg-slate-200/80 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
        }`}
      >
        <span role="img" aria-hidden>
          🪟
        </span>
        Start
      </button>

      <div className="flex items-center gap-1">
        {apps.map(app => (
          <button
            key={app.appId}
            type="button"
            onClick={() => onQuickLaunch(app.appId)}
            className={`rounded px-2 py-1 text-xs font-medium transition ${
              isDark
                ? 'text-white/80 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70'
                : 'text-slate-700 hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400'
            }`}
          >
            {app.label}
          </button>
        ))}
      </div>

      <div className="ml-2 flex-1 overflow-hidden">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {runningWindows.map(win => (
            <li key={win.id} className="min-w-0">
              <button
                type="button"
                onClick={() => onTaskClick(win.id)}
                className={`flex max-w-[160px] items-center justify-between gap-2 truncate rounded-md px-3 py-1 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                  win.minimized
                    ? isDark
                      ? 'bg-white/10 text-white/60'
                      : 'bg-slate-200 text-slate-600'
                    : isDark
                      ? 'bg-white/20 text-white/90'
                      : 'bg-blue-500/90 text-white'
                }`}
              >
                <span className="truncate">{win.title}</span>
                <span aria-hidden>{win.minimized ? '▢' : '—'}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={`w-16 text-right text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{time}</div>
    </div>
  )
}
