import type {
  ReactNode,
} from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
      
      {icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          {icon}
        </div>
      )}

      <h2 className="mt-5 text-xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && (
        <div className="mt-7">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;