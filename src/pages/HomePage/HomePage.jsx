import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../hooks/useTravelQueries';
import Container from '../../components/Container/Container';
import PostList from '../../components/PostList/PostList';
import Status from '../../components/Status/Status';
import Button from '../../components/Button/Button';
export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const query = usePosts();
  const { state } = useLocation();
  return <Container className="home">
    <h1 className="visually-hidden">Истории путешествий</h1>
    {state?.notice && <p className="home__notice" role="status">{state.notice}</p>}
    {query.isPending ? <Status loading /> : query.isError ? <Status error={query.error} onRetry={() => query.refetch()} /> : query.data.length ? <PostList posts={query.data} /> : <Status title="Историй пока нет. Добавьте своё путешествие." />}
    <div className="home__actions"><Button to={isAuthenticated ? '/posts/new' : '/login'} state={isAuthenticated ? undefined : { from: '/posts/new' }}>Добавить моё путешествие</Button></div>
  </Container>;
}
