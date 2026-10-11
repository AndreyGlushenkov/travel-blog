import { request } from './client';
import { normalizeUser } from './adapters';
export async function getUser({ signal } = {}) { return normalizeUser(await request('/api/user', { signal })); }
export async function updateUser(data) {
  const body = new FormData();
  ['full_name', 'city', 'bio'].forEach((field) => body.append(field, data[field] ?? ''));
  if (data.photo) body.append('photo', data.photo);
  return normalizeUser(await request('/api/user', { method: 'POST', body }));
}
export const updatePassword = (password) => request('/api/user/password', { method: 'PATCH', body: { password } });
