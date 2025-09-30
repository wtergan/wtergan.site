export type AppId = 'about' | 'papers' | 'links' | 'projects' | 'settings'

export type WallpaperId = 'aurora' | 'cyberwave' | 'matrix'

export type Preferences = {
  wallpaper: WallpaperId
  theme?: 'light' | 'dark'
}
