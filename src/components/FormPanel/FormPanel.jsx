export default function FormPanel({ title, children, variant }) {
  return <section className={`form-panel${variant ? ` form-panel--${variant}` : ''}`}><div className="form-panel__content"><h1 className="form-panel__title">{title}</h1>{children}</div></section>;
}
