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
          <p>
            - im always reading ml papers and blogs, check out what im reading via the{' '}
            <Link 
              href="/papers" 
              className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              papers
            </Link>{' '}
            and{' '}
            <Link 
              href="/links" 
              className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              links
            </Link>{' '}
            pages.
          </p>
          <p>
            - im also always building cool things with ai! check out what im building via the{' '}
            <Link 
              href="/projects" 
              className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              projects
            </Link>{' '}
            page.
          </p>
        </div>
      </section>

      {/* My blogs Section */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">my blogs</h2>
        <ul className="text-sm">
          <li className="mb-2">
            <span className={isDark ? 'text-gray-500' : 'text-gray-600'}>• </span>
            <Link href="/blogs" className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>
              blogs coming soon...
            </Link>
          </li>
        </ul>
      </section>

      {/* Project Section, in directory structure */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">projects</h2>
        <div className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="mb-2">/home/wtergan/</div>
          <div className="ml-4">
            <div className="mb-1">└─ projects</div>
            <div className={`ml-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div>
                ├─ <Link href="/projects" className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>
                  coming soon...
                </Link>
              </div>
            </div>
          </div>
        </div>
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