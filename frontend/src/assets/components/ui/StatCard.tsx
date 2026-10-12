import type {
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  badge?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconClassName = "bg-slate-50 text-slate-600",
  badge,
}: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={21} />
        </div>
      </div>

      {badge && (
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;