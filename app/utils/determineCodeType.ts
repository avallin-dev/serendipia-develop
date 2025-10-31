type CodeType = 'even' | 'odd' | 'rare'

export default function determineCodeType(code: string | null | undefined): CodeType {
  const regex = /^(\d+)([A-Za-z]?)$/

  if (code) {
    const match = code.match(regex)
    if (match) {
      const number = parseInt(match[1], 10)
      const hasLetter = match[2].length > 0
      if (!isNaN(number)) {
        if (!hasLetter) {
          return 'rare'
        }
        if (number % 2 === 0) {
          return 'even'
        } else {
          return 'odd'
        }
      }
    }
  }

  return 'rare'
}
