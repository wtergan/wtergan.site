'use client'

import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface WindowProps {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
  isActive: boolean
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onMove: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  children: ReactNode
}

export const WINDOW_MIN_WIDTH = 360
export const WINDOW_MIN_HEIGHT = 220
export const WINDOW_EDGE_PADDING = 16
export const WINDOW_TASKBAR_HEIGHT = 48

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const FOCUSABLE_SELECTOR =
  'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function Window({
  title,
  x,
  y,
  width,
  height,
  zIndex,
  minimized,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const winRef = useRef<HTMLDivElement | null>(null)
  const dragOffset = useRef<{ x: number; y: number } | null>(null)
  const resizing = useRef(false)
  const pointerId = useRef<number | null>(null)
  const captureTarget = useRef<HTMLElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const updateViewportMode = () => {
      setIsCompact(window.innerWidth < 640)
    }
    updateViewportMode()
    window.addEventListener('resize', updateViewportMode)
    return () => window.removeEventListener('resize', updateViewportMode)
  }, [])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (pointerId.current === null || event.pointerId !== pointerId.current) return
      if (!winRef.current) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight - WINDOW_TASKBAR_HEIGHT

      if (dragOffset.current) {
        const nextX = clamp(
          event.clientX - dragOffset.current.x,
          WINDOW_EDGE_PADDING * -1,
          viewportWidth - WINDOW_EDGE_PADDING,
        )
        const nextY = clamp(
          event.clientY - dragOffset.current.y,
          WINDOW_EDGE_PADDING * -1,
          viewportHeight,
        )
        onMove(nextX, nextY)
      } else if (resizing.current && !isCompact) {
        const rect = winRef.current.getBoundingClientRect()
        const rawWidth = event.clientX - rect.left
        const rawHeight = event.clientY - rect.top
        const maxWidth = viewportWidth - rect.left - WINDOW_EDGE_PADDING
        const maxHeight = viewportHeight - rect.top
        const nextWidth = clamp(
          rawWidth,
          WINDOW_MIN_WIDTH,
          Math.max(WINDOW_MIN_WIDTH, maxWidth),
        )
        const nextHeight = clamp(
          rawHeight,
          WINDOW_MIN_HEIGHT,
          Math.max(WINDOW_MIN_HEIGHT, maxHeight),
        )
        onResize(nextWidth, nextHeight)
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (pointerId.current === null || event.pointerId !== pointerId.current) return
      dragOffset.current = null
      resizing.current = false
      pointerId.current = null
      captureTarget.current?.releasePointerCapture(event.pointerId)
      captureTarget.current = null
      setIsDragging(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isCompact, onMove, onResize])

  useEffect(() => {
    if (isActive && !minimized) {
      winRef.current?.focus({ preventScroll: true })
    }
  }, [isActive, minimized])

  if (minimized) {
    return null
  }

  const beginDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return
    pointerId.current = event.pointerId
    dragOffset.current = { x: event.clientX - x, y: event.clientY - y }
    resizing.current = false
    captureTarget.current = event.currentTarget as HTMLElement
    setIsDragging(true)
    event.preventDefault()
    captureTarget.current.setPointerCapture?.(event.pointerId)
  }

  const beginResize = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || isCompact) return
    pointerId.current = event.pointerId
    dragOffset.current = null
    resizing.current = true
    captureTarget.current = event.currentTarget as HTMLElement
    setIsDragging(false)
    event.preventDefault()
    captureTarget.current.setPointerCapture?.(event.pointerId)
  }

  const handleFocusAny = () => {
    onFocus()
    winRef.current?.focus({ preventScroll: true })
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !isActive || !winRef.current) return

    const focusables = Array.from(
      winRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(element => !element.hasAttribute('disabled') && element.tabIndex !== -1)

    if (!focusables.length) {
      event.preventDefault()
      winRef.current.focus({ preventScroll: true })
      return
    }

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (event.shiftKey) {
      if (active === first || active === winRef.current) {
        event.preventDefault()
        last.focus()
      }
    } else if (active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={winRef}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      className={`fixed flex flex-col overflow-hidden rounded-md border shadow-lg transition-shadow duration-150 ${
        isActive ? 'border-blue-400/70 shadow-2xl' : 'border-black/10 dark:border-white/10'
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ left: x, top: y, width, height, zIndex }}
      onPointerDown={handleFocusAny}
      onKeyDown={handleKeyDown}
    >
      <div
        className="flex h-10 shrink-0 items-center justify-between border-b border-black/10 bg-gradient-to-b from-white/85 to-white/65 px-3 text-xs font-medium text-black/80 dark:border-white/10 dark:from-[#1b1b1b] dark:to-[#101010] dark:text-white/80"
        onPointerDown={event => {
          onFocus()
          beginDrag(event)
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Close window"
            onClick={onClose}
            className="h-4 w-4 rounded-full bg-red-500 hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-400"
          />
          <button
            type="button"
            aria-label="Minimize window"
            onClick={onMinimize}
            className="h-4 w-4 rounded-full bg-amber-400 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-300"
          />
          <span className="ml-2 truncate">{title}</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white/95 p-3 text-sm text-black/80 dark:bg-black/70 dark:text-white/80">
        {children}
      </div>
      {!isCompact && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onPointerDown={event => {
            onFocus()
            beginResize(event)
          }}
        />
      )}
    </div>
  )
}
