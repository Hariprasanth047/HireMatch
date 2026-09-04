import { SearchX } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title, message, action, onAction }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
      <SearchX className="mx-auto h-10 w-10 text-slate-400" />
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
      {action && <Button className="mt-4" onClick={onAction}>{action}</Button>}
    </div>
  );
}
