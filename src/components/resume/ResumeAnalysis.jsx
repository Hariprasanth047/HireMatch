import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import SkillChip from '../common/SkillChip';

export default function ResumeAnalysis({ resume }) {
  const score = resume?.analysisScore || 85;
  const detectedSkills = resume?.detectedSkills || ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'HTML', 'CSS', 'Git'];
  const detectedKeywords = resume?.detectedKeywords || ['REST API', 'Responsive Design', 'Git', 'Agile'];
  const experience = resume?.detectedExperience || ['2+ years'];
  const education = resume?.detectedEducation || ['B.Tech Information Technology'];
  const strengths = resume?.strengths || ['Strong frontend development capabilities', 'Good JavaScript fundamentals', 'MERN stack experience'];
  const missingSkills = resume?.missingSkills || ['Docker', 'AWS', 'CI/CD'];
  const suggestedSkills = resume?.suggestedSkills || ['TypeScript', 'Testing', 'Cloud Deployment'];

  return (
    <Card className="p-5">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Smart Resume Analysis</h2>
          <p className="text-sm text-slate-500">Intelligent document parsing and technical capability extraction.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary-600">{score}/100</p>
          <p className="text-xs font-semibold uppercase text-slate-500">Resume Strength Score</p>
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar label="Resume Optimization & Completeness" value={score} />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Info title="Detected Technical Skills" items={detectedSkills} chips />
        <Info title="Extracted Keywords" items={detectedKeywords} chips />
        <Info title="Extracted Experience" items={experience} />
        <Info title="Extracted Education" items={education} />
        <Info title="Key Strengths" items={strengths} />
        <Info title="High-Demand Missing Skills" items={missingSkills} chips tone="rose" />
        <Info title="Recommended Upskilling" items={suggestedSkills} chips tone="green" />
      </div>
    </Card>
  );
}

function Info({ title, items = [], chips, tone = 'blue' }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) =>
          chips ? (
            <SkillChip key={item} tone={tone}>
              {item}
            </SkillChip>
          ) : (
            <p key={item} className="text-sm text-slate-600 dark:text-slate-300">
              • {item}
            </p>
          )
        )}
      </div>
    </div>
  );
}
