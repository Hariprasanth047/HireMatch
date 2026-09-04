import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ResumeAnalysis from '../../components/resume/ResumeAnalysis';
import ResumeUploader from '../../components/resume/ResumeUploader';
import { useToast } from '../../context/ToastContext';
import { resumeService } from '../../services/resumeService';

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await resumeService.getMyResume();
        if (res.success && res.resume) {
          setResume(res.resume);
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-10 w-1/4" />
        <LoadingSkeleton className="h-44 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Resume Management & Parser</h1>
        <p className="text-slate-500">
          Upload your resume in PDF or DOCX format for instant text extraction and smart skill matching.
        </p>
      </div>

      <ResumeUploader
        resume={resume}
        setResume={setResume}
        onUploaded={(msg) => showToast(msg || 'Resume updated')}
      />

      {resume ? (
        <ResumeAnalysis resume={resume} />
      ) : (
        <EmptyState
          title="No Resume Uploaded Yet"
          message="Upload a PDF or DOCX resume above to extract skills and view real-time smart matching scores across jobs."
        />
      )}
    </div>
  );
}
