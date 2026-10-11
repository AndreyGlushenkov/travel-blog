import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from '../Container/Container';
import Icon from '../Icon/Icon';

export default function Header() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (!menuRef.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  async function handleLogout() {
    setLeaving(true);
    let notice = '';
    try { await logout(); } catch { notice = 'Вы вышли на этом устройстве. Сервер не подтвердил завершение сессии.'; }
    finally { setLeaving(false); setOpen(false); navigate('/', { state: { notice } }); }
  }
  return <header className={`header${home ? ' header--home' : ''}`}>
    <Container className="header__container">
      <div className="header__navigation">
        <Link to="/" className="header__logo" aria-label="TravelBlog — на главную"><Icon name="logo-travel" /></Link>
        {isAuthenticated ? <div className="header__account" ref={menuRef}>
          <button className="header__toggle" type="button" ref={toggleRef} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="user-menu">
            <span className="header__avatar" aria-hidden="true">{(user?.full_name || 'П').slice(0, 1).toUpperCase()}</span>
            <span className="header__name">{user?.full_name || 'Профиль'}</span><Icon name={open ? 'chevron-up' : 'chevron-down'} className="header__chevron" />
          </button>
          {open && <nav className="header__menu" id="user-menu" aria-label="Личный кабинет">
            <Link to="/profile">Профиль</Link>
            <button type="button" onClick={handleLogout} disabled={leaving}>{leaving ? 'Выходим…' : 'Выйти'}</button>
          </nav>}
        </div> : <Link className="header__login" to="/login">Войти</Link>}
      </div>
      <div className="header__title">{home ? 'Там, где мир начинается с путешествий' : 'Истории ваших путешествий'}</div>
    </Container>
  </header>;
}
