"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-100 mb-2">
            Something went wrong
          </h3>
          <p className="text-zinc-500 max-w-sm mb-2">
            An error occurred while loading this content.
          </p>
          {this.state.error && (
            <p className="text-xs text-zinc-600 max-w-md mb-6 font-mono">
              {this.state.error.message}
            </p>
          )}
          <Button onClick={this.handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional error display component for use in route error components
interface ErrorDisplayProps {
  error?: Error | null;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-medium text-zinc-100 mb-2">
        Failed to load data
      </h3>
      <p className="text-zinc-500 max-w-sm mb-2">
        There was a problem loading the economic data.
      </p>
      {error && (
        <p className="text-xs text-zinc-600 max-w-md mb-6 font-mono">
          {error.message}
        </p>
      )}
      <Button 
        onClick={onRetry || (() => window.location.reload())} 
        variant="outline" 
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}
