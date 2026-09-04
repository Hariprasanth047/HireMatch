import { ArrowRight, ClipboardCheck, FileUp, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SkillChip from '../../components/common/SkillChip';
import MatchScore from '../../components/matching/MatchScore';

export default function LandingPage() {
  const features = ['Smart Resume Matching', 'Personalized Job Recommendations', 'Advanced Job Search', 'Application Tracking', 'Recruiter Candidate Ranking', 'Real-time Application Status'];
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-orange-50 dark:from-slate-950 dark:via-cyan-950 dark:to-indigo-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="self-center">
            <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-sm font-extrabold text-primary-700 shadow-sm ring-1 ring-cyan-100 dark:bg-slate-900/80 dark:text-cyan-100 dark:ring-cyan-900">
              HireMatch • Smart Job Portal & Resume Matching
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink-950 dark:text-white md:text-6xl">
              Find the Right Job. Match Your Skills.
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-300">
              Upload a resume, discover demo smart matches, and track applications in a polished frontend ready for a future backend.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/jobs"><Button>Find Jobs <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/seeker/resume"><Button variant="secondary">Upload Resume</Button></Link>
            </div>
          </div>
          <Card className="border-cyan-100 p-6 dark:border-cyan-900/60">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight">Demo Smart Match</h2>
              <MatchScore score={92} />
            </div>
            <div className="mt-6 grid gap-4">
              <div>
                <p className="mb-2 text-sm font-bold">Matched Skills</p>
                <div className="flex flex-wrap gap-2">{['React', 'Node.js', 'MongoDB', 'JavaScript'].map((skill) => <SkillChip key={skill} tone="green">{skill}</SkillChip>)}</div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">Missing Skills</p>
                <SkillChip tone="rose">Docker</SkillChip>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <Metric value="95%" label="Skills" />
                <Metric value="100%" label="Experience" />
                <Metric value="100%" label="Location" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Section title="How It Works" items={[['Create Profile', Users], ['Upload Resume', FileUp], ['Get Smart Matches', Sparkles], ['Apply & Track', ClipboardCheck]]} />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Features</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature} className="p-5">
              <Sparkles className="h-6 w-6 text-accent-500" />
              <h3 className="mt-3 font-bold">{feature}</h3>
              <p className="mt-2 text-sm text-slate-500">Built with realistic mock data and reusable frontend components.</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-cyan-100 via-white to-orange-100 py-12 dark:from-slate-900 dark:via-cyan-950 dark:to-indigo-950">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {['10K+ Jobs', '5K+ Candidates', '1K+ Companies', '85% Average Match Accuracy'].map((stat) => (
            <Card key={stat} className="p-5 text-center">
              <p className="text-2xl font-extrabold text-primary-700 dark:text-cyan-200">{stat.split(' ')[0]}</p>
              <p className="text-sm text-slate-500">{stat.replace(stat.split(' ')[0], '').trim()} • demo UI value</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight">Ready to find your next opportunity?</h2>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register"><Button>Create Account</Button></Link>
          <Link to="/jobs"><Button variant="secondary">Explore Jobs</Button></Link>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div className="rounded-md bg-gradient-to-br from-cyan-50 to-orange-50 p-3 dark:from-slate-800 dark:to-slate-900">
      <b className="text-primary-700 dark:text-cyan-200">{value}</b>
      <span className="block text-slate-500">{label}</span>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, Icon], index) => (
          <Card key={label} className="p-5">
            <Icon className="h-7 w-7 text-primary-600" />
            <p className="mt-4 text-sm font-bold text-accent-600">Step {index + 1}</p>
            <h3 className="text-lg font-bold">{label}</h3>
          </Card>
        ))}
      </div>
    </section>
  );
}
