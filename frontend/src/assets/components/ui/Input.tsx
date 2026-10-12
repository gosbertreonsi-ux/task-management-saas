import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = ({
  label,
  error,
  icon,
  id,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          {...props}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
            icon ? "pl-10" : ""
          } ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          } disabled:cursor-not-allowed disabled:bg-slate-50 ${className}`}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;