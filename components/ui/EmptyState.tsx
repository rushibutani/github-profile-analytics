import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon,
  title = "No data available",
  description,
  action,
  size = "md",
}: EmptyStateProps) {
  const heightClasses = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
  }[size];

  const iconSizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }[size];

  const titleSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  return (
    <div
      className={`flex items-center justify-center ${heightClasses} text-muted`}
    >
      <div className="text-center space-y-3 max-w-md">
        {icon && (
          <div className={`mx-auto opacity-30 ${iconSizeClasses}`}>{icon}</div>
        )}
        <div className="space-y-2">
          <p className={`font-medium text-foreground ${titleSizeClasses}`}>
            {title}
          </p>
          {description && (
            <p className="text-sm text-muted/80">{description}</p>
          )}
        </div>
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  );
}
