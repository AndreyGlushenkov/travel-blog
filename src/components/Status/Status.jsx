import Button from '../Button/Button';
export default function Status({ loading = false, error, title, children, onRetry }) {
  return <div className={`status${error ? ' status--error' : ''}`} role={error ? 'alert' : 'status'} aria-live="polite">
    {loading && <span className="status__loader" aria-hidden="true" />}
    <p className="status__title">{loading ? 'Загружаем путешествия…' : error?.message || title}</p>
    {children}
    {onRetry && <Button variant="outline" onClick={onRetry}>Попробовать снова</Button>}
  </div>;
}
