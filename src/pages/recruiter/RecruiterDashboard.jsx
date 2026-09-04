import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, UserCheck, CalendarCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          jobService.getMyJobs().catch(() => ({ jobs: [] })),
          applicationService.getAllApplicants().catch(() => ({ applicants: [] })),
        ]);
        setJobs(jobsRes.jobs || []);
        setApplicants(appsRes.applicants || []);
      } catch (err) {
        console.error('Failed to load recruiter dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalJobs = jobs.length;
  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter((a) =>
    ['Shortlisted', 'SHORTLISTED'].includes(a.status)
  ).length;
  const interviews = applicants.filter((a) =>
    ['Interview', 'INTERVIEW'].includes(a.status)
  ).length;

  const stats = [
    { label: 'Jobs Posted', value: totalJobs, icon: Briefcase, color: 'text-primary-600' },
    { label: 'Total Applicants', value: totalApplicants, icon: Users, color: 'text-cyan-600' },
    { label: 'Shortlisted Candidates', value: shortlisted, icon: UserCheck, color: 'text-emerald-600' },
    { label: 'Interviews Scheduled', value: interviews, icon: CalendarCheck, color: 'text-violet-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-12 w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <p className="text-slate-500">
            Live overview of active postings, candidate match rankings, and hiring pipelines.
          </p>
        </div>
        <Link
          to="/recruiter/jobs/create"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition"
        >
          + Post New Job
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5 flex items-center justify-between">
            <div>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase">{label}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-x-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Top Ranked Applicants</h2>
            <p className="text-xs text-slate-500">Candidates sorted by smart matching algorithm.</p>
          </div>
          <Link to="/recruiter/applicants" className="text-sm font-semibold text-primary-600 hover:underline">
            View All Applicants →
          </Link>
        </div>

        {applicants.length > 0 ? (
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
              <tr>
                <th className="py-2">Candidate</th>
                <th>Applied Position</th>
                <th>Match Score</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.slice(0, 6).map((candidate) => (
                <tr key={candidate.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {candidate.name}
                    <span className="block text-xs font-normal text-slate-400">{candidate.email}</span>
                  </td>
                  <td>{candidate.job}</td>
                  <td>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      {candidate.match}%
                    </span>
                  </td>
                  <td>{candidate.experience} yrs</td>
                  <td>
                    <StatusBadge status={candidate.status} />
                  </td>
                  <td>
                    <Link
                      to={`/recruiter/applicants/${candidate.id}`}
                      className="font-semibold text-primary-600 hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-500 py-6 text-center">No applications received yet.</p>
        )}
      </Card>
    </div>
  );
}
