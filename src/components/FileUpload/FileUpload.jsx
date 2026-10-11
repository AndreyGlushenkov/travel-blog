import { useId } from 'react';
import { usePreview } from '../../hooks/usePreview';
import Icon from '../Icon/Icon';
export default function FileUpload({ value, onChange, onBlur, inputRef, error, disabled = false, label = 'Загрузите ваше фото', variant = 'default' }) {
  const id = useId();
  const preview = usePreview(value);
  return <div className={`file-upload file-upload--${variant}`}>
    {preview && <img className="file-upload__preview" src={preview} alt="Предпросмотр выбранной фотографии" />}
    <label className={`file-upload__label${disabled ? ' file-upload__label--disabled' : ''}`} htmlFor={id}>
      <Icon name={variant === 'profile' ? 'camera' : 'upload'} className="file-upload__icon" /><span>{label}</span>
      <input id={id} ref={inputRef} className="file-upload__input" type="file" accept="image/jpeg,image/png" onBlur={onBlur} onChange={(event) => { onChange(event.target.files?.[0] || null); event.target.value = ''; }} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
    </label>
    {value && <div className="file-upload__selection"><span>{value.name}</span><button type="button" onClick={() => onChange(null)} disabled={disabled} aria-label="Убрать выбранную фотографию"><Icon name="close" /></button></div>}
    {error && <p className="file-upload__error" id={`${id}-error`}>{error.message}</p>}
  </div>;
}
