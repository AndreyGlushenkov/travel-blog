import { Link } from 'react-router-dom';
import Media from '../Media/Media';
export default function PostCard({ post }) {
  const location = [post.country, post.city].filter(Boolean).join(', ');
  return <article className="post-card">
    <Link className="post-card__image-link" to={`/posts/${post.id}`} tabIndex={-1} aria-hidden="true"><Media src={post.photo} alt={post.title} className="post-card__image" /></Link>
    <div className="post-card__content">
      <h2 className="post-card__title"><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
      <p className="post-card__description">{post.excerpt || post.description || ''}</p>
      <div className="post-card__bottom">{location && <p className="post-card__location">{location}</p>}<Link className="post-card__link" to={`/posts/${post.id}`} aria-label={`Подробнее: ${post.title}`}>Подробнее</Link></div>
    </div>
  </article>;
}
