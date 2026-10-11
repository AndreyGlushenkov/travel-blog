import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon/Icon';
import Status from '../../components/Status/Status';
import Button from '../../components/Button/Button';
export default function ProfilePage() {
  const { user, userError, refreshUser } = useAuth();
  const { state } = useLocation();
  if (!user) return <Status error={userError} title="Загружаем профиль…" onRetry={() => refreshUser()} />;
  return <section className="profile">
    <div className="profile__photo-column"><div className="profile__placeholder"><Icon name="camera" /><span>Фотография профиля недоступна</span></div><Link className="profile__photo-link" to="/profile/edit"><Icon name="camera" />Изменить фото</Link></div>
    <div className="profile__content"><div className="profile__heading"><h1 className="profile__name">{user.full_name || 'Мой профиль'}</h1><Link to="/profile/edit" className="profile__edit" aria-label="Редактировать профиль"><Icon name="edit" /></Link></div>
      <dl className="profile__information"><dt>Город:</dt><dd>{user.city || 'Не указан'}</dd><dt>О себе:</dt><dd>{user.bio || 'Расскажите о себе и своих путешествиях.'}</dd></dl>
      <Button to="/profile/edit" variant="outline" className="profile__mobile-edit">Редактировать профиль</Button>
      {state?.notice && <p className="profile__notice" role="status">{state.notice}</p>}
    </div>
  </section>;
}
