import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-md mx-auto mt-10 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Something went wrong</h1>
          <div className="mb-4">
            <p className="text-red-600 dark:text-red-300">{this.state.error?.toString()}</p>
          </div>
          {this.state.errorInfo && (
            <details className="mt-4 p-4 bg-white/50 dark:bg-black/50 rounded border border-red-100 dark:border-red-800">
              <summary className="cursor-pointer font-medium mb-2">Stack trace</summary>
              <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-900 rounded">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button 
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
