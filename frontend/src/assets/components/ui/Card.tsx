import type {
  HTMLAttributes,
  ReactNode,
} from "react";

interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = ({
  children,
  padding = "md",
  hover = false,
  className = "",
  ...props
}: CardProps) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      {...props}
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
        hover
          ? "transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          : ""
      } ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;