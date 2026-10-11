import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { updatePassword, updateUser } from '../../api/user';
import { useAuth } from '../../context/AuthContext';
import { applyApiErrors, errorMessage, textRules, validatePhoto } from '../../utils/validation';
import FormField from '../../components/FormField/FormField';
import TextareaField from '../../components/TextareaField/TextareaField';
import FileUpload from '../../components/FileUpload/FileUpload';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
import Status from '../../components/Status/Status';

function ProfileEditor({ user }) {
  const { register, control, handleSubmit, watch, getValues, resetField, setError, formState: { errors, isSubmitting } } = useForm({ defaultValues: { full_name: user.full_name, city: user.city, bio: user.bio, photo: null, password: '', confirmation: '' } });
  const client = useQueryClient();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  async function submit(values) {
    setFeedback(null);
    const jobs = [updateUser({ ...values, full_name: values.full_name.trim(), city: values.city.trim() })];
    if (values.password) jobs.push(updatePassword(values.password));
    const results = await Promise.allSettled(jobs);
    const profileResult = results[0];
    const passwordResult = results[1];
    const notices = [];
    if (profileResult.status === 'fulfilled') {
      client.setQueryData(['user'], profileResult.value);
      notices.push('Данные профиля сохранены.');
      if (values.photo) { notices.push('Запрос с фотографией выполнен. Проверить сохранение фотографии и получить её для профиля пока невозможно.'); resetField('photo'); }
    } else {
      applyApiErrors(profileResult.reason, setError);
      notices.push(`Профиль не сохранён: ${errorMessage(profileResult.reason)}`);
    }
    if (passwordResult?.status === 'fulfilled') {
      notices.push('Пароль изменён.');
      resetField('password'); resetField('confirmation');
    } else if (passwordResult?.status === 'rejected') {
      applyApiErrors(passwordResult.reason, setError);
      notices.push(`Пароль не изменён: ${errorMessage(passwordResult.reason)}`);
    }
    const failed = results.some((r) => r.status === 'rejected');
    if (failed) setFeedback({ failed, text: notices.join(' ') });
    else navigate('/profile', { replace: true, state: { notice: notices.join(' ') } });
  }
  return <section className="profile profile--editing">
    <h1 className="visually-hidden">Редактирование профиля</h1>
    <form className="profile__form" noValidate onSubmit={handleSubmit(submit)} aria-busy={isSubmitting}>
      <div className="profile__photo-column">
        {!watch('photo') && <div className="profile__placeholder"><Icon name="camera" /><span>Выберите фотографию</span></div>}
        <Controller name="photo" control={control} rules={{ validate: (file) => validatePhoto(file) }} render={({ field }) => <FileUpload variant="profile" label="Изменить фото" value={field.value} onChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} error={errors.photo} disabled={isSubmitting} />} />
      </div>
      <div className="form profile__fields">
        {feedback && <p className={`form__message form__message--${feedback.failed ? 'error' : 'success'}`} role={feedback.failed ? 'alert' : 'status'}>{feedback.text}</p>}
        <FormField label="ФИО" autoComplete="name" maxLength={255} required error={errors.full_name} registration={register('full_name', textRules(255))} disabled={isSubmitting} />
        <FormField label="Город" autoComplete="address-level2" maxLength={255} error={errors.city} registration={register('city', textRules(255, false))} disabled={isSubmitting} />
        <TextareaField label="О себе" maxLength={600} count={watch('bio').length} error={errors.bio} registration={register('bio', textRules(600, false))} disabled={isSubmitting} />
        <fieldset className="form__fieldset"><legend className="form__legend">Смена пароля</legend>
          <div className="form__row"><FormField label="Новый пароль" type="password" autoComplete="new-password" placeholder="Новый пароль" error={errors.password} registration={register('password', { validate: (value) => !getValues('confirmation') || Boolean(value) || 'Введите новый пароль' })} disabled={isSubmitting} />
          <FormField label="Повторите пароль" type="password" autoComplete="new-password" placeholder="Повторите пароль" error={errors.confirmation} registration={register('confirmation', { validate: (value) => value === getValues('password') || 'Пароли не совпадают' })} disabled={isSubmitting} /></div>
        </fieldset>
        <div className="form__actions form__actions--spaced"><Button to="/profile" variant="outline" className="profile__back">Назад</Button><Button type="submit" busy={isSubmitting}>{isSubmitting ? 'Сохраняем…' : 'Сохранить'}</Button></div>
      </div>
    </form>
  </section>;
}
export default function EditProfilePage() {
  const { user, userError, refreshUser } = useAuth();
  if (!user) return <Status error={userError} title="Загружаем профиль…" onRetry={() => refreshUser()} />;
  return <ProfileEditor user={user} />;
}
