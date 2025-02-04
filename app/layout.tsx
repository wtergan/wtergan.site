import React from 'react'
import './globals.css'
import { ReactNode } from 'react'
import HeaderNav from './HeaderNav'

export const metadata = {
  title: 'My ML/CS Blog',
  description: 'Personal blog site showcasing projects, blog posts, papers, etc.',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-300">
        {/* Header Navigation */}
        <HeaderNav />
        {/* Main Content */}
        <main className="mx-auto px-6 py-4">
          {children}
        </main>
      </body>
    </html>
  )
}

export default RootLayout