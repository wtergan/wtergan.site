import React from 'react'
import './globals.css'
import { ReactNode } from 'react'
import HeaderNav from './HeaderNav'
import { ThemeProvider } from './ThemeContext'

export const metadata = {
  title: 'wtergan',
  description: 'showcasing projects, blog posts, papers, etc.',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {/* Header Navigation */}
          <HeaderNav />
          {/* Main Content */}
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout