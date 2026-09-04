import { Link } from 'react-router-dom';
import Brand from './Brand';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-2">
        <Brand />
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 md:justify-end">
          <Link to="/about">About</Link><Link to="/jobs">Jobs</Link><Link to="/companies">Companies</Link><a href="mailto:contact@hirematch.demo">Contact</a><a href="#">Privacy</a><a href="#">Terms</a><a href="#">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
