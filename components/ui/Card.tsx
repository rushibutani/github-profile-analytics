import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "interactive";
  padding?: "sm" | "md" | "lg";
  className?: string;
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
}: CardProps) {
  const baseClasses = "bg-card border border-border/50 rounded-2xl shadow-sm";
  const variantClasses =
    variant === "interactive" ? "hover:shadow-md transition-shadow" : "";
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }[padding];

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${paddingClasses} ${className}`}
    >
      {children}
    </div>
  );
}
