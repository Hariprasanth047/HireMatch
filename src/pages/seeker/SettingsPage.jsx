import Card from '../../components/common/Card';
import { Input, Select } from '../../components/common/FormControls';

export default function SettingsPage({ recruiter = false }) {
  return <Card className="p-6"><h1 className="text-2xl font-bold">Settings</h1><div className="mt-6 grid gap-5 md:grid-cols-2"><Input label="Account Email" placeholder={recruiter ? 'recruiter@example.com' : 'candidate@example.com'} /><Select label="Notification Preferences"><option>Application updates</option><option>Weekly summaries</option><option>Important only</option></Select><Select label="Theme"><option>Use navigation toggle</option><option>Light</option><option>Dark</option></Select><Input label="Password" type="password" placeholder="Backend required later" /><Select label="Privacy Settings"><option>Visible to recruiters</option><option>Private profile</option></Select></div><p className="mt-5 text-sm text-slate-500">Password and notification delivery are frontend placeholders for the backend phase.</p></Card>;
}
