import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { applicationService } from '../../services/applicationService';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationService.getMyApplications();
        if (res.success) {
          setApplications(res.applications || []);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <Card className="p-5">
        <LoadingSkeleton className="h-8 w-1/4 mb-4" />
        <LoadingSkeleton className="h-48 w-full" />
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">My Job Applications</h1>
          <p className="text-sm text-slate-500">Track and monitor your application stages in real-time.</p>
        </div>
        <Link to="/seeker/jobs">
          <span className="text-sm font-semibold text-primary-600 hover:underline">
            Explore More Jobs →
          </span>
        </Link>
      </div>

      {applications.length > 0 ? (
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2">Job Position</th>
              <th>Company</th>
              <th>Location</th>
              <th>Match Score</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3 font-semibold text-slate-900 dark:text-white">{app.job}</td>
                <td>{app.company}</td>
                <td>{app.location || 'Remote'}</td>
                <td>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {app.match}% ({app.compatibilityLevel || 'Good'})
                  </span>
                </td>
                <td>{app.appliedDate}</td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td>
                  <Link
                    className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    to={`/seeker/applications/${app.id}`}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState
          title="No Applications Yet"
          message="You have not submitted any job applications yet. Browse active jobs and apply!"
        />
      )}
    </Card>
  );
}
