import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { jobService } from '../../services/jobService';

const blankFilters = {
  search: '',
  skill: '',
  location: '',
  jobType: '',
  workMode: '',
  experience: '',
  salary: '',
};

export default function JobsPage({ seeker = false }) {
  const [filters, setFilters] = useState(blankFilters);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  const basePath = seeker ? '/seeker/jobs' : '/jobs';

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = {
          ...filters,
          sort,
          page,
          limit: 10,
        };
        // Clean empty keys
        Object.keys(params).forEach((key) => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const res = await jobService.getJobs(params);
        if (res.success) {
          setJobs(res.jobs || []);
          setTotalPages(res.totalPages || 1);
          setTotalJobs(res.total || 0);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, sort, page]);

  return (
    <div className={seeker ? 'space-y-6' : 'mx-auto max-w-7xl px-4 py-10'}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{seeker ? 'Explore Jobs' : 'Job Search'}</h1>
        <p className="text-slate-500">
          Discover active engineering, product, and design roles with smart match scoring.
        </p>
      </div>

      <JobFilters
        filters={filters}
        setFilters={(updater) => {
          setPage(1);
          setFilters(updater);
        }}
        sort={sort}
        setSort={(newSort) => {
          setPage(1);
          setSort(newSort);
        }}
      />

      {loading ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <LoadingSkeleton key={n} className="h-56 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Showing {jobs.length} of {totalJobs} job postings</span>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} basePath={basePath} />
            ))}
          </div>

          {!jobs.length && (
            <EmptyState
              title="No Jobs Found"
              message="Try adjusting your keywords, locations, or filters to discover more open positions."
              action="Reset All Filters"
              onAction={() => {
                setFilters(blankFilters);
                setPage(1);
              }}
            />
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
