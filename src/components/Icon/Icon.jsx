import sprite from '../../assets/sprite/sprite.svg';

const boxes = {
  'logo-travel': '0 0 181.571411 41', 'logo-mark': '0 0 40.5 29.5',
  'arrow-left': '0 0 24 24', 'arrow-up': '0 0 24 24', close: '0 0 21.248407 24',
  camera: '0 0 32 32', edit: '0 0 32 32', upload: '0 0 36 36',
  'chevron-up': '0 0 14 11', 'chevron-down': '0 0 14 11', 'textarea-resize': '0 0 8.353546 8.353554',
};
export default function Icon({ name, className = '' }) {
  return <svg className={`icon ${className}`} viewBox={boxes[name] || '0 0 24 24'} aria-hidden="true" focusable="false"><use href={`${sprite}#${name}`} /></svg>;
}
