import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  variant?: "default" | "compact";
}

export function MetricCard({
  label,
  value,
  icon,
  variant = "default",
}: MetricCardProps) {
  if (variant === "compact") {
    return (
      <div className="space-y-1">
        <div className="text-xl sm:text-2xl font-bold text-foreground">
          {value}
        </div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {icon && <div className="text-muted">{icon}</div>}
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
