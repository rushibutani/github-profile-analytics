"use client";

import { Component, ReactNode } from "react";
import { WarningIcon } from "./Icon";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(
      `Error in ${this.props.componentName || "component"}:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-warning">
            <WarningIcon className="flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Unable to display {this.props.componentName || "this component"}
              </p>
              <p className="text-xs text-muted mt-1">
                This section encountered an error but the rest of the dashboard
                is working fine.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
