import type { WallpaperId } from './types'

export type WallpaperPreset = {
  label: string
  description: string
  accent: string
  light: {
    className: string
    backgroundImage?: string
  }
  dark: {
    className: string
    backgroundImage?: string
  }
}

export const WALLPAPER_PRESETS: Record<WallpaperId, WallpaperPreset> = {
  aurora: {
    label: 'Aurora',
    description: 'Soft gradients with subtle radial glow.',
    accent: '#60a5fa',
    light: {
      className: 'bg-gradient-to-br from-[#e9f1ff] via-[#edf3ff] to-[#f6f7fb]',
      backgroundImage: 'radial-gradient(circle at top left, rgba(255,255,255,0.22) 0, transparent 55%)',
    },
    dark: {
      className: 'bg-gradient-to-br from-[#050708] via-[#0d0f10] to-[#111316]',
      backgroundImage: 'radial-gradient(circle at top left, rgba(118,145,255,0.18) 0, transparent 55%)',
    },
  },
  cyberwave: {
    label: 'Cyberwave',
    description: 'Neon dusk with vaporwave overtones.',
    accent: '#a855f7',
    light: {
      className:
        'bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_55%)] bg-gradient-to-br from-[#ffe8fc] via-[#f0f0ff] to-[#ffeef8]',
    },
    dark: {
      className:
        'bg-[radial-gradient(circle_at_bottom_right,_rgba(255,126,255,0.25),_transparent_60%)] bg-gradient-to-br from-[#12081e] via-[#1a0f2b] to-[#051125]',
    },
  },
  matrix: {
    label: 'Matrix',
    description: 'Code rain inspired emerald grid.',
    accent: '#22c55e',
    light: {
      className:
        'bg-gradient-to-br from-[#f4fff2] via-[#e9ffef] to-[#f2fff8] bg-[linear-gradient(rgba(34,197,94,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.08)_1px,transparent_1px)]',
      backgroundImage: undefined,
    },
    dark: {
      className:
        'bg-gradient-to-br from-[#020705] via-[#03100b] to-[#02160d] bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)]',
    },
  },
}
