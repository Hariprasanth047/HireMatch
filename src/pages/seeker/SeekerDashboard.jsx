import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import JobCard from '../../components/jobs/JobCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { recommendationService } from '../../services/recommendationService';

export default function SeekerDashboard() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appsRes, recsRes] = await Promise.all([
          applicationService.getMyApplications().catch(() => ({ applications: [] })),
          recommendationService.getRecommendations({ limit: 3 }).catch(() => ({ recommendations: [] })),
        ]);
        setApplications(appsRes.applications || []);
        setRecommendations(recsRes.recommendations || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalApps = applications.length;
  const shortlisted = applications.filter((a) => ['Shortlisted', 'SHORTLISTED'].includes(a.status)).length;
  const interviews = applications.filter((a) => ['Interview', 'INTERVIEW'].includes(a.status)).length;
  const reviewing = applications.filter((a) => ['Reviewing', 'REVIEWING'].includes(a.status)).length;

  const stats = [
    ['Total Applications', totalApps],
    ['Under Review', reviewing],
    ['Shortlisted', shortlisted],
    ['Interviews Scheduled', interviews],
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-20 w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <LoadingSkeleton key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {currentUser?.name || 'Candidate'}</h1>
        <p className="text-slate-500">Track your real-time job applications and smart match recommendations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-3xl font-bold text-primary-600">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Smart Match Recommendations</h2>
        </div>
        {recommendations.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {recommendations.map((job) => (
              <JobCard key={job.id} job={job} basePath="/seeker/jobs" />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-slate-500">
            No recommendations available yet. Update your skills in profile to see personalized matches.
          </Card>
        )}
      </section>

      <Card className="overflow-x-auto p-5">
        <h2 className="mb-4 text-xl font-semibold">Recent Applications</h2>
        {applications.length > 0 ? (
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
              <tr>
                <th className="py-2">Company</th>
                <th>Position</th>
                <th>Match Score</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="py-3 font-medium">{app.company}</td>
                  <td>{app.job}</td>
                  <td>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {app.match}%
                    </span>
                  </td>
                  <td>{app.appliedDate}</td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500 py-4">You haven&apos;t applied to any jobs yet.</p>
        )}
      </Card>
    </div>
  );
}
