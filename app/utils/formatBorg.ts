function formatBorg(
  borg?:
    | string
    | 'ONE'
    | 'TWO'
    | 'THREE'
    | 'FOUR'
    | 'FIVE'
    | 'SIX'
    | 'SEVEN'
    | 'EIGHT'
    | 'NINE'
    | 'TEN'
) {
  if (!borg) return '--'
  if (borg === 'ONE') return 'Muy malo'
  if (borg === 'TWO') return 'Malo'
  if (borg === 'THREE') return 'Regular'
  if (borg === 'FOUR') return 'Bueno'
  if (borg === 'FIVE') return 'Muy bueno'
  if (borg === 'SIX') return 'Excelente'
  if (borg === 'SEVEN') return 'Perfecto'
  if (borg === 'EIGHT') return 'Muy bueno'
  if (borg === 'NINE') return 'Excelente'
  if (borg === 'TEN') return 'Perfecto'
}

export default formatBorg
