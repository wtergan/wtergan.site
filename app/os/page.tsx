'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Desktop from '../../components/os/Desktop'
import Taskbar from '../../components/os/Taskbar'
import StartMenu from '../../components/os/StartMenu'
import Window, {
  WINDOW_EDGE_PADDING,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  WINDOW_TASKBAR_HEIGHT,
} from '../../components/os/Window'
import AboutApp from '../../components/os/apps/AboutApp'
import PapersApp from '../../components/os/apps/PapersApp'
import LinksApp from '../../components/os/apps/LinksApp'
import ProjectsApp from '../../components/os/apps/ProjectsApp'
import SettingsApp from '../../components/os/apps/SettingsApp'
import type { AppId, Preferences, WallpaperId } from '../../components/os/types'
import { WALLPAPER_PRESETS } from '../../components/os/wallpapers'
import { useTheme } from '../ThemeContext'

type WindowRecord = {
  id: string
  appId: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  z: number
  minimized: boolean
}

type PersistedWindow = {
  id: string
  appId: AppId
  x: number
  y: number
  width: number
  height: number
  z: number
  minimized: boolean
}

const STORAGE_KEY = 'terminal-os/state'
const LEGACY_STORAGE_KEY = 'terminal-os/windows'
const STORAGE_VERSION = 2 as const

const DEFAULT_WALLPAPER: WallpaperId = 'aurora'
const DEFAULT_PREFERENCES: Preferences = {
  wallpaper: DEFAULT_WALLPAPER,
}

type PersistedPreferences = Partial<Preferences> & {
  theme?: 'light' | 'dark'
}

const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const APP_DEFS: Record<AppId, { title: string; defaultSize: [number, number] }> = {
  about: { title: 'About Me', defaultSize: [540, 360] },
  papers: { title: 'Papers', defaultSize: [760, 520] },
  links: { title: 'Links', defaultSize: [720, 500] },
  projects: { title: 'Projects', defaultSize: [600, 420] },
  settings: { title: 'System Settings', defaultSize: [520, 420] },
}

export default function OSPage() {
  const { theme, toggleTheme, setTheme: applyTheme } = useTheme()
  const isDark = theme === 'dark'
  const [windows, setWindows] = useState<WindowRecord[]>([])
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [showStart, setShowStart] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const counterRef = useRef(0)
  const zTop = useRef(1)
  const hydratedRef = useRef(false)
  const wallpaperPreset = WALLPAPER_PRESETS[preferences.wallpaper] ?? WALLPAPER_PRESETS[DEFAULT_WALLPAPER]
  const accentColor = wallpaperPreset.accent

  const announce = useCallback((message: string) => {
    setAnnouncement(prev => {
      const trimmedPrev = prev.trim()
      const trimmedNext = message.trim()
      if (trimmedPrev === trimmedNext) {
        return `${message} `
      }
      return message
    })
  }, [])

  const clampWindowRecord = useCallback((win: WindowRecord): WindowRecord => {
    if (typeof window === 'undefined') {
      return win
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight - WINDOW_TASKBAR_HEIGHT
    const availableWidth = viewportWidth - WINDOW_EDGE_PADDING * 2
    const availableHeight = viewportHeight - WINDOW_EDGE_PADDING * 2
    const maxWidth = availableWidth > 0 ? availableWidth : WINDOW_MIN_WIDTH
    const maxHeight = availableHeight > 0 ? availableHeight : WINDOW_MIN_HEIGHT
    const minWidth = Math.min(WINDOW_MIN_WIDTH, maxWidth)
    const minHeight = Math.min(WINDOW_MIN_HEIGHT, maxHeight)
    const width = clampValue(win.width, minWidth, Math.max(maxWidth, minWidth))
    const height = clampValue(win.height, minHeight, Math.max(maxHeight, minHeight))
    const maxX = viewportWidth - width - WINDOW_EDGE_PADDING
    const maxY = viewportHeight - height - WINDOW_EDGE_PADDING
    const minX = WINDOW_EDGE_PADDING * -1
    const minY = WINDOW_EDGE_PADDING * -1
    const x = clampValue(win.x, minX, Math.max(maxX, minX))
    const y = clampValue(win.y, minY, Math.max(maxY, minY))

    return {
      ...win,
      width,
      height,
      x,
      y,
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || hydratedRef.current) return
    hydratedRef.current = true

    const hydrateWindows = (entries: PersistedWindow[] | undefined) => {
      if (!entries?.length) return

      const restored = entries
        .map(windowState => {
          const def = APP_DEFS[windowState.appId]
          if (!def) return null
          const record: WindowRecord = {
            ...windowState,
            title: def.title,
          }
          return clampWindowRecord(record)
        })
        .filter((value): value is WindowRecord => Boolean(value))

      if (!restored.length) return

      const sorted = [...restored]
        .sort((a, b) => a.z - b.z)
        .map((win, index) => ({ ...win, z: index + 1 }))

      zTop.current = sorted.length ? sorted[sorted.length - 1].z : 1
      counterRef.current = sorted.length
      setWindows(sorted)
    }

    const applyPreferencesFromStorage = (prefs?: PersistedPreferences | null) => {
      if (!prefs) return
      setPreferences(prev => {
        const next: Preferences = {
          ...prev,
          wallpaper: prefs.wallpaper ?? prev.wallpaper ?? DEFAULT_WALLPAPER,
          theme: prefs.theme ?? prev.theme,
        }
        if (next.wallpaper === prev.wallpaper && next.theme === prev.theme) {
          return prev
        }
        return next
      })
      if (prefs.theme && prefs.theme !== theme) {
        applyTheme(prefs.theme)
      }
    }

    const migrateLegacy = (raw: string | null) => {
      if (!raw) return false
      try {
        const parsed = JSON.parse(raw) as { version?: number; windows?: PersistedWindow[] }
        hydrateWindows(parsed?.windows)
        return true
      } catch (error) {
        console.error('Failed to migrate legacy OS windows', error)
        return false
      }
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          version?: number
          windows?: PersistedWindow[]
          preferences?: PersistedPreferences | null
        }
        if (parsed.version !== STORAGE_VERSION) {
          window.localStorage.removeItem(STORAGE_KEY)
        } else {
          hydrateWindows(parsed?.windows)
          applyPreferencesFromStorage(parsed?.preferences ?? null)
          return
        }
      }

      const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY)
      if (migrateLegacy(legacyRaw)) {
        window.localStorage.removeItem(LEGACY_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to restore OS state', error)
    }
  }, [applyTheme, clampWindowRecord, theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const payload: PersistedWindow[] = windows.map(win => ({
      id: win.id,
      appId: win.appId,
      x: win.x,
      y: win.y,
      width: win.width,
      height: win.height,
      z: win.z,
      minimized: win.minimized,
    }))

    const state = {
      version: STORAGE_VERSION,
      windows: payload,
      preferences: {
        wallpaper: preferences.wallpaper,
        ...(preferences.theme ? { theme: preferences.theme } : {}),
      },
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [windows, preferences])

  useEffect(() => {
    setPreferences(prev => {
      if (prev.theme === theme) return prev
      return { ...prev, theme }
    })
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      setWindows(prev => {
        let changed = false
        const next = prev.map(win => {
          const clamped = clampWindowRecord(win)
          if (
            clamped.x !== win.x ||
            clamped.y !== win.y ||
            clamped.width !== win.width ||
            clamped.height !== win.height
          ) {
            changed = true
          }
          return clamped
        })
        return changed ? next : prev
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [clampWindowRecord])

  const focusWindow = useCallback(
    (id: string) => {
      let restoredTitle: string | null = null
      setWindows(prev =>
        prev.map(win => {
          if (win.id !== id) return win
          const wasMinimized = win.minimized
          const next = {
            ...win,
            z: ++zTop.current,
            minimized: false,
          }
          if (wasMinimized) {
            restoredTitle = win.title
          }
          return next
        }),
      )
      if (restoredTitle) {
        announce(`Restored ${restoredTitle}`)
      }
    },
    [announce],
  )

  const openApp = useCallback(
    (appId: AppId) => {
      setShowStart(false)
      let restoredTitle: string | null = null
      setWindows(prev => {
        const existing = prev.find(win => win.appId === appId)
        if (existing) {
          const nextZ = ++zTop.current
          return prev.map(win => {
            if (win.id !== existing.id) return win
            if (win.minimized) {
              restoredTitle = win.title
            }
            return {
              ...win,
              minimized: false,
              z: nextZ,
            }
          })
        }

        counterRef.current += 1
        const { title, defaultSize } = APP_DEFS[appId]
        const baseWindow: WindowRecord = {
          id: `${appId}-${counterRef.current}`,
          appId,
          title,
          x: 96 + prev.length * 24,
          y: 96 + prev.length * 16,
          width: defaultSize[0],
          height: defaultSize[1],
          z: ++zTop.current,
          minimized: false,
        }
        return [...prev, clampWindowRecord(baseWindow)]
      })
      if (restoredTitle) {
        announce(`Restored ${restoredTitle}`)
      }
    },
    [announce, clampWindowRecord],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(win => win.id !== id))
  }, [])

  const minimizeWindow = useCallback(
    (id: string) => {
      let targetTitle: string | null = null
      setWindows(prev =>
        prev.map(win => {
          if (win.id !== id) return win
          targetTitle = win.title
          return {
            ...win,
            minimized: true,
          }
        }),
      )
      if (targetTitle) {
        announce(`Minimized ${targetTitle}`)
      }
    },
    [announce],
  )

  const updateBounds = useCallback(
    (id: string, x: number, y: number, width?: number, height?: number) => {
      setWindows(prev =>
        prev.map(win => {
          if (win.id !== id) return win
          return clampWindowRecord({
            ...win,
            x,
            y,
            width: width ?? win.width,
            height: height ?? win.height,
          })
        }),
      )
    },
    [clampWindowRecord],
  )

  const orderedWindows = useMemo(() => [...windows].sort((a, b) => a.z - b.z), [windows])
  const topZ = useMemo(() => (windows.length ? Math.max(...windows.map(win => win.z)) : 0), [windows])

  const renderApp = (appId: AppId) => {
    switch (appId) {
      case 'about':
        return <AboutApp />
      case 'papers':
        return <PapersApp />
      case 'links':
        return <LinksApp />
      case 'projects':
        return <ProjectsApp />
      case 'settings':
        return (
          <SettingsApp
            isDark={isDark}
            preferences={preferences}
            onChangePreferences={setPreferences}
            onToggleTheme={toggleTheme}
          />
        )
      default:
        return null
    }
  }

  const taskbarApps: { appId: AppId; label: string }[] = [
    { appId: 'about', label: 'About' },
    { appId: 'papers', label: 'Papers' },
    { appId: 'links', label: 'Links' },
    { appId: 'projects', label: 'Projects' },
    { appId: 'settings', label: 'Settings' },
  ]

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden select-none ${
        isDark ? 'bg-[#080808] text-slate-100' : 'bg-[#f0f4ff] text-slate-900'
      }`}
    >
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
      <Desktop isDark={isDark} wallpaper={preferences.wallpaper} onOpen={openApp} />

      {orderedWindows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          x={win.x}
          y={win.y}
          width={win.width}
          height={win.height}
          zIndex={win.z}
          minimized={win.minimized}
          isActive={win.z === topZ}
          accentColor={accentColor}
          onFocus={() => focusWindow(win.id)}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMove={(x, y) => updateBounds(win.id, x, y)}
          onResize={(newWidth, newHeight) => updateBounds(win.id, win.x, win.y, newWidth, newHeight)}
        >
          {renderApp(win.appId)}
        </Window>
      ))}

      <Taskbar
        isDark={isDark}
        accentColor={accentColor}
        runningWindows={windows}
        apps={taskbarApps}
        onToggleStart={() => setShowStart(prev => !prev)}
        onToggleTheme={toggleTheme}
        onTaskClick={id => {
          const win = windows.find(w => w.id === id)
          if (!win) return
          if (win.minimized) {
            focusWindow(id)
          } else {
            minimizeWindow(id)
          }
        }}
        onQuickLaunch={openApp}
      />

      {showStart && (
        <StartMenu
          isDark={isDark}
          accentColor={accentColor}
          onClose={() => setShowStart(false)}
          onSelect={appId => openApp(appId)}
        />
      )}
    </div>
  )
}
