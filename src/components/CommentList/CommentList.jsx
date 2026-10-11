import { formatDate } from '../../utils/formatDate';
export default function CommentList({ comments }) {
  return <section className="comment-list" aria-label="Отзывы путешественников">
    {comments.length === 0 ? <p className="comment-list__empty">Отзывов пока нет. Поделитесь первым впечатлением.</p> : comments.map((comment, index) => <article className="comment-card" key={comment.id || `${comment.created_at}-${index}`}>
      <h3 className="comment-card__name">{comment.author_name || comment.full_name || 'Путешественник'}</h3>
      {formatDate(comment.created_at) && <time className="comment-card__date" dateTime={comment.created_at}>{formatDate(comment.created_at)}</time>}
      <p className="comment-card__text">{comment.comment}</p>
    </article>)}
  </section>;
}
