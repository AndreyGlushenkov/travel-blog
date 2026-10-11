import Status from '../../components/Status/Status';
import Button from '../../components/Button/Button';
export default function NotFoundPage() { return <Status title="Страница не найдена"><h1 className="status__code">404</h1><p>Вернитесь к историям путешествий.</p><Button to="/">На главную</Button></Status>; }
