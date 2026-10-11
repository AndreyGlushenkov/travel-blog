import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Router from './router';

const titles = { '/': 'Истории путешествий', '/login': 'Вход', '/register': 'Регистрация', '/posts/new': 'Добавление путешествия', '/profile': 'Мой профиль', '/profile/edit': 'Редактирование профиля' };
export default function App() {
  const { pathname } = useLocation();
  const main = useRef(null);
  useEffect(() => {
    document.title = `${titles[pathname] || (pathname.endsWith('/comments/new') ? 'Добавление отзыва' : 'Путешествие')} — TravelBlog`;
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);
  return <><a className="skip-link" href="#main-content">Перейти к содержимому</a><Header /><main id="main-content" className="main" tabIndex={-1} ref={main}><Router /></main></>;
}
