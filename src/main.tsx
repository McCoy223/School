import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkRootProvider } from './components/ClerkIntegration';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for standalone computer app & offline caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('School Management System update available');
  },
  onOfflineReady() {
    console.log('School Management System is ready to run offline as a standalone desktop app');
  }
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error caught by RootErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 text-stone-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-300 shadow-md text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-900">
              St. Andrew's Academy Portal
            </h1>
            <p className="text-sm text-stone-600">
              The application encountered an issue while loading. Please refresh or reset your session.
            </p>
            {this.state.error && (
              <pre className="text-left bg-stone-50 p-3 rounded-lg text-xs text-red-700 border border-stone-200 overflow-x-auto max-h-36">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                Reload Application
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {
                    // ignore
                  }
                  window.location.reload();
                }}
                className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Clear Local Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <RootErrorBoundary>
      <ClerkRootProvider>
        <App />
      </ClerkRootProvider>
    </RootErrorBoundary>
  );
}

