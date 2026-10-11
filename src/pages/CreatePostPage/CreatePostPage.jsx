import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/posts';
import { applyApiErrors, textRules, validatePhoto } from '../../utils/validation';
import FormPanel from '../../components/FormPanel/FormPanel';
import FormField from '../../components/FormField/FormField';
import TextareaField from '../../components/TextareaField/TextareaField';
import FileUpload from '../../components/FileUpload/FileUpload';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
export default function CreatePostPage() {
  const form = useForm({ defaultValues: { title: '', description: '', country: '', city: '', photo: null } });
  const { register, control, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = form;
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState(null);
  const client = useQueryClient();
  const navigate = useNavigate();
  async function submit(values) {
    setMessage('');
    try {
      const post = await createPost({ ...values, title: values.title.trim(), country: values.country.trim(), city: values.city.trim(), description: values.description.trim() });
      if (post.id) client.setQueryData(['post', String(post.id)], post);
      client.invalidateQueries({ queryKey: ['posts'] });
      setCreated(post);
    } catch (error) { setMessage(applyApiErrors(error, setError, { county: 'country' })); }
  }
  return <FormPanel title="Добавление истории о путешествии" variant="create-post">
    <form className="form" noValidate onSubmit={handleSubmit(submit)} aria-busy={isSubmitting}>
      {message && <p className="form__message form__message--error" role="alert">{message}</p>}
      <Controller name="photo" control={control} rules={{ validate: (file) => validatePhoto(file, true) }} render={({ field }) => <FileUpload value={field.value} onChange={field.onChange} onBlur={field.onBlur} inputRef={field.ref} error={errors.photo} disabled={isSubmitting || Boolean(created)} />} />
      <FormField label="Заголовок" placeholder="Заголовок" maxLength={255} required error={errors.title} registration={register('title', textRules(255))} disabled={isSubmitting || Boolean(created)} />
      <div className="form__row">
        <FormField label="Страна" placeholder="Страна" maxLength={255} required error={errors.country} registration={register('country', textRules(255))} disabled={isSubmitting || Boolean(created)} />
        <FormField label="Город" placeholder="Город" maxLength={255} required error={errors.city} registration={register('city', textRules(255))} disabled={isSubmitting || Boolean(created)} />
      </div>
      <TextareaField label="Описание" placeholder="Добавьте описание вашей истории" required maxLength={2000} count={watch('description').length} error={errors.description} registration={register('description', textRules(2000))} disabled={isSubmitting || Boolean(created)} />
      <div className="form__actions form__actions--spaced"><Button to="/" variant="outline" icon="arrow-left">Назад</Button><Button type="submit" busy={isSubmitting} disabled={Boolean(created)}>{isSubmitting ? 'Сохраняем…' : 'Сохранить'}</Button></div>
    </form>
    <Modal open={Boolean(created)} message="Ваша история успешно добавлена" onClose={() => navigate(created?.id ? `/posts/${created.id}` : '/')} />
  </FormPanel>;
}
