'use client'

import type { Dispatch, SetStateAction } from 'react'
import type { Preferences } from '../types'
import { WALLPAPER_PRESETS } from '../wallpapers'
import { hexToRgba } from '../utils'

interface SettingsAppProps {
  isDark: boolean
  preferences: Preferences
  onChangePreferences: Dispatch<SetStateAction<Preferences>>
  onToggleTheme: () => void
}

export default function SettingsApp({
  isDark,
  preferences,
  onChangePreferences,
  onToggleTheme,
}: SettingsAppProps) {
  const wallpaperEntries = Object.entries(WALLPAPER_PRESETS)
  const accent = WALLPAPER_PRESETS[preferences.wallpaper]?.accent ?? '#60a5fa'
  const accentGlow = hexToRgba(accent, 0.35)

  return (
    <div className="space-y-6 text-sm">
      <section>
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-xs opacity-70">Switch between light and dark modes instantly.</p>
        <button
          type="button"
          onClick={onToggleTheme}
          className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition motion-reduce:transition-none ${
            isDark
              ? 'bg-white/10 text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
          }`}
          style={{ boxShadow: `0 12px 20px -16px ${accentGlow}` }}
        >
          <span aria-hidden>{isDark ? '☀️' : '🌙'}</span>
          Enable {isDark ? 'Light' : 'Dark'} Mode
        </button>
      </section>

      <section>
        <h3 className="text-base font-semibold">Wallpaper</h3>
        <p className="mt-1 text-xs opacity-70">Choose a desktop backdrop. Changes apply immediately.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {wallpaperEntries.map(([id, preset]) => {
            const isActive = preferences.wallpaper === id
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  onChangePreferences(prev =>
                    prev.wallpaper === id ? prev : { ...prev, wallpaper: id as Preferences['wallpaper'] },
                  )
                }
                className={`group flex flex-col rounded-xl border p-3 text-left transition motion-reduce:transition-none ${
                  isActive
                    ? isDark
                      ? 'border-transparent bg-white/10'
                      : 'border-transparent bg-blue-50'
                    : isDark
                      ? 'border-white/10 hover:border-white/30 hover:bg-white/5'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/60'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: accent,
                        boxShadow: `0 16px 30px -20px ${accentGlow}`,
                      }
                    : undefined
                }
              >
                <span
                  className="block h-16 w-full rounded-lg"
                  style={{
                    backgroundImage: (isDark
                      ? preset.dark.backgroundImage
                      : preset.light.backgroundImage) ?? undefined,
                  }}
                >
                  <span
                    className={`block h-full w-full rounded-lg ${
                      isDark ? preset.dark.className : preset.light.className
                    }`}
                  />
                </span>
                <span className="mt-2 text-sm font-medium">{preset.label}</span>
                <span className="text-[10px] uppercase tracking-wide opacity-60">{preset.description}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
