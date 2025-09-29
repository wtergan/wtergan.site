'use client'

import { useEffect, useMemo, useState } from 'react'
import { DataState } from '../../components/ui/DataState'
import { getSupabaseClient } from '../../lib/supabaseClient'
import { useTheme } from '../ThemeContext'

type LinkRecord = {
  id: number
  title: string
  url: string
  date: string | null
  authors: string | null
  desc?: string | null
}

type FetchStatus = 'loading' | 'error' | 'ready'

export default function LinksPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const supabase = getSupabaseClient()
  const [links, setLinks] = useState<LinkRecord[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!supabase) {
      setStatus('error')
      setErrorMessage('Supabase environment variables are missing. Update your .env.local to view links.')
      return
    }

    const fetchLinks = async () => {
      setStatus('loading')
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('date', { ascending: false })
      if (cancelled) return

      if (error) {
        console.error('Error fetching links', error)
        setErrorMessage('Unable to load links right now. Please try again shortly.')
        setStatus('error')
        return
      }

      setLinks((data ?? []) as LinkRecord[])
      setStatus('ready')
    }

    fetchLinks()

    return () => {
      cancelled = true
    }
  }, [supabase])

  const filteredLinks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return links
    return links.filter(link => {
      const candidates = [link.title, link.url, link.authors ?? '']
      return candidates.some(candidate => candidate?.toLowerCase().includes(query))
    })
  }, [links, searchQuery])

  const containerClasses = `min-h-screen pt-24 px-8 font-mono ${
    isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'
  }`
  const inputClasses = `w-full max-w-md px-4 py-2 rounded border transition-colors ${
    isDark
      ? 'bg-gray-900 text-gray-300 border-gray-600 focus:outline-none focus:border-blue-400'
      : 'bg-gray-50 text-gray-700 border-gray-300 focus:outline-none focus:border-blue-600'
  }`

  return (
    <div className={containerClasses}>
      <section className="max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">links</h1>
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            className={inputClasses}
            aria-label="Search links"
            disabled={status === 'loading'}
          />
        </div>

        {status === 'loading' && (
          <DataState status="loading" title="Loading links…" description="Pulling the latest resources from Supabase." />
        )}

        {status === 'error' && (
          <DataState status="error" title="Something went wrong" description={errorMessage ?? undefined} />
        )}

        {status === 'ready' && !filteredLinks.length && (
          <DataState
            status="empty"
            title="No links match that search"
            description="Try another keyword or add more resources to Supabase."
            action={
              searchQuery ? (
                <button
                  type="button"
                  className="rounded border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium hover:bg-white/20 dark:border-white/20"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              ) : undefined
            }
          />
        )}

        {status === 'ready' && filteredLinks.length > 0 && (
          <ul className="space-y-2">
            {filteredLinks.map(link => {
              const formattedDate = link.date
                ? new Date(`${link.date}T00:00:00Z`).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'utc',
                  })
                : 'Unknown'

              return (
                <li key={link.id} className="relative group">
                  <article
                    tabIndex={0}
                    aria-label={link.title}
                    onClick={() => window.open(link.url, '_blank')}
                    onKeyDown={event => {
                      if (event.key === 'Enter') window.open(link.url, '_blank')
                    }}
                    className={`cursor-pointer rounded p-4 shadow transition-all ${
                      isDark ? 'bg-gray-900 hover:bg-gray-800 hover:shadow-md' : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-semibold">{link.title}</h2>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{link.authors ?? 'Unknown author'}</p>
                      </div>
                      <p className={`min-w-[96px] text-right text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formattedDate}</p>
                    </div>
                  </article>
                  <div
                    className={`absolute left-0 z-50 hidden max-w-md break-words rounded border p-2 text-xs shadow-md group-hover:block ${
                      isDark
                        ? 'border-gray-600 bg-gray-800/90 text-gray-200'
                        : 'border-gray-300 bg-white/90 text-gray-800'
                    }`}
                    style={{ bottom: '100%', marginBottom: 8 }}
                  >
                    {link.desc || 'No description available'}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
