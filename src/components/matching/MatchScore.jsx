import { matchTone } from '../../utils/matching';

export default function MatchScore({ score = 0, size = 'md', showLabel = true }) {
  const tone = matchTone(score);
  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-lg';
  const toneClass = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50',
    amber: 'text-amber-700 bg-amber-50 dark:bg-amber-950/50',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50',
  }[tone.color];

  return (
    <div className={`inline-flex items-center gap-2 rounded-md px-3 py-2 font-bold ${toneClass}`}>
      <span className={sizeClass}>{score}%</span>
      {showLabel && <span className="text-xs uppercase tracking-wide">{tone.label} Match</span>}
    </div>
  );
}
