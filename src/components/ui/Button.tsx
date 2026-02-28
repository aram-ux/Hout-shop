import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const variants = {
      primary:
        "bg-oak-800 text-white hover:bg-oak-700 active:bg-oak-900 shadow-sm",
      secondary:
        "bg-oak-100 text-oak-800 hover:bg-oak-200 active:bg-oak-300",
      outline:
        "border-2 border-oak-300 text-oak-800 hover:bg-oak-50 hover:border-oak-400",
      ghost:
        "text-oak-700 hover:bg-oak-100 hover:text-oak-900",
      gold:
        "bg-gold text-oak-900 hover:bg-gold-dark active:bg-gold-dark shadow-sm font-semibold",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-base gap-2",
      lg: "px-8 py-3.5 text-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
