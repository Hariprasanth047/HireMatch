import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-extrabold text-ink-950 dark:text-white">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary-500 via-indigo-600 to-accent-500 text-white shadow-glow"><Sparkles className="h-5 w-5" /></span>
      <span><span className="block leading-5 tracking-tight">HireMatch</span><span className="block text-xs font-semibold text-primary-700 dark:text-cyan-200">Smart Resume Matching</span></span>
    </Link>
  );
}
