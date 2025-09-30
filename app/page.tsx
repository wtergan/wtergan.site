'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from './ThemeContext';

const HomePage = () => {
  const { theme } = useTheme()
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen font-mono p-8 pt-24 ${
      isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'
    }`}>
      {/* Header with profile and name */}
      <header className="mb-12">
        <div className="flex items-center gap-6 mb-4">
          <div 
            className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer"
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <Image
              src={isProfileHovered ? "/profile.jpg" : "/warrior.jpg"}
              alt="Profile picture"
              width={80}
              height={80}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isDark ? 'bg-black' : 'bg-white'
              }`}
              style={{
                backgroundColor: isDark ? '#000000' : '#ffffff'
              }}
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-wider">wtergan</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              "iterate, iterate, iterate."
            </p>
          </div>
        </div>
      </header>

      {/* What's Up Section */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">what's up?</h2>
        <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>- im will, aka wtergan. swe and indie ml researcher building cool things with ai!</p>
          <p>- the new terminal os is the home for my papers, links, and projects. hop in and poke around.</p>
        </div>
      </section>

      {/* OS Section */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">terminal os</h2>
        <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>launch the desktop for curated papers, ai resources, and tinkering logs—all in one place.</p>
        </div>
        <Link
          href="/os"
          className={`mt-4 inline-flex items-center gap-2 rounded border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isDark
              ? 'border-gray-700 bg-gray-900 text-gray-200 hover:border-blue-500 hover:text-blue-400 focus-visible:outline-blue-400'
              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 focus-visible:outline-blue-500'
          }`}
        >
          <span>open terminal os</span>
          <span aria-hidden>→</span>
        </Link>
      </section>

      {/* Contact Section */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">contact</h2>
        <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>
            only on{' '}
            <a 
              href="https://github.com/wtergan" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              github
            </a>{' '}
            and{' '}
            <a 
              href="https://twitter.com/wtergan" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              X
            </a>{' '}
            for now... contact me, lets work!
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
