import { Bookmark, Send, CheckCircle2, Building, MapPin, Briefcase, IndianRupee, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import SkillChip from '../../components/common/SkillChip';
import MatchAnalysis from '../../components/matching/MatchAnalysis';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Textarea } from '../../components/common/FormControls';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

export default function JobDetailsPage({ seeker = false }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { currentUser, isAuthenticated, userRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobService.getJobById(id);
        if (res.success && res.job) {
          setJob(res.job);
          setMatchAnalysis(res.matchAnalysis || res.job.matchAnalysis || null);
          setHasApplied(Boolean(res.hasApplied));
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, currentUser]);

  const confirmApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (userRole === 'RECRUITER') {
      showToast('Recruiter accounts cannot apply for job postings');
      setApplyOpen(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await applicationService.applyForJob({
        jobId: job.id || job._id,
        coverLetter,
      });

      if (res.success) {
        setHasApplied(true);
        showToast('Application submitted successfully!');
        setApplyOpen(false);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={seeker ? 'space-y-6' : 'mx-auto max-w-5xl space-y-6 px-4 py-10'}>
        <LoadingSkeleton className="h-44 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <p className="mt-2 text-slate-500">The job listing you are looking for may have been removed or closed.</p>
        <Link to="/jobs" className="mt-4 inline-block">
          <Button variant="secondary">Browse Available Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={seeker ? 'space-y-6' : 'mx-auto max-w-5xl space-y-6 px-4 py-10'}>
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              <Building className="h-3.5 w-3.5" />
              {job.company}
            </span>
            <h1 className="mt-2 text-3xl font-bold">{job.title}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              {job.location} • <span className="font-medium text-slate-700 dark:text-slate-300">{job.workMode}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => showToast('Job saved to your bookmarks')}>
              <Bookmark className="h-4 w-4" /> Save Job
            </Button>
            {hasApplied ? (
              <Button variant="secondary" disabled className="text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Applied
              </Button>
            ) : (
              <Button onClick={() => setApplyOpen(true)}>
                <Send className="h-4 w-4" /> Apply Now
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={IndianRupee} label="Salary" value={job.salary} />
          <InfoCard icon={Briefcase} label="Experience" value={`${job.experience}+ years`} />
          <InfoCard icon={Building} label="Employment Type" value={job.jobType || job.employmentType} />
          <InfoCard icon={Calendar} label="Posted Date" value={job.postedDate || 'Recent'} />
        </div>
      </Card>

      {/* Dynamic Match Analysis Breakdown for Seekers */}
      {matchAnalysis && (
        <MatchAnalysis
          analysis={matchAnalysis}
          title="Smart Matching Breakdown for You"
        />
      )}

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold">About the Role</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">{job.description}</p>
        </div>

        {job.responsibilities && job.responsibilities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Key Responsibilities</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {job.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Requirements & Qualifications</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {job.requirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold">Required Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {(job.skills || []).map((skill) => (
              <SkillChip key={skill} tone="blue">
                {skill}
              </SkillChip>
            ))}
          </div>
        </div>

        {job.niceToHave && job.niceToHave.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Nice-to-Have Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.niceToHave.map((skill) => (
                <SkillChip key={skill} tone="slate">
                  {skill}
                </SkillChip>
              ))}
            </div>
          </div>
        )}
      </Card>

      {!seeker && (
        <div className="flex justify-between">
          <Link to="/jobs">
            <Button variant="secondary">← Back to All Jobs</Button>
          </Link>
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        open={applyOpen}
        title={`Apply for ${job.title}`}
        confirmLabel={submitting ? 'Submitting...' : 'Submit Application'}
        onClose={() => setApplyOpen(false)}
        onConfirm={confirmApply}
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are applying for <strong>{job.title}</strong> at <strong>{job.company}</strong>. Your profile details and latest uploaded resume will be attached.
          </p>

          <Textarea
            label="Cover Letter / Note to Recruiter (Optional)"
            placeholder="Introduce yourself and explain why you are a great match for this position..."
            value={coverLetter}
            rows={4}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <div className="rounded-md bg-cyan-50 p-3 text-xs text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200">
            💡 Our smart algorithm will compute your match score and rank your profile for the recruiter.
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
      <div className="rounded-md bg-white p-2 text-primary-600 shadow-sm dark:bg-slate-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase font-semibold text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800 dark:text-white">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
