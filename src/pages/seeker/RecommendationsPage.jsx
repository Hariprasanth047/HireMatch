import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Select } from '../../components/common/FormControls';
import SkillChip from '../../components/common/SkillChip';
import MatchScore from '../../components/matching/MatchScore';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { Textarea } from '../../components/common/FormControls';
import { useToast } from '../../context/ToastContext';
import { recommendationService } from '../../services/recommendationService';
import { applicationService } from '../../services/applicationService';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('Best Match');
  const [applyingJob, setApplyingJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const res = await recommendationService.getRecommendations({ limit: 12 });
      if (res.success) {
        setRecommendations(res.recommendations || []);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const sortedJobs = useMemo(() => {
    return [...recommendations].sort((a, b) => {
      if (sort === 'Best Match') return (b.match || 0) - (a.match || 0);
      if (sort === 'Recently Posted') return new Date(b.postedDate) - new Date(a.postedDate);
      if (sort === 'Highest Salary') return parseInt(b.salary || '0', 10) - parseInt(a.salary || '0', 10);
      return 0;
    });
  }, [recommendations, sort]);

  const handleApply = async () => {
    if (!applyingJob) return;
    setSubmitting(true);
    try {
      const res = await applicationService.applyForJob({
        jobId: applyingJob.id || applyingJob._id,
        coverLetter,
      });
      if (res.success) {
        showToast('Application submitted successfully!');
        setApplyingJob(null);
        setCoverLetter('');
        // Refresh recommendations to update application status
        fetchRecs();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-10 w-1/3" />
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Smart Recommendations</h1>
          <p className="text-slate-500">
            Personalized job recommendations ranked by our 3-pillar algorithm (60% Skills, 25% Experience, 15% Location).
          </p>
        </div>
        <Select
          aria-label="Sort recommendations"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option>Best Match</option>
          <option>Recently Posted</option>
          <option>Highest Salary</option>
        </Select>
      </div>

      {sortedJobs.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {sortedJobs.map((job) => (
            <Card key={job.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <p className="text-sm text-slate-500">{job.company} • {job.location} ({job.workMode})</p>
                    <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {job.salary} • {job.experience}+ yrs experience • {job.jobType}
                    </p>
                  </div>
                  <MatchScore score={job.match} size="md" />
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Match Breakdown</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(job.matchedSkills || []).slice(0, 4).map((skill) => (
                      <SkillChip key={skill} tone="green">
                        ✓ {skill}
                      </SkillChip>
                    ))}
                    {(job.missingSkills || []).slice(0, 2).map((skill) => (
                      <SkillChip key={skill} tone="rose">
                        × {skill}
                      </SkillChip>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link to={`/seeker/jobs/${job.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Job
                  </Button>
                </Link>
                {job.isApplied ? (
                  <Button variant="secondary" disabled className="flex-1 text-emerald-600 dark:text-emerald-400">
                    Applied
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={() => setApplyingJob(job)}>
                    Apply Now
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Recommendations Yet"
          message="Complete your skills and profile experience to get personalized job suggestions."
        />
      )}

      {/* Apply Modal */}
      <Modal
        open={Boolean(applyingJob)}
        title={`Apply for ${applyingJob?.title}`}
        confirmLabel={submitting ? 'Submitting...' : 'Submit Application'}
        onClose={() => setApplyingJob(null)}
        onConfirm={handleApply}
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are applying for <strong>{applyingJob?.title}</strong> at <strong>{applyingJob?.company}</strong>.
          </p>
          <Textarea
            label="Cover Letter / Note (Optional)"
            placeholder="Write a brief note to the recruiter..."
            value={coverLetter}
            rows={3}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
