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
import type { AppId } from '../../components/os/types'
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

const STORAGE_KEY = 'terminal-os/windows@v1'

const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const APP_DEFS: Record<AppId, { title: string; defaultSize: [number, number] }> = {
  about: { title: 'About Me', defaultSize: [540, 360] },
  papers: { title: 'Papers', defaultSize: [760, 520] },
  links: { title: 'Links', defaultSize: [720, 500] },
  projects: { title: 'Projects', defaultSize: [600, 420] },
}

export default function OSPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [windows, setWindows] = useState<WindowRecord[]>([])
  const [showStart, setShowStart] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const counterRef = useRef(0)
  const zTop = useRef(1)

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
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as { windows?: PersistedWindow[] }
      const restored = (parsed?.windows ?? [])
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
    } catch (error) {
      console.error('Failed to restore OS windows', error)
    }
  }, [clampWindowRecord])

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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ windows: payload }))
  }, [windows])

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
      default:
        return null
    }
  }

  const taskbarApps: { appId: AppId; label: string }[] = [
    { appId: 'about', label: 'About' },
    { appId: 'papers', label: 'Papers' },
    { appId: 'links', label: 'Links' },
    { appId: 'projects', label: 'Projects' },
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
      <Desktop isDark={isDark} onOpen={openApp} />

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
        runningWindows={windows}
        apps={taskbarApps}
        onToggleStart={() => setShowStart(prev => !prev)}
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
          onClose={() => setShowStart(false)}
          onSelect={appId => openApp(appId)}
        />
      )}
    </div>
  )
}
