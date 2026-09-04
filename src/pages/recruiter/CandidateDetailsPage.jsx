import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, Mail, Phone, MapPin, Briefcase, GraduationCap, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SkillChip from '../../components/common/SkillChip';
import StatusBadge from '../../components/common/StatusBadge';
import MatchAnalysis from '../../components/matching/MatchAnalysis';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useToast } from '../../context/ToastContext';
import { applicationService } from '../../services/applicationService';

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCandidateApp = async () => {
      setLoading(true);
      try {
        const res = await applicationService.getApplicationById(id);
        if (res.success && res.application) {
          setApplication(res.application);
        }
      } catch (err) {
        console.error('Failed to load candidate application:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidateApp();
    }
  }, [id]);

  const changeStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await applicationService.updateStatus(id, status);
      if (res.success) {
        setApplication((prev) => ({ ...prev, status }));
        showToast(`Candidate marked as "${status}"`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-44 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!application) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-bold">Candidate Application Not Found</h2>
        <Link to="/recruiter/applicants" className="mt-4 inline-block">
          <Button variant="secondary">Back to Applicants</Button>
        </Link>
      </Card>
    );
  }

  const applicant = application.applicant || {};
  const job = application.job || {};

  const analysis = {
    overallScore: application.matchScore || 75,
    skillScore: application.skillScore || 80,
    experienceScore: application.experienceScore || 70,
    locationScore: application.locationScore || 85,
    matchedSkills: application.matchedSkills || applicant.skills || [],
    missingSkills: application.missingSkills || [],
    compatibilityLevel: application.compatibilityLevel || 'Good',
  };

  return (
    <div className="space-y-5">
      <Link
        to={application.jobId ? `/recruiter/jobs/${application.jobId}/applicants` : '/recruiter/applicants'}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-600 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Applicants List
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{applicant.name || 'Candidate'}</h1>
              <StatusBadge status={application.status} />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Applied for <strong>{application.job || job.title}</strong> on {application.appliedDate}
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
              {applicant.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-slate-400" /> {applicant.email}
                </span>
              )}
              {applicant.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-slate-400" /> {applicant.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" /> {applicant.location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-slate-400" /> {applicant.experience || 0} years experience
              </span>
              {applicant.education && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-slate-400" /> {applicant.education}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={updating || application.status === 'Reviewing'}
              onClick={() => changeStatus('Reviewing')}
            >
              Reviewing
            </Button>
            <Button
              disabled={updating || application.status === 'Shortlisted'}
              onClick={() => changeStatus('Shortlisted')}
            >
              Shortlist
            </Button>
            <Button
              variant="secondary"
              disabled={updating || application.status === 'Interview'}
              onClick={() => changeStatus('Interview')}
            >
              Schedule Interview
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={updating || application.status === 'Hired'}
              onClick={() => changeStatus('Hired')}
            >
              Hire Candidate
            </Button>
            <Button
              variant="danger"
              disabled={updating || application.status === 'Rejected'}
              onClick={() => changeStatus('Rejected')}
            >
              Reject
            </Button>
          </div>
        </div>

        {applicant.bio && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs uppercase font-semibold text-slate-400">Professional Summary</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{applicant.bio}</p>
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs uppercase font-semibold text-slate-400">Candidate Skills</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(applicant.skills || []).map((skill) => (
              <SkillChip key={skill} tone="blue">
                {skill}
              </SkillChip>
            ))}
          </div>
        </div>
      </Card>

      {/* Match Breakdown */}
      <MatchAnalysis analysis={analysis} title="Candidate Smart Match Analysis" />

      {/* Application Cover Letter & Resume File */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Application Material</h2>
        {application.coverLetter && (
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400">Cover Letter</p>
            <p className="mt-1 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {application.coverLetter}
            </p>
          </div>
        )}

        {application.resume ? (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <div>
              <p className="font-semibold text-sm">
                📄 {application.resume.originalFileName || 'Candidate_Resume.pdf'}
              </p>
              <p className="text-xs text-slate-500">
                {application.resume.fileSize || 'PDF Document'} • Uploaded {application.appliedDate}
              </p>
            </div>
            {application.resume._id && (
              <a
                href={`http://localhost:5000/api/resumes/download/${application.resume._id}`}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4 inline" /> Download Resume
                </Button>
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No resume file attached to this application.</p>
        )}
      </Card>
    </div>
  );
}
