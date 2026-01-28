import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "active"
    | "moderate"
    | "stale"
    | "archived"
    | "featured"
    | "latest"
    | "default";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  const baseClasses = "font-mono rounded border inline-flex items-center";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  }[size];

  const variantClasses = {
    active: "bg-success/10 text-success border-success/20",
    moderate: "bg-warning/10 text-warning border-warning/20",
    stale: "bg-muted/10 text-muted border-muted/20",
    archived: "bg-muted/10 text-muted border-muted/20",
    featured: "bg-accent/20 text-accent border-accent/30",
    latest: "bg-accent/20 text-accent border-accent/30",
    default: "bg-surface text-foreground border-border",
  }[variant];

  return (
    <span
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
