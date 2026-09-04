import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import { Select } from '../../components/common/FormControls';
import SkillChip from '../../components/common/SkillChip';
import StatusBadge from '../../components/common/StatusBadge';
import MatchScore from '../../components/matching/MatchScore';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { applicationService } from '../../services/applicationService';

export default function ApplicantsPage({ all = false }) {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [sort, setSort] = useState('Match Score');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        let res;
        if (all || !id) {
          res = await applicationService.getAllApplicants({ sort });
          if (res.success) {
            setApplicants(res.applicants || []);
          }
        } else {
          res = await applicationService.getJobApplicants(id, { sort });
          if (res.success) {
            setApplicants(res.applicants || []);
            setJobInfo(res.job || null);
          }
        }
      } catch (err) {
        console.error('Failed to load applicants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [all, id, sort]);

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-12 w-1/3" />
        <Card className="p-5">
          <LoadingSkeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">
            {all || !jobInfo ? 'All Job Applicants' : `${jobInfo.title} Applicants`}
          </h1>
          <p className="text-slate-500">
            Candidate ranking sorted dynamically by match score and qualifications.
          </p>
        </div>
        <Select
          aria-label="Sort applicants"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option>Match Score</option>
          <option>Experience</option>
          <option>Application Date</option>
        </Select>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Candidate Ranking List</h2>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            {applicants.length} Total Applicants
          </span>
        </div>

        {applicants.length > 0 ? (
          <div className="space-y-3">
            {applicants.map((candidate, index) => (
              <Link
                key={candidate.id}
                to={`/recruiter/applicants/${candidate.id}`}
                className="block rounded-lg border border-slate-200 p-4 transition hover:border-primary-300 hover:bg-slate-50/80 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {index + 1}. {candidate.name}
                      </p>
                      {index === 0 && candidate.match >= 85 && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ⭐ Top Match
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      <strong>{candidate.job}</strong> • {candidate.experience} yrs exp • {candidate.location} • Applied {candidate.appliedDate}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {(candidate.skills || []).slice(0, 5).map((skill) => (
                        <SkillChip key={skill} tone="blue">
                          {skill}
                        </SkillChip>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <MatchScore score={candidate.match} size="sm" />
                    <StatusBadge status={candidate.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Applicants Yet"
            message="There are currently no candidates who have applied for this position."
          />
        )}
      </Card>
    </div>
  );
}
