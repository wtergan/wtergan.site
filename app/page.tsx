'use client';

import React from 'react';
import Link from 'next/link'

const HomePage = () => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center px-4 pt-16 bg-gray-900 text-gray-300 text-center">
      {/* homepage content */}
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold">wtergan</h1>
        <p className="mt-4">
          software engineer building cool projects with cool tools.
        </p>
        <ul className="mt-2 ml-6 list-disc text-sm text-left text-gray-400">
          <li className="ml-4">I like training and wrapping models, taming GPUs, and exploring optimizations.</li>
        </ul>
        <p className="mt-6 italic text-sm">
          "iterate, iterate, iterate." - me.
        </p>
        <p className="mt-4">
          projects and blogs are coming, in the meantime checkout the{' '}
          <Link href="/papers" className="text-blue-400">
          papers
          </Link>{' '}
          and{' '}
          <Link href="/links" className="text-blue-400">
          links
          </Link>{' '}
          i've been reading lately!
        </p>
      </div>
    </section>
  );
};

export default HomePage;