'use client'

import { useEffect, useMemo, useState } from 'react'
import { DataState } from '../../ui/DataState'
import { getSupabaseClient } from '../../../lib/supabaseClient'

type Paper = {
  id: string
  title: string
  authors: string
  url: string
  year: number | null
  date: string | null
  desc?: string | null
}

type FetchStatus = 'loading' | 'error' | 'ready'

export default function PapersApp() {
  const supabase = getSupabaseClient()
  const [papers, setPapers] = useState<Paper[]>([])
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

    const fetchPapers = async () => {
      setStatus('loading')
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .order('date', { ascending: false })
      if (cancelled) return

      if (error) {
        console.error('Error loading papers for OS mode', error)
        setErrorMessage('Unable to load papers right now. Please try again later.')
        setStatus('error')
        return
      }

      setPapers((data ?? []) as Paper[])
      setStatus('ready')
    }

    fetchPapers()

    return () => {
      cancelled = true
    }
  }, [supabase])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return papers
    return papers.filter(paper => {
      const fields = [paper.title, paper.authors, paper.year?.toString() ?? '']
      return fields.some(field => field?.toLowerCase().includes(query))
    })
  }, [papers, search])

  if (status === 'loading') {
    return <DataState status="loading" title="Loading papers…" description="Fetching items from Supabase." />
  }

  if (status === 'error') {
    return <DataState status="error" title="Cannot load papers" description={errorMessage ?? undefined} />
  }

  return (
    <div className="space-y-3 text-sm">
      <input
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder="Search papers"
        aria-label="Search papers"
        className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
      />

      {!filtered.length ? (
        <DataState
          status="empty"
          title="No papers match that search"
          description="Try a different keyword or update your Supabase collection."
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
          {filtered.map(paper => {
            const formattedDate = paper.date
              ? new Date(`${paper.date}T00:00:00Z`).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'utc',
                })
              : 'Unknown'

            return (
              <li key={paper.id}>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded border border-white/5 bg-white/5 px-3 py-2 transition hover:border-blue-400/40 hover:bg-white/10"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold leading-tight">{paper.title}</span>
                    <span className="text-xs opacity-70">{paper.authors}</span>
                    <span className="text-xs opacity-70">{formattedDate}</span>
                    {paper.desc && <span className="text-xs opacity-60">{paper.desc}</span>}
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
