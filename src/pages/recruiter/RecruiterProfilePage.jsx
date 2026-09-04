import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Input, Textarea } from '../../components/common/FormControls';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';

export default function RecruiterProfilePage() {
  const { currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(currentUser || {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res.success && res.user) {
          setProfile(res.user);
        }
      } catch (err) {
        console.error('Failed to load recruiter profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const update = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile({
        name: profile.name,
        company: profile.company,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
      });

      if (res.success && res.user) {
        setProfile(res.user);
        refreshUser(res.user);
        showToast('Company profile updated successfully!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSkeleton className="h-8 w-1/4 mb-6" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Company & Recruiter Profile</h1>
        <p className="text-sm text-slate-500">
          Manage your organization details and primary contact information shown to applicants.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Recruiter Name"
          value={profile.name || ''}
          placeholder="e.g. Priya Nair"
          onChange={(e) => update('name', e.target.value)}
        />
        <Input
          label="Company Name"
          value={profile.company || ''}
          placeholder="e.g. NovaTech Labs"
          onChange={(e) => update('company', e.target.value)}
        />
        <Input
          label="Work Email (Read-only)"
          disabled
          value={profile.email || ''}
        />
        <Input
          label="Phone Number"
          value={profile.phone || ''}
          placeholder="+91 98765 99999"
          onChange={(e) => update('phone', e.target.value)}
        />
        <Input
          className="md:col-span-2"
          label="Location (Headquarters / Office)"
          value={profile.location || ''}
          placeholder="e.g. Bangalore, India"
          onChange={(e) => update('location', e.target.value)}
        />
        <Textarea
          className="md:col-span-2"
          label="Company Description / Mission"
          rows={4}
          value={profile.bio || ''}
          placeholder="Brief description of your company, culture, and products..."
          onChange={(e) => update('bio', e.target.value)}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setProfile(currentUser || {})}
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}
