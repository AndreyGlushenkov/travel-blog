import { tokenStorage } from '../utils/tokenStorage';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://travelblog.skillbox.cc').replace(/\/+$/, '');
let onUnauthorized = () => {};
export function setUnauthorizedHandler(handler) { onUnauthorized = handler; }

export class ApiError extends Error {
  constructor(message, status, fields = {}) { super(message); this.name = 'ApiError'; this.status = status; this.fields = fields; }
}

export async function request(path, { method = 'GET', body, signal, auth = true } = {}) {
  const token = auth ? tokenStorage.get() : null;
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const multipart = body instanceof FormData;
  if (body && !multipart) headers['Content-Type'] = 'application/json';
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 30000);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method, headers, body: body ? (multipart ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal, credentials: 'omit',
    });
    // Handle upload rejection before reading a potentially missing/HTML response body.
    if (response.status === 413) {
      const message = 'Фотография или объём запроса превышает допустимый размер на сервере. Уменьшите размер фотографии и попробуйте снова.';
      throw new ApiError(message, 413, multipart ? { photo: message } : {});
    }
    let text;
    try { text = await response.text(); }
    catch (error) {
      if (signal?.aborted) throw error;
      if (!response.ok) throw new ApiError(`Сервер отклонил запрос (HTTP ${response.status}). Попробуйте ещё раз.`, response.status);
      throw error;
    }
    let data;
    let validJson = true;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; validJson = false; }
    if (!response.ok) {
      if (response.status === 401 && token) onUnauthorized();
      const fields = data?.errors || (data && typeof data === 'object' ? Object.fromEntries(Object.entries(data).filter(([key]) => !['message', 'error'].includes(key))) : {});
      const fallback = response.status === 401 ? 'Сессия завершена. Войдите снова.' : response.status === 404 ? 'Запрашиваемая страница не найдена.' : 'Не удалось выполнить запрос. Попробуйте ещё раз.';
      throw new ApiError(data?.message || data?.error || fallback, response.status, fields);
    }
    if (!validJson) throw new ApiError('Сервер вернул неожиданный ответ. Попробуйте позже.', response.status);
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (signal?.aborted) throw error;
    if (error.name === 'AbortError') throw new ApiError('Сервер не ответил вовремя. Повторите запрос.', 0);
    if (multipart && body.has('photo')) {
      // A CORS-blocked response and a network failure both reject Fetch without an HTTP status.
      throw new ApiError('Не удалось получить ответ на загрузку фотографии. Проверьте соединение и повторите попытку. Если изображение большое, попробуйте уменьшить его: ограничение сервера может мешать загрузке.', 0);
    }
    throw new ApiError('Не удалось связаться с сервером. Проверьте подключение к интернету.', 0);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
