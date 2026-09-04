import Button from '../../components/common/Button';
import { Input } from '../../components/common/FormControls';
import { AuthShell } from './LoginPage';

export default function ForgotPasswordPage() {
  return <AuthShell title="Reset password" subtitle="Backend email delivery will be connected later."><div className="space-y-4"><Input label="Email" type="email" placeholder="you@example.com" /><Button className="w-full">Send Reset Link</Button><p className="text-xs text-slate-500">Demo UI only. No email is sent in this frontend phase.</p></div></AuthShell>;
}
