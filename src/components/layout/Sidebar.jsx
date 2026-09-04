import { Briefcase, FileText, Home, LogOut, Settings, User, Users, X, Star, PlusCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Brand from './Brand';
import Button from '../common/Button';

const seeker = [
  ['Dashboard', '/seeker/dashboard', Home],
  ['Find Jobs', '/seeker/jobs', Briefcase],
  ['Recommendations', '/seeker/recommendations', Star],
  ['Applications', '/seeker/applications', FileText],
  ['Resume', '/seeker/resume', FileText],
  ['Profile', '/seeker/profile', User],
  ['Settings', '/seeker/settings', Settings],
];

const recruiter = [
  ['Dashboard', '/recruiter/dashboard', Home],
  ['Jobs', '/recruiter/jobs', Briefcase],
  ['Applicants', '/recruiter/applicants', Users],
  ['Post Job', '/recruiter/jobs/create', PlusCircle],
  ['Profile', '/recruiter/profile', User],
  ['Settings', '/recruiter/settings', Settings],
];

export default function Sidebar({ open, onClose }) {
  const { userRole, logout } = useAuth();
  const items = userRole === 'RECRUITER' ? recruiter : seeker;
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/70 bg-white/88 p-4 shadow-soft backdrop-blur-xl transition dark:border-slate-800/80 dark:bg-slate-950/88 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between"><Brand /><button className="lg:hidden" aria-label="Close navigation" onClick={onClose}><X /></button></div>
        <nav className="mt-8 flex-1 space-y-1">
          {items.map(([label, to, Icon]) => (
            <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold ${isActive ? 'bg-gradient-to-r from-primary-50 to-indigo-50 text-primary-700 shadow-sm dark:from-primary-950 dark:to-indigo-950 dark:text-cyan-100' : 'text-slate-600 hover:bg-cyan-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-900'}`}>
              <Icon className="h-4 w-4" />{label}
            </NavLink>
          ))}
        </nav>
        <Button variant="secondary" onClick={logout}><LogOut className="h-4 w-4" />Logout</Button>
      </aside>
    </>
  );
}
