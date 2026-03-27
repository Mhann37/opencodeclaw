import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('Visualizer runtime error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-6 border border-red-800/50 bg-red-900/20 rounded-xl text-red-400 text-sm">
            <p className="font-medium mb-2">Something went wrong rendering your artwork.</p>
            <p className="mb-4">
              Try adjusting your design or refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
