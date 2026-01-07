export default function (dateString: Date) {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return
  return `${hours}:${minutes}`
}
