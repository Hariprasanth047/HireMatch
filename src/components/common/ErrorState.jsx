import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ onRetry }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
      <AlertTriangle className="mx-auto h-8 w-8" />
      <h3 className="mt-2 font-semibold">Something went wrong.</h3>
      <Button className="mt-4" variant="danger" onClick={onRetry}>Try Again</Button>
    </div>
  );
}
