'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const storedState = localStorage.getItem('terminal-os/state')
    if (storedState) {
      try {
        const parsed = JSON.parse(storedState) as {
          preferences?: { theme?: Theme }
        }
        const storedTheme = parsed?.preferences?.theme
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setTheme(storedTheme)
          return
        }
      } catch (error) {
        console.warn('Failed to read theme from OS state', error)
      }
    }

    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    }
  }, [])

  const applyTheme = useCallback((nextTheme: Theme) => {
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }, [applyTheme, theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
