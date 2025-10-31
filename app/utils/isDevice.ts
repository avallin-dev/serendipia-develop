export const isMobile = (userAgent: string): boolean => {
  return /android.+mobile|ip(hone|[oa]d)/i.test(userAgent)
}

export const isTV = (userAgent: string): boolean => {
  return /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv/i.test(userAgent)
}
