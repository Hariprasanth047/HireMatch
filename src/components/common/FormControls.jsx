export function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span>{label}</span>}
      <input className={`mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </label>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span>{label}</span>}
      <textarea className={`mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </label>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span>{label}</span>}
      <select className={`mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </label>
  );
}
