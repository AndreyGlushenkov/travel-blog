import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';

export default function Button({ to, children, variant = 'primary', icon, className = '', type = 'button', busy = false, disabled = false, ...props }) {
  const classes = `button button--${variant} ${className}`;
  const content = <>{icon && <Icon name={icon} className="button__icon" />}<span>{children}</span></>;
  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
  return <button type={type} className={classes} disabled={disabled || busy} aria-busy={busy || undefined} {...props}>{content}</button>;
}
