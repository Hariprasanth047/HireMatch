import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Building, MapPin, Download, CheckCircle2, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SkillChip from '../../components/common/SkillChip';
import StatusBadge from '../../components/common/StatusBadge';
import MatchAnalysis from '../../components/matching/MatchAnalysis';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { applicationService } from '../../services/applicationService';

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      setLoading(true);
      try {
        const res = await applicationService.getApplicationById(id);
        if (res.success && res.application) {
          setApplication(res.application);
        }
      } catch (err) {
        console.error('Error fetching application details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApp();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-32 w-full" />
        <LoadingSkeleton className="h-44 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <h2 className="text-2xl font-bold">Application Not Found</h2>
        <Link to="/seeker/applications" className="mt-4 inline-block">
          <Button variant="secondary">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Applied', key: 'Applied' },
    { label: 'Reviewing', key: 'Reviewing' },
    { label: 'Shortlisted', key: 'Shortlisted' },
    { label: 'Interview', key: 'Interview' },
    { label: 'Hired', key: 'Hired' },
  ];

  const currentStatusNormalized = application.status?.toUpperCase() || 'APPLIED';
  const getStepIndex = (status) => {
    if (status.includes('HIRED') || status.includes('OFFER')) return 4;
    if (status.includes('INTERVIEW')) return 3;
    if (status.includes('SHORTLIST')) return 2;
    if (status.includes('REVIEW')) return 1;
    return 0;
  };
  const activeStepIdx = getStepIndex(currentStatusNormalized);
  const isRejected = currentStatusNormalized.includes('REJECT');

  const matchAnalysis = {
    overallScore: application.matchScore || 75,
    skillScore: application.skillScore || 80,
    experienceScore: application.experienceScore || 70,
    locationScore: application.locationScore || 85,
    matchedSkills: application.matchedSkills || [],
    missingSkills: application.missingSkills || [],
    compatibilityLevel: application.compatibilityLevel || 'Good',
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              <Building className="h-3.5 w-3.5" />
              {application.company}
            </span>
            <h1 className="mt-2 text-3xl font-bold">{application.job}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Applied on {application.appliedDate} • Application ID: {application.id}
            </p>
          </div>
          <div>
            <StatusBadge status={application.status} />
          </div>
        </div>
      </Card>

      {/* Application Timeline Lifecycle */}
      <Card className="p-6">
        <h2 className="font-semibold text-lg">Application Lifecycle & Timeline</h2>
        {isRejected ? (
          <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            <strong>Application Status: Rejected</strong>
            <p className="mt-1 text-xs">The recruitment team has decided not to proceed with this application at this time.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {steps.map((step, index) => {
              const isPassed = index <= activeStepIdx;
              const isCurrent = index === activeStepIdx;
              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition ${
                    isCurrent
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold dark:bg-primary-950/60 dark:text-primary-300'
                      : isPassed
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-slate-200 text-slate-400 dark:border-slate-800'
                  }`}
                >
                  <div className="mb-1">
                    {isPassed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs">{step.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Smart Match Breakdown */}
      <MatchAnalysis
        analysis={matchAnalysis}
        title="Application Match Breakdown"
      />

      {/* Cover Letter & Resume Details */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg">Application Details</h2>
        {application.coverLetter ? (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Cover Note</h3>
            <p className="mt-1 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {application.coverLetter}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No cover note provided.</p>
        )}

        {application.resume && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Attached Resume</p>
              <p className="text-xs text-slate-500">{application.resume.originalFileName || 'Resume Document'}</p>
            </div>
            {application.resume._id && (
              <a
                href={`http://localhost:5000/api/resumes/download/${application.resume._id}`}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-3.5 w-3.5 inline" /> Download
                </Button>
              </a>
            )}
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Link to="/seeker/applications">
          <Button variant="secondary">← Back to Applications</Button>
        </Link>
        {application.jobId && (
          <Link to={`/seeker/jobs/${application.jobId}`}>
            <Button variant="outline">View Job Details →</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
