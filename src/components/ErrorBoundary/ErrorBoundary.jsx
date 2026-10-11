import { Component } from 'react';
import Button from '../Button/Button';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="status" role="alert"><h1>Не удалось отобразить страницу</h1><p>Попробуйте обновить приложение.</p><Button onClick={() => window.location.reload()}>Обновить</Button></main>;
    return this.props.children;
  }
}
