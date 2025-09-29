'use client';

import React from 'react';
import { useTheme } from '../ThemeContext';

const BlogPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pt-24 px-8 font-mono ${isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'}`}>
      <section className="flex items-center justify-center h-96">
        <h1 className="text-2xl font-bold">under construction, great things are coming soon!</h1>
      </section>
    </div>
  );
};

export default BlogPage;