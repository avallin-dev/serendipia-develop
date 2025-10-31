export default function createDateWithTime(timeString: string) {
  const currentDate = new Date()

  const [hours, minutes] = timeString.split(':').map(Number)
  currentDate.setHours(hours, minutes, 0, 0)

  return currentDate
}
