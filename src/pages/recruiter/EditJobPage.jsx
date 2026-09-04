import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import JobForm from '../../components/recruiter/JobForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useToast } from '../../context/ToastContext';
import { jobService } from '../../services/jobService';

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobService.getJobById(id);
        if (res.success && res.job) {
          setJob(res.job);
        }
      } catch (err) {
        console.error('Failed to load job for editing:', err);
        showToast('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleSubmit = async (updatedData) => {
    setSubmitting(true);
    try {
      const res = await jobService.updateJob(id, updatedData);
      if (res.success) {
        showToast('Job posting updated successfully');
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSkeleton className="h-8 w-1/4 mb-6" />
        <LoadingSkeleton className="h-64 w-full" />
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className="p-6 text-center">
        <p className="text-slate-500">Job posting not found.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Job Posting</h1>
        <p className="text-sm text-slate-500">
          Update role requirements, skills, location, or change the status.
        </p>
      </div>

      <JobForm defaultValue={job} onSubmit={handleSubmit} isSubmitting={submitting} />
    </Card>
  );
}
