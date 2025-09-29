'use client'

import { useEffect, useMemo, useState } from 'react'
import { DataState } from '../../ui/DataState'
import { getSupabaseClient } from '../../../lib/supabaseClient'

type LinkRecord = {
  id: string
  title: string
  url: string
  date: string | null
  authors: string | null
  desc?: string | null
}

type FetchStatus = 'loading' | 'error' | 'ready'

export default function LinksApp() {
  const supabase = getSupabaseClient()
  const [links, setLinks] = useState<LinkRecord[]>([])
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!supabase) {
      setStatus('error')
      setErrorMessage('Supabase environment variables are missing.')
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
        console.error('Error loading links for OS mode', error)
        setErrorMessage('Unable to load links right now. Please try again later.')
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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return links
    return links.filter(link => {
      const fields = [link.title, link.authors ?? '', link.url]
      return fields.some(field => field?.toLowerCase().includes(query))
    })
  }, [links, search])

  if (status === 'loading') {
    return <DataState status="loading" title="Loading links…" description="Fetching curated resources from Supabase." />
  }

  if (status === 'error') {
    return <DataState status="error" title="Cannot load links" description={errorMessage ?? undefined} />
  }

  return (
    <div className="space-y-3 text-sm">
      <input
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder="Search links"
        aria-label="Search links"
        className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
      />

      {!filtered.length ? (
        <DataState
          status="empty"
          title="No links match that search"
          description="Try another keyword or update your Supabase collection."
          action={
            search ? (
              <button
                type="button"
                className="rounded border border-white/10 bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/20"
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            ) : undefined
          }
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map(link => {
            const formattedDate = link.date
              ? new Date(`${link.date}T00:00:00Z`).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'utc',
                })
              : 'Unknown'

            return (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded border border-white/5 bg-white/5 px-3 py-2 transition hover:border-blue-400/40 hover:bg-white/10"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold leading-tight">{link.title}</span>
                    <span className="text-xs opacity-70">{link.authors ?? 'Unknown author'}</span>
                    <span className="text-xs opacity-70">{formattedDate}</span>
                    {link.desc && <span className="text-xs opacity-60">{link.desc}</span>}
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
