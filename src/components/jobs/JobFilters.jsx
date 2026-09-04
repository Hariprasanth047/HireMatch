import { Search } from 'lucide-react';
import { Input, Select } from '../common/FormControls';

export default function JobFilters({ filters, setFilters, sort, setSort }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3 lg:grid-cols-6">
      <div className="relative md:col-span-3 lg:col-span-2">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input aria-label="Search jobs" className="pl-9" placeholder="Search title, company, skill, location" value={filters.search} onChange={(e) => update('search', e.target.value)} />
      </div>
      <Input placeholder="Skill" value={filters.skill} onChange={(e) => update('skill', e.target.value)} />
      <Input placeholder="Location" value={filters.location} onChange={(e) => update('location', e.target.value)} />
      <Select aria-label="Job type" value={filters.jobType} onChange={(e) => update('jobType', e.target.value)}>
        <option value="">All job types</option><option>Full Time</option><option>Part Time</option><option>Internship</option><option>Contract</option>
      </Select>
      <Select aria-label="Work mode" value={filters.workMode} onChange={(e) => update('workMode', e.target.value)}>
        <option value="">All modes</option><option>Remote</option><option>Hybrid</option><option>On-site</option>
      </Select>
      <Select aria-label="Experience" value={filters.experience} onChange={(e) => update('experience', e.target.value)}>
        <option value="">Any experience</option><option value="0">Fresher</option><option value="1">1+ years</option><option value="2">2+ years</option><option value="3">3+ years</option>
      </Select>
      <Input placeholder="Salary range" value={filters.salary} onChange={(e) => update('salary', e.target.value)} />
      <Select aria-label="Sort jobs" value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="recent">Recently Posted</option><option value="match">Best Match</option><option value="salary">Highest Salary</option>
      </Select>
    </div>
  );
}
