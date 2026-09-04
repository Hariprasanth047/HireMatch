import { Menu, Moon, Sun } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import Brand from './Brand';

export default function Navbar({ onMenu }) {
  const { isAuthenticated, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dashboard = userRole === 'RECRUITER' ? '/recruiter/dashboard' : '/seeker/dashboard';
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/82">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {onMenu && <button className="lg:hidden" aria-label="Open navigation" onClick={onMenu}><Menu /></button>}
          <Brand />
        </div>
        <nav className="hidden items-center gap-5 text-sm font-bold text-slate-600 dark:text-slate-200 md:flex">
          <NavLink to="/jobs">Jobs</NavLink><NavLink to="/companies">Companies</NavLink><NavLink to="/about">About</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" aria-label="Toggle theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
          {isAuthenticated ? <Link to={dashboard}><Button>Dashboard</Button></Link> : <><Link to="/login"><Button variant="secondary">Login</Button></Link><Link to="/register" className="hidden sm:block"><Button>Create Account</Button></Link></>}
        </div>
      </div>
    </header>
  );
}
