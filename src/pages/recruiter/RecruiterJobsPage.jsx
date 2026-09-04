import { Edit, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Input, Select } from '../../components/common/FormControls';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { jobService } from '../../services/jobService';

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [remove, setRemove] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getMyJobs();
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const visible = jobs.filter((job) => {
    const matchesSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || job.status.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const confirmDelete = async () => {
    if (!remove) return;
    setDeleting(true);
    try {
      const res = await jobService.deleteJob(remove.id || remove._id);
      if (res.success) {
        setJobs(jobs.filter((j) => (j.id || j._id) !== (remove.id || remove._id)));
        showToast('Job posting deleted successfully');
        setRemove(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-10 w-1/4" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <p className="text-slate-500">
            Create, update, monitor applicants, and manage your company&apos;s job listings.
          </p>
        </div>
        <Link to="/recruiter/jobs/create">
          <Button>
            <Plus className="h-4 w-4" /> Create Job
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search posted jobs by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Closed">Closed</option>
        </Select>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-4">
          {visible.map((job) => (
            <Card key={job.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{job.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {job.location} ({job.workMode}) • {job.salary} • {job.applications} applicants • Posted {job.createdDate}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(job.skills || []).slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                  <Button variant="secondary" size="sm">
                    <Users className="h-4 w-4 mr-1" /> View Applicants ({job.applications})
                  </Button>
                </Link>
                <Link to={`/recruiter/jobs/${job.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Edit Posting
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => setRemove(job)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Jobs Found"
          message={jobs.length ? "No jobs match your current search criteria." : "You haven't posted any jobs yet. Create your first listing!"}
          action={!jobs.length ? "Create Job" : undefined}
          onAction={!jobs.length ? () => window.location.href = '/recruiter/jobs/create' : undefined}
        />
      )}

      <Modal
        open={Boolean(remove)}
        title="Delete Job Posting?"
        danger
        confirmLabel={deleting ? 'Deleting...' : 'Delete Job'}
        onClose={() => setRemove(null)}
        onConfirm={confirmDelete}
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete <strong>{remove?.title}</strong>? This action cannot be undone and will permanently remove all associated applications.
        </p>
      </Modal>
    </div>
  );
}
