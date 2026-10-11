import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../hooks/useTravelQueries';
import Media from '../../components/Media/Media';
import AuthorInfo from '../../components/AuthorInfo/AuthorInfo';
import CommentList from '../../components/CommentList/CommentList';
import Button from '../../components/Button/Button';
import Status from '../../components/Status/Status';
export default function PostDetailPage() {
  const { id } = useParams();
  const query = usePost(id);
  const { isAuthenticated } = useAuth();
  if (query.isPending) return <Status loading />;
  if (query.isError) return <Status error={query.error} onRetry={() => query.refetch()}><Button to="/" variant="outline">На главную</Button></Status>;
  const post = query.data;
  return <article className="post-detail">
    <Media key={post.photo} src={post.photo} alt={post.title} className="post-detail__image" eager />
    <div className="post-detail__content">
      <h1 className="post-detail__title">{post.title}</h1>
      {[post.country, post.city].filter(Boolean).length > 0 && <p className="post-detail__location">{[post.country, post.city].filter(Boolean).join(', ')}</p>}
      <p className="post-detail__description">{post.description}</p>
      <AuthorInfo author={post.userInfo} />
      <CommentList comments={post.comments} />
      <div className="post-detail__actions"><Button to="/" variant="outline" icon="arrow-left">Назад</Button>{isAuthenticated && <Button to={`/posts/${id}/comments/new`}>Ваше впечатление об этом месте</Button>}</div>
    </div>
  </article>;
}
