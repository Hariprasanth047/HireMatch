import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-3" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="flex min-w-72 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm shadow-soft dark:border-slate-700 dark:bg-slate-900">
            {toast.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Info className="h-5 w-5 text-blue-500" />}
            <span className="flex-1 text-slate-800 dark:text-slate-100">{toast.message}</span>
            <button aria-label="Dismiss notification" onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}>
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
