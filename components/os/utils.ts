export const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '')
  if (sanitized.length !== 6) {
    return `rgba(96, 165, 250, ${alpha})`
  }
  const r = parseInt(sanitized.slice(0, 2), 16)
  const g = parseInt(sanitized.slice(2, 4), 16)
  const b = parseInt(sanitized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
