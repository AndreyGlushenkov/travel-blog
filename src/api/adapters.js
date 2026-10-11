import { API_BASE_URL } from './client';

export function imageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, `${API_BASE_URL}/`);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

export function normalizePost(post) {
  return { ...post, country: post.country || post.county || '', city: post.city || '', photo: imageUrl(post.photo), comments: Array.isArray(post.comments) ? post.comments : [], userInfo: post.userInfo || null };
}

export function normalizeUser(user) {
  // The API does not document an avatar URL. Do not construct one from an ID.
  return { ...user, full_name: user.full_name || '', city: user.city || '', bio: user.bio || '' };
}
