'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeContext';

const HomePage = () => {
  const { theme } = useTheme()
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const isDark = theme === 'dark'
  const router = useRouter()

  useEffect(() => {
    router.replace('/os')
  }, [router])

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

      {/* Redirect Notice */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4">terminal os</h2>
        <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <p>- redirecting you to the terminal desktop where everything now lives.</p>
          <p>
            - if nothing happens, manually head over to{' '}
            <Link
              href="/os"
              className={`underline ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            >
              /os
            </Link>
            .
          </p>
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
