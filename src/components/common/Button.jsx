export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-glow hover:from-primary-700 hover:to-indigo-700',
    secondary: 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-cyan-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800',
    outline: 'border border-primary-200 bg-white/80 text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:bg-slate-900/80 dark:text-primary-100 dark:hover:bg-primary-950',
    danger: 'bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700',
    ghost: 'text-slate-700 hover:bg-cyan-50 hover:text-primary-700 dark:text-slate-200 dark:hover:bg-slate-800',
  };
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
