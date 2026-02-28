import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "gold";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-oak-200 text-oak-800",
    success: "bg-forest/10 text-forest-dark",
    warning: "bg-gold/20 text-gold-dark",
    gold: "bg-gold text-oak-900",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
