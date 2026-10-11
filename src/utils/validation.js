export const required = 'Заполните это поле';
export const emailRules = { required, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Введите корректный email' } };
export const textRules = (max, isRequired = true) => ({
  ...(isRequired ? { required, validate: (value) => Boolean(value?.trim()) || required } : {}),
  maxLength: { value: max, message: `Не более ${max} символов` },
});
export function validatePhoto(file, mandatory = false) {
  if (!file) return mandatory ? 'Загрузите фотографию' : true;
  if (!['image/jpeg', 'image/png'].includes(file.type)) return 'Выберите изображение JPEG или PNG';
  return true;
}
export function errorMessage(error) {
  const message = error?.message || 'Не удалось сохранить данные.';
  if (/credentials|password.*incorrect|invalid.*password|login.*incorrect|incorrect.*(email|password)/i.test(message)) return 'Неправильный логин или пароль';
  if (/email.*(taken|exists|already)|already.*email/i.test(message)) return 'Аккаунт с данным email уже существует';
  return message;
}
export function applyApiErrors(error, setError, aliases = {}) {
  for (const [field, value] of Object.entries(error?.fields || {})) {
    const message = Array.isArray(value) ? value.join(' ') : typeof value === 'string' ? value : null;
    if (message) setError(aliases[field] || field, { type: 'server', message: errorMessage({ message }) });
  }
  return errorMessage(error);
}
