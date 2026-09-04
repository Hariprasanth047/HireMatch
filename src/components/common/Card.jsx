export default function Card({ children, className = '' }) {
  return <section className={`rounded-lg border border-white/70 bg-white/95 text-slate-900 shadow-soft backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/95 dark:text-slate-100 ${className}`}>{children}</section>;
}
