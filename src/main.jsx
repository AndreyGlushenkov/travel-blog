import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import App from './app/App';
import './styles/style.scss';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30000, retry: false, refetchOnWindowFocus: false } } });
createRoot(document.getElementById('root')).render(<StrictMode><QueryClientProvider client={queryClient}><BrowserRouter><ErrorBoundary><AuthProvider><App /></AuthProvider></ErrorBoundary></BrowserRouter></QueryClientProvider></StrictMode>);
