import { request } from './client';
import { normalizePost } from './adapters';
export async function getPosts({ signal } = {}) {
  const data = await request('/api/posts', { signal, auth: false });
  if (!Array.isArray(data)) throw new Error('Сервер вернул некорректный список путешествий.');
  return data.map(normalizePost);
}
export async function getPost(id, { signal } = {}) { return normalizePost(await request(`/api/posts/${encodeURIComponent(id)}`, { signal, auth: false })); }
export async function createPost(data) {
  const body = new FormData();
  ['title', 'description', 'country', 'city', 'photo'].forEach((field) => body.append(field, data[field]));
  return normalizePost(await request('/api/posts', { method: 'POST', body }));
}
export const createComment = (id, data) => request(`/api/posts/${encodeURIComponent(id)}/comments`, { method: 'POST', body: data });
