import PostCard from '../PostCard/PostCard';
export default function PostList({ posts }) { return <div className="post-list">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>; }
