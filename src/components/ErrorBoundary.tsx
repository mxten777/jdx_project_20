import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 에러 로깅 서비스에 전송 (예: Sentry)
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen premium-bg flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md mx-auto p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                오류가 발생했습니다
              </h1>
              <p className="text-white/80 mb-6">
                예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.
              </p>
              <button
                className="btn-premium-main px-6 py-3"
                onClick={() => window.location.reload()}
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
