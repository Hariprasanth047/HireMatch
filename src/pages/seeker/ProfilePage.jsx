import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Input, Textarea } from '../../components/common/FormControls';
import SkillChip from '../../components/common/SkillChip';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';

export default function ProfilePage() {
  const { currentUser, refreshUser } = useAuth();
  const [profile, setProfile] = useState(currentUser || {});
  const [skill, setSkill] = useState('');
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
        console.error('Failed to fetch profile from backend:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        experience: Number(profile.experience) || 0,
        currentRole: profile.currentRole,
        education: profile.education,
        skills: profile.skills || [],
        links: profile.links || {},
      });

      if (res.success && res.user) {
        setProfile(res.user);
        refreshUser(res.user);
        showToast('Profile updated successfully in MongoDB');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSkeleton className="h-8 w-1/4 mb-6" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => <LoadingSkeleton key={i} className="h-12 w-full" />)}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidate Profile</h1>
          <p className="text-sm text-slate-500">Manage your skills, experience, and information for smart matching.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input
          label="Full Name"
          value={profile.name || ''}
          onChange={(e) => update('name', e.target.value)}
        />
        <Input
          label="Email (Read-only)"
          disabled
          value={profile.email || ''}
        />
        <Input
          label="Phone Number"
          value={profile.phone || ''}
          placeholder="+91 98765 43210"
          onChange={(e) => update('phone', e.target.value)}
        />
        <Input
          label="Location (City)"
          value={profile.location || ''}
          placeholder="e.g. Bangalore, Pune, Remote"
          onChange={(e) => update('location', e.target.value)}
        />
        <Textarea
          className="md:col-span-2"
          label="Bio / Professional Summary"
          value={profile.bio || ''}
          placeholder="Brief description of your background and career goals..."
          onChange={(e) => update('bio', e.target.value)}
        />
        <Input
          label="Years of Experience"
          type="number"
          min="0"
          value={profile.experience !== undefined ? profile.experience : 0}
          onChange={(e) => update('experience', Number(e.target.value))}
        />
        <Input
          label="Current / Target Role"
          value={profile.currentRole || ''}
          placeholder="e.g. Full Stack MERN Developer"
          onChange={(e) => update('currentRole', e.target.value)}
        />
        <Input
          className="md:col-span-2"
          label="Highest Education"
          value={profile.education || ''}
          placeholder="e.g. B.Tech in Information Technology"
          onChange={(e) => update('education', e.target.value)}
        />
      </div>

      <h2 className="mt-6 font-semibold">Technical Skills</h2>
      <p className="text-xs text-slate-500">Skills are used by the smart matching algorithm (60% weight).</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(profile.skills || []).map((item) => (
          <SkillChip
            key={item}
            onRemove={() => update('skills', profile.skills.filter((s) => s !== item))}
          >
            {item}
          </SkillChip>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          aria-label="Add skill"
          placeholder="e.g. React, Node.js, Docker, Python"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (skill.trim() && !(profile.skills || []).includes(skill.trim())) {
                update('skills', [...(profile.skills || []), skill.trim()]);
                setSkill('');
              }
            }
          }}
        />
        <Button
          type="button"
          onClick={() => {
            if (skill.trim() && !(profile.skills || []).includes(skill.trim())) {
              update('skills', [...(profile.skills || []), skill.trim()]);
              setSkill('');
            }
          }}
        >
          Add
        </Button>
      </div>

      <h2 className="mt-6 font-semibold">Social & Portfolio Links</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <Input
          label="GitHub Profile"
          placeholder="github.com/yourhandle"
          value={profile.links?.github || ''}
          onChange={(e) => update('links', { ...profile.links, github: e.target.value })}
        />
        <Input
          label="LinkedIn Profile"
          placeholder="linkedin.com/in/yourprofile"
          value={profile.links?.linkedin || ''}
          onChange={(e) => update('links', { ...profile.links, linkedin: e.target.value })}
        />
        <Input
          label="Portfolio Website"
          placeholder="yourname.dev"
          value={profile.links?.portfolio || ''}
          onChange={(e) => update('links', { ...profile.links, portfolio: e.target.value })}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setProfile(currentUser || {})}
        >
          Reset Changes
        </Button>
      </div>
    </Card>
  );
}
