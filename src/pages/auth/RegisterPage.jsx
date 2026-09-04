import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Input, Select } from '../../components/common/FormControls';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AuthShell } from './LoginPage';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER',
    company: '',
    location: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await register(form);
      showToast('Account created successfully');
      navigate(user.role === 'RECRUITER' ? '/recruiter/dashboard' : '/seeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Join HireMatch to match with the best opportunities.">
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">{error}</p>}
        <Input
          label="Full Name"
          required
          placeholder="e.g. Aarav Mehta"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email Address"
          required
          type="email"
          placeholder="e.g. candidate@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          required
          type="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Select
          label="Account Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="JOB_SEEKER">Job Seeker (Candidate)</option>
          <option value="RECRUITER">Recruiter (Hiring Manager)</option>
        </Select>

        {form.role === 'RECRUITER' && (
          <Input
            label="Company Name"
            required
            placeholder="e.g. NovaTech Labs"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        )}

        <Input
          label="Location (City)"
          placeholder="e.g. Bangalore"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account? <Link className="text-primary-600 font-semibold hover:underline" to="/login">Login</Link>
      </p>
    </AuthShell>
  );
}
