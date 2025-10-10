import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center justify-center mb-6">
                            <AlertTriangle className="h-16 w-16 text-orange-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white text-center mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-300 text-center mb-6">
                            The app encountered an unexpected error. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <details className="mb-6 bg-black/60 rounded-xl p-4 border border-white/10">
                                <summary className="text-orange-400 cursor-pointer font-medium mb-2">
                                    Technical Details
                                </summary>
                                <pre className="text-xs text-gray-300 overflow-auto max-h-60">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={this.handleReset}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl"
                            >
                                Return to Home
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="border-white/20 text-white px-8 py-3 rounded-xl"
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
