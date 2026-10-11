import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { createComment } from '../../api/posts';
import { useAuth } from '../../context/AuthContext';
import { usePost } from '../../hooks/useTravelQueries';
import { applyApiErrors, textRules } from '../../utils/validation';
import FormPanel from '../../components/FormPanel/FormPanel';
import FormField from '../../components/FormField/FormField';
import TextareaField from '../../components/TextareaField/TextareaField';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Status from '../../components/Status/Status';
export default function CreateCommentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const post = usePost(id);
  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({ defaultValues: { full_name: user?.full_name || '', comment: '' } });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const client = useQueryClient();
  const navigate = useNavigate();
  async function submit(values) {
    setMessage('');
    try {
      await createComment(id, { full_name: values.full_name.trim(), comment: values.comment.trim() });
      client.invalidateQueries({ queryKey: ['post', id] });
      setSuccess(true);
    } catch (error) { setMessage(applyApiErrors(error, setError, { author_name: 'full_name' })); }
  }
  if (post.isPending) return <Status loading />;
  if (post.isError) return <Status error={post.error} onRetry={() => post.refetch()} />;
  return <FormPanel title="Добавление отзыва">
    <form className="form" noValidate onSubmit={handleSubmit(submit)} aria-busy={isSubmitting}>
      {message && <p className="form__message form__message--error" role="alert">{message}</p>}
      <FormField label="Ваше имя" placeholder="Ваше имя" autoComplete="name" maxLength={255} required error={errors.full_name} registration={register('full_name', textRules(255))} disabled={isSubmitting || success} />
      <div className="form__comment-end">
        <TextareaField label="Отзыв" placeholder="Добавьте текст отзыва" maxLength={600} count={watch('comment').length} required error={errors.comment} registration={register('comment', textRules(600))} disabled={isSubmitting || success} />
        <div className="form__actions form__actions--spaced"><Button to={`/posts/${id}`} variant="outline" icon="arrow-left">Назад</Button><Button type="submit" busy={isSubmitting} disabled={success}>{isSubmitting ? 'Сохраняем…' : 'Сохранить'}</Button></div>
      </div>
    </form>
    <Modal open={success} message="Ваш отзыв успешно добавлен" onClose={() => navigate(`/posts/${id}`)} />
  </FormPanel>;
}
