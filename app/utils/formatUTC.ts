export default function formatUTC(date?: Date) {
  if (date) {
    const selectedDate = new Date(date!)
    const utcDate = new Date(
      selectedDate.getUTCFullYear(),
      selectedDate.getUTCMonth(),
      selectedDate.getUTCDate()
    )

    return utcDate
  } else {
    return undefined
  }
}
