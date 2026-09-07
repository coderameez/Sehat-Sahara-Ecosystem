import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an unhandled render error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-500 mb-2 max-w-xs">
            A temporary display error occurred. Your saved information is safe.
          </p>
          {this.state.error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5 mb-6 max-w-sm font-mono break-all text-left">
              {this.state.error.message}
            </p>
          )}
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={this.handleReload}
              className="w-full py-3.5 bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
