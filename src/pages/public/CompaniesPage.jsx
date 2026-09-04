import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import Card from '../../components/common/Card';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { jobService } from '../../services/jobService';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await jobService.getJobs({ limit: 50 });
        if (res.success && res.jobs) {
          // Group jobs by company
          const companyMap = new Map();
          res.jobs.forEach((job) => {
            const companyName = job.company || 'NovaTech Labs';
            if (!companyMap.has(companyName)) {
              companyMap.set(companyName, {
                name: companyName,
                location: job.location || 'Bangalore',
                description: job.companyDescription || `${companyName} is hiring top talent for engineering and product teams.`,
                openPositions: 1,
                roles: [job.title],
              });
            } else {
              const existing = companyMap.get(companyName);
              existing.openPositions += 1;
              if (!existing.roles.includes(job.title)) {
                existing.roles.push(job.title);
              }
            }
          });

          setCompanies(Array.from(companyMap.values()));
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
        <LoadingSkeleton className="h-10 w-1/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSkeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Featured Companies</h1>
        <p className="mt-1 text-slate-500">
          Explore actively hiring organizations and discover open engineering opportunities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.name} className="p-6 flex flex-col justify-between hover:border-primary-300 transition">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 text-lg font-bold text-white shadow-sm">
                  {company.name[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{company.name}</h2>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" /> {company.location}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {company.description}
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
                <Briefcase className="h-3.5 w-3.5" /> {company.openPositions} open {company.openPositions === 1 ? 'position' : 'positions'}
              </span>
              <Link
                to={`/jobs?search=${encodeURIComponent(company.name)}`}
                className="text-xs font-bold text-slate-600 hover:text-primary-600 transition dark:text-slate-300"
              >
                View Jobs →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
