import { useId } from 'react';
export default function TextareaField({ label, error, required = false, registration, count = 0, maxLength, ...props }) {
  const id = useId();
  return <div className={`form-field${error ? ' form-field--error' : ''}`}>
    <label className="form-field__label" htmlFor={id}>{required && <span className="form-field__required" aria-hidden="true">*</span>}{label}</label>
    <textarea id={id} className="form-field__textarea" maxLength={maxLength} aria-required={required || undefined} aria-invalid={Boolean(error)} aria-describedby={`${id}-count${error ? ` ${id}-error` : ''}`} {...registration} {...props} />
    <div className="form-field__underneath">{error && <p className="form-field__error" id={`${id}-error`}>{error.message}</p>}<span className="form-field__count" id={`${id}-count`}>{count} / {maxLength.toLocaleString('ru-RU')}</span></div>
  </div>;
}
