export default function ProgressBar({ value, label }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}
