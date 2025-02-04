'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItemsLeft = [
  { label: 'wtergan', href: '/' },
  { label: 'projects', href: '/projects' },
  { label: 'blogs', href: '/blogs' },
  { label: 'contact', href: '/contact' },
]

const navItemsRight = [
  { label: 'papers', href: '/papers' },
  { label: 'links', href: '/links' },
]

const HeaderNav = () => {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap justify-between items-center px-6 py-4 bg-gray-900 text-gray-300">
      {/* Left Navigation Group */}
      <div className="flex space-x-8">
        {navItemsLeft.map((nav) => {
          const isActive = pathname === nav.href
          return (
            <Link
              key={nav.href}
              href={nav.href}
              className={`text-sm uppercase tracking-wide transition ${
                isActive ? 'font-semibold text-gold' : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              {nav.label}
            </Link>
          )
        })}
      </div>

      {/* Right Navigation Group */}
      <div className="flex space-x-8">
        {navItemsRight.map((nav) => {
          const isActive = pathname === nav.href
          return (
            <Link
              key={nav.href}
              href={nav.href}
              className={`text-sm uppercase tracking-wide transition ${
                isActive ? 'font-semibold text-gold' : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              {nav.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default HeaderNav