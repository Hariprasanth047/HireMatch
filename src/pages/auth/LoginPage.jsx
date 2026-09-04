import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Input } from '../../components/common/FormControls';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'candidate@example.com', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      showToast('Logged in successfully');
      navigate(location.state?.from?.pathname || (user.role === 'RECRUITER' ? '/recruiter/dashboard' : '/seeker/dashboard'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Login to your HireMatch account.">
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">{error}</p>}
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase text-slate-400">Demo Accounts</p>
        <div className="mt-2 grid gap-1.5 text-xs text-slate-500">
          <button
            type="button"
            className="text-left hover:text-primary-600 transition"
            onClick={() => setForm({ email: 'candidate@example.com', password: 'password123' })}
          >
            👤 <strong>Job Seeker:</strong> candidate@example.com / password123
          </button>
          <button
            type="button"
            className="text-left hover:text-primary-600 transition"
            onClick={() => setForm({ email: 'recruiter@example.com', password: 'password123' })}
          >
            🏢 <strong>Recruiter:</strong> recruiter@example.com / password123
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        <Link className="text-primary-600 hover:underline" to="/forgot-password">Forgot password?</Link> • <Link className="text-primary-600 font-semibold hover:underline" to="/register">Create account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md items-center px-4 py-10">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">{subtitle}</p>
        {children}
      </Card>
    </div>
  );
}
