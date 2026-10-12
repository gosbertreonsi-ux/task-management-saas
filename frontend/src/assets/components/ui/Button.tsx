import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import {
  Loader2,
} from "lucide-react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = ({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-100",

    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-100",

    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-100",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <Loader2
          size={16}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
};

export default Button;