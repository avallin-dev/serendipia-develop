export function formatUTC(date: Date) {
  const selectedDate = new Date(date!)
  const utcDate = new Date(
    Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedDate.getHours(),
      selectedDate.getMinutes(),
      0
    )
  )

  return utcDate
}

export default function formatTrulyUTC(date: Date | string) {
  const selectedDate = new Date(date!)
  const utcDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    selectedDate.getUTCHours(),
    selectedDate.getMinutes(),
    0
  )

  return utcDate
}
