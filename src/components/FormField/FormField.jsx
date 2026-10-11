import { useId } from 'react';
export default function FormField({ label, error, required = false, hint, registration, ...props }) {
  const id = useId();
  return <div className={`form-field${error ? ' form-field--error' : ''}`}>
    <label className="form-field__label" htmlFor={id}>{required && <span className="form-field__required" aria-hidden="true">*</span>}{label}</label>
    <input id={id} className="form-field__input" aria-required={required || undefined} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} {...registration} {...props} />
    {error && <p className="form-field__error" id={`${id}-error`}>{error.message}</p>}
    {hint && !error && <p className="form-field__hint" id={`${id}-hint`}>{hint}</p>}
  </div>;
}
