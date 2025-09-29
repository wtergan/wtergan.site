'use client'

import type { ReactNode } from 'react'

interface DataStateProps {
  status: 'loading' | 'empty' | 'error'
  title: string
  description?: string
  action?: ReactNode
}

const STATUS_STYLES: Record<DataStateProps['status'], string> = {
  loading: 'text-blue-500 dark:text-blue-300',
  empty: 'text-amber-500 dark:text-amber-300',
  error: 'text-rose-500 dark:text-rose-300',
}

export function DataState({ status, title, description, action }: DataStateProps) {
  return (
    <div
      role={status === 'error' ? 'alert' : undefined}
      className={`flex flex-col gap-2 rounded-md border border-white/10 bg-white/5 p-4 text-sm text-black/70 shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-white/70`}
    >
      <p className={`font-medium ${STATUS_STYLES[status]}`}>{title}</p>
      {description && <p className="text-xs leading-relaxed opacity-80">{description}</p>}
      {action && <div className="pt-1 text-xs">{action}</div>}
    </div>
  )
}

export function DataStateInline({ status, title }: Pick<DataStateProps, 'status' | 'title'>) {
  return <span className={`text-xs font-medium ${STATUS_STYLES[status]}`}>{title}</span>
}
