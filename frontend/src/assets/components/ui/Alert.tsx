import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

interface AlertProps {
  message: string;
  variant?:
    | "success"
    | "error"
    | "warning"
    | "info";
  onClose?: () => void;
}

const Alert = ({
  message,
  variant = "info",
  onClose,
}: AlertProps) => {
  const config = {
    success: {
      wrapper:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },

    error: {
      wrapper:
        "border-red-200 bg-red-50 text-red-700",
      icon: AlertCircle,
    },

    warning: {
      wrapper:
        "border-amber-200 bg-amber-50 text-amber-700",
      icon: TriangleAlert,
    },

    info: {
      wrapper:
        "border-blue-200 bg-blue-50 text-blue-700",
      icon: Info,
    },
  };

  const Icon =
    config[variant].icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${config[variant].wrapper}`}
      role="alert"
    >
      <Icon
        size={18}
        className="mt-0.5 shrink-0"
      />

      <p className="flex-1">
        {message}
      </p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 transition hover:bg-black/5"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;