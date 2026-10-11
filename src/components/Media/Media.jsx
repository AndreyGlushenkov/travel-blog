import { useEffect, useState } from 'react';
export default function Media({ src, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  if (!src || failed) return <div className={`media media--unavailable ${className}`} role="img" aria-label={`${alt}. Изображение недоступно`}>Фотография недоступна</div>;
  return <img className={`media ${className}`} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}
