import { useEffect, useId, useRef } from 'react';
import Icon from '../Icon/Icon';
export default function Modal({ open, message, onClose }) {
  const ref = useRef(null);
  const title = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [open]);
  return <dialog ref={ref} className="modal" aria-labelledby={title} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) { const rect = ref.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <button type="button" className="modal__close" aria-label="Закрыть сообщение и продолжить" onClick={onClose} autoFocus><Icon name="close" /></button>
    <p className="modal__message" id={title}>{message}</p>
  </dialog>;
}
