import ProgressBar from '../common/ProgressBar';
import SkillChip from '../common/SkillChip';
import MatchScore from './MatchScore';

export default function MatchAnalysis({ analysis, title = 'Demo Smart Match Analysis' }) {
  if (!analysis) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-500">Frontend-only demo scoring: Skill 60%, Experience 25%, Location 15%.</p>
        </div>
        <MatchScore score={analysis.overallScore} size="lg" />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <ProgressBar label="Skill Match" value={analysis.skillScore} />
        <ProgressBar label="Experience Match" value={analysis.experienceScore} />
        <ProgressBar label="Location Match" value={analysis.locationScore} />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Matched Skills</h3>
          <div className="flex flex-wrap gap-2">{analysis.matchedSkills.map((skill) => <SkillChip key={skill} tone="green">{skill}</SkillChip>)}</div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">{analysis.missingSkills.map((skill) => <SkillChip key={skill} tone="rose">{skill}</SkillChip>)}</div>
        </div>
      </div>
    </section>
  );
}
