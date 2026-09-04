import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import JobForm from '../../components/recruiter/JobForm';
import { useToast } from '../../context/ToastContext';
import { jobService } from '../../services/jobService';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (jobData) => {
    setSubmitting(true);
    try {
      const res = await jobService.createJob(jobData);
      if (res.success) {
        showToast(jobData.status === 'Draft' ? 'Draft job saved successfully' : 'Job published successfully!');
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create job posting');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Job Posting</h1>
        <p className="text-sm text-slate-500">
          Specify required technical skills, experience, and role responsibilities to attract top matches.
        </p>
      </div>

      <JobForm onSubmit={handleSubmit} isSubmitting={submitting} />
    </Card>
  );
}
