'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeContext'

const navItems = [
  { label: 'os', href: '/os' },
]

const HeaderNav = () => {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const [menuOpen, setMenuOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const hasMenu = navItems.length > 1
  const singleNavItem = !hasMenu ? navItems[0] : null

  useEffect(() => {
    if (!hasMenu || !menuOpen) return

    const handlePointerDown = (event: MouseEvent | PointerEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (buttonRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        buttonRef.current?.focus()
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKey)
    }
  }, [hasMenu, menuOpen])

  useEffect(() => {
    if (!hasMenu) return
    if (menuOpen && focusIndex >= 0) {
      itemRefs.current[focusIndex]?.focus()
    }
  }, [hasMenu, menuOpen, focusIndex])

  useEffect(() => {
    if (!hasMenu) return
    if (!menuOpen) {
      setFocusIndex(-1)
    }
  }, [hasMenu, menuOpen])

  const toggleMenu = () => {
    if (!hasMenu) return
    setMenuOpen(prev => {
      const next = !prev
      if (next) {
        setFocusIndex(0)
      }
      return next
    })
  }

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMenu || !menuOpen) return

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        setFocusIndex(prev => (prev + 1) % navItems.length)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        setFocusIndex(prev => (prev - 1 + navItems.length) % navItems.length)
        break
      }
      case 'Home': {
        event.preventDefault()
        setFocusIndex(0)
        break
      }
      case 'End': {
        event.preventDefault()
        setFocusIndex(navItems.length - 1)
        break
      }
      case 'Tab': {
        setMenuOpen(false)
        break
      }
    }
  }

  const handleButtonMouseEnter = () => {
    if (!hasMenu) return
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setMenuOpen(true)
      setFocusIndex(0)
    }
  }

  const handleMenuMouseLeave = () => {
    if (!hasMenu) return
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-sm border-b ${
        isDark
          ? 'bg-black/90 border-gray-800 text-gray-200'
          : 'bg-white/90 border-gray-200 text-gray-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`text-xs px-2 py-1 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isDark
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 focus-visible:outline-blue-400'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:outline-blue-500'
            }`}
            aria-label="Toggle theme"
            type="button"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <Link
            href="/"
            className={`text-sm font-mono transition-colors hover:text-blue-400 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            wtergan
          </Link>
        </div>

        {hasMenu ? (
          <div className="relative" onMouseLeave={handleMenuMouseLeave}>
            <button
              ref={buttonRef}
              type="button"
              className="flex flex-col items-end gap-1 rounded px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              aria-label="Open navigation menu"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              onClick={toggleMenu}
              onMouseEnter={handleButtonMouseEnter}
            >
              <span className={`block h-0.5 w-6 ${isDark ? 'bg-gray-300' : 'bg-gray-700'}`} />
              <span className={`block h-0.5 w-6 ${isDark ? 'bg-gray-300' : 'bg-gray-700'}`} />
              <span className={`block h-0.5 w-6 ${isDark ? 'bg-gray-300' : 'bg-gray-700'}`} />
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                id="primary-menu"
                role="menu"
                aria-label="Primary navigation"
                className={`absolute top-full right-0 mt-2 min-w-32 rounded border shadow-lg backdrop-blur-sm ${
                  isDark
                    ? 'bg-black/90 border-gray-600'
                    : 'bg-white/95 border-gray-300'
                }`}
                onKeyDown={handleMenuKeyDown}
              >
                <ul className="py-1">
                  {navItems.map((nav, index) => {
                    const isActive = pathname === nav.href
                    return (
                      <li key={nav.href}>
                        <Link
                          href={nav.href}
                          ref={node => {
                            itemRefs.current[index] = node
                          }}
                          role="menuitem"
                          tabIndex={-1}
                          onClick={() => setMenuOpen(false)}
                          className={`block px-4 py-2 text-sm font-mono transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            isActive
                              ? 'text-blue-400'
                              : isDark
                                ? 'text-gray-300 hover:text-blue-400 focus-visible:outline-blue-400'
                                : 'text-gray-700 hover:text-blue-600 focus-visible:outline-blue-500'
                          }`}
                        >
                          {nav.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : singleNavItem ? (
          <Link
            href={singleNavItem.href}
            className={`text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isDark
                ? 'text-gray-300 hover:text-blue-400 focus-visible:outline-blue-400'
                : 'text-gray-700 hover:text-blue-600 focus-visible:outline-blue-500'
            }`}
          >
            {singleNavItem.label}
          </Link>
        ) : null}
      </div>
    </nav>
  )
}

export default HeaderNav
