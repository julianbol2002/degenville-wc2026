"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] items-center justify-center p-8 text-center">
            <div className="glass-card rounded-xl p-8">
              <p className="text-lg font-semibold text-primary">Refreshing data...</p>
              <p className="mt-2 text-sm text-secondary">
                Something went wrong loading this page. It should recover on the next refresh.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
