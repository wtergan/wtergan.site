import React from 'react'
import './globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeContext'

export const metadata = {
  title: 'wtergan',
  description: 'terminal-inspired desktop for projects, papers, and links.',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
