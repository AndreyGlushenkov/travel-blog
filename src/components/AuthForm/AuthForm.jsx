import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applyApiErrors, emailRules, required } from '../../utils/validation';
import FormPanel from '../FormPanel/FormPanel';
import FormField from '../FormField/FormField';
import Button from '../Button/Button';

export default function AuthForm({ mode }) {
  const registering = mode === 'register';
  const { authenticate, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = typeof location.state?.from === 'string' && location.state.from.startsWith('/') && !location.state.from.startsWith('//') && !['/login', '/register'].includes(location.state.from) ? location.state.from : '/';
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting }, setError } = useForm({ defaultValues: { email: '', password: '', confirmation: '' } });
  const [message, setMessage] = useState('');
  async function submit(values) {
    setMessage('');
    try { await authenticate(mode, { email: values.email.trim(), password: values.password }); navigate(from, { replace: true }); }
    catch (error) {
      const message = applyApiErrors(error, setError);
      if (!registering && error.status === 401) {
        setError('email', { type: 'server', message: 'Неправильный логин или пароль' });
        setError('password', { type: 'server', message: 'Неправильный логин или пароль' });
        setMessage('Неправильный логин или пароль');
      } else setMessage(message);
    }
  }
  if (isAuthenticated) return <Navigate to={from} replace />;
  return <FormPanel title={registering ? 'Регистрация' : 'Вход в профиль'}>
    <form className={`form auth-form${registering ? ' auth-form--register' : ''}`} noValidate onSubmit={handleSubmit(submit)} aria-busy={isSubmitting}>
      {message && <p className="form__message form__message--error" role="alert">{message}</p>}
      <FormField label={registering ? 'Email' : 'Логин'} type="email" inputMode="email" autoComplete="email" placeholder="Email" required error={errors.email} registration={register('email', emailRules)} disabled={isSubmitting} />
      <div className={registering ? 'form__row' : 'form__column'}>
        <FormField label="Пароль" type="password" autoComplete={registering ? 'new-password' : 'current-password'} placeholder="Пароль" required error={errors.password} registration={register('password', { required })} disabled={isSubmitting} />
        {registering && <FormField label="Повторите пароль" type="password" autoComplete="new-password" placeholder="Повторите пароль" required error={errors.confirmation} registration={register('confirmation', { required, validate: (value) => value === getValues('password') || 'Пароли не совпадают' })} disabled={isSubmitting} />}
      </div>
      <div className={`form__actions${registering ? '' : ' form__actions--spaced'}`}>
        {!registering && <Button to="/register" state={{ from }} variant="outline" className="auth-form__register-button">Зарегистрироваться</Button>}
        <Button type="submit" busy={isSubmitting} className={registering ? 'auth-form__register-button' : 'auth-form__login-button'}>{isSubmitting ? 'Подождите…' : registering ? 'Зарегистрироваться' : 'Войти'}</Button>
      </div>
    </form>
  </FormPanel>;
}
