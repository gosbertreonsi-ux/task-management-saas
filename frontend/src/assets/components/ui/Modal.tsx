import {
  useEffect,
  type ReactNode,
} from "react";

import {
  X,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      {/* BACKDROP */}

      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />

      {/* MODAL */}

      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl`}
      >
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="pr-8">
            <h2
              id="modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;