import isSameDay from './isSameDay'
import isValidDate from './isValidDate'

export default function (date) {
  if (!isValidDate(date)) return ''
  const d = new Date(date)
  const now = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (isSameDay(d, now)) return 'Сегодня'
  if (isSameDay(d, yesterday)) return 'Вчера'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(d)
}
