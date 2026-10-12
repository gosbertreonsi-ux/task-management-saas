import type {
  HTMLAttributes,
  ReactNode,
} from "react";

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;

  variant?:
    | "blue"
    | "green"
    | "yellow"
    | "red"
    | "slate"
    | "purple";

  icon?: ReactNode;
}

const Badge = ({
  children,
  variant = "slate",
  icon,
  className = "",
  ...props
}: BadgeProps) => {
  const variantClasses = {
    blue:
      "bg-blue-50 text-blue-700",

    green:
      "bg-emerald-50 text-emerald-700",

    yellow:
      "bg-amber-50 text-amber-700",

    red:
      "bg-red-50 text-red-700",

    slate:
      "bg-slate-100 text-slate-700",

    purple:
      "bg-purple-50 text-purple-700",
  };

  return (
    <span
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${variantClasses[variant]} ${className}`}
    >
      {icon}

      {children}
    </span>
  );
};

export default Badge;