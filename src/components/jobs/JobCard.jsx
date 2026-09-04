import { Briefcase, Calendar, IndianRupee, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import SkillChip from '../common/SkillChip';
import MatchScore from '../matching/MatchScore';

export default function JobCard({ job, basePath = '/jobs', onApply }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{job.company}</p>
        </div>
        {job.match && <MatchScore score={job.match} size="sm" />}
      </div>
      <div className="mt-4 grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 sm:grid-cols-2">
        <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{job.location} • {job.workMode}</span>
        <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" />{job.experience}+ yrs • {job.jobType}</span>
        <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4" />{job.salary}</span>
        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />Posted {job.postedDate}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{job.skills.slice(0, 5).map((skill) => <SkillChip key={skill}>{skill}</SkillChip>)}</div>
      <div className="mt-5 flex gap-3">
        <Link className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700" to={`${basePath}/${job.id}`}>View Job</Link>
        {onApply && <Button variant="outline" onClick={() => onApply(job)}>Apply</Button>}
      </div>
    </Card>
  );
}
