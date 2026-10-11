export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short' }).format(date);
}
