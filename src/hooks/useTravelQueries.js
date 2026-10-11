import { useQuery } from '@tanstack/react-query';
import { getPost, getPosts } from '../api/posts';
export const usePosts = () => useQuery({ queryKey: ['posts'], queryFn: getPosts });
export const usePost = (id) => useQuery({ queryKey: ['post', id], queryFn: ({ signal }) => getPost(id, { signal }), enabled: Boolean(id) });
