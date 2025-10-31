interface Result {
  series: string | null | undefined
  reps: string | null
  exerciseTime: number | null
  restTime: number | null
}

export default function processString(input: string | null | undefined): Result {
  if (!input) {
    return {
      series: null,
      reps: null,
      exerciseTime: null,
      restTime: null,
    }
  }

  input = input.trim()
  const lowerCasedInput = input.toLowerCase()
  const segOccurrences = (lowerCasedInput.match(/seg/g) || []).length
  const xOccurrences = (lowerCasedInput.match(/x/g) || []).length

  if (segOccurrences === 2 && xOccurrences === 2) {
    const parts = lowerCasedInput.split('x')

    if (parts.length === 3) {
      const serie = parts[0].trim()
      const secondsStr = parts[1].trim().replace(/seg$/i, '').trim()
      const restTimeStr = parts[2].trim().replace(/seg$/i, '').trim()
      const seconds = parseInt(secondsStr, 10)
      const restTime = parseInt(restTimeStr, 10)

      if (!isNaN(seconds) && !isNaN(restTime)) {
        return {
          series: serie,
          reps: null,
          exerciseTime: seconds,
          restTime: restTime,
        }
      }
    }
  }

  if (segOccurrences === 1 && lowerCasedInput.endsWith('seg')) {
    const parts = lowerCasedInput.split('x')
    if (parts.length === 2) {
      const serie = parts[0].trim()
      const secondsStr = parts[1].trim().replace(/seg$/i, '').trim()
      const seconds = parseInt(secondsStr, 10)
      if (!isNaN(seconds)) {
        return {
          series: serie,
          reps: null,
          exerciseTime: seconds,
          restTime: null,
        }
      }
    }
  }

  const xIndex = lowerCasedInput.indexOf('x')
  if (xIndex !== -1) {
    const serie = input.slice(0, xIndex).trim()
    const rep = input.slice(xIndex + 1).trim()
    if (serie && rep) {
      return {
        series: serie,
        reps: rep,
        exerciseTime: null,
        restTime: null,
      }
    }
  }

  return {
    series: input,
    reps: null,
    exerciseTime: null,
    restTime: null,
  }
}
