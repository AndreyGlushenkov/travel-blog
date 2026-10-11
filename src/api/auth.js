import { request } from './client';
export const login = (data) => request('/api/login', { method: 'POST', body: data, auth: false });
export const register = (data) => request('/api/register', { method: 'POST', body: data, auth: false });
export const logout = () => request('/api/logout');
