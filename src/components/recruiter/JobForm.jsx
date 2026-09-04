import { useState } from 'react';
import Button from '../common/Button';
import { Input, Select, Textarea } from '../common/FormControls';
import SkillChip from '../common/SkillChip';
import { validateJobForm } from '../../utils/validation';

const initial = { title: '', company: 'NovaTech Labs', description: '', responsibilities: '', requirements: '', skills: [], location: '', experience: 1, salary: '', jobType: 'Full Time', workMode: 'Hybrid', status: 'Draft', niceToHave: [] };

export default function JobForm({ defaultValue, onSubmit }) {
  const [form, setForm] = useState(defaultValue || initial);
  const [skill, setSkill] = useState('');
  const [errors, setErrors] = useState({});
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (status) => {
    const next = { ...form, status, responsibilities: Array.isArray(form.responsibilities) ? form.responsibilities : form.responsibilities.split('\n').filter(Boolean), requirements: Array.isArray(form.requirements) ? form.requirements : form.requirements.split('\n').filter(Boolean), niceToHave: form.niceToHave || [] };
    const validation = validateJobForm(next);
    setErrors(validation);
    if (!Object.keys(validation).length) onSubmit(next);
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2"><Input label="Job Title" error={errors.title} value={form.title} onChange={(e) => update('title', e.target.value)} /><Input label="Company" error={errors.company} value={form.company} onChange={(e) => update('company', e.target.value)} /><Input label="Location" error={errors.location} value={form.location} onChange={(e) => update('location', e.target.value)} /><Input label="Experience" type="number" error={errors.experience} value={form.experience} onChange={(e) => update('experience', Number(e.target.value))} /><Input label="Salary" error={errors.salary} value={form.salary} onChange={(e) => update('salary', e.target.value)} /><Select label="Job Type" value={form.jobType} onChange={(e) => update('jobType', e.target.value)}><option>Full Time</option><option>Part Time</option><option>Internship</option><option>Contract</option></Select><Select label="Work Mode" value={form.workMode} onChange={(e) => update('workMode', e.target.value)}><option>Remote</option><option>Hybrid</option><option>On-site</option></Select></div>
      <Textarea label="Description" rows="4" error={errors.description} value={form.description} onChange={(e) => update('description', e.target.value)} />
      <Textarea label="Responsibilities" rows="3" value={Array.isArray(form.responsibilities) ? form.responsibilities.join('\n') : form.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} />
      <Textarea label="Requirements" rows="3" value={Array.isArray(form.requirements) ? form.requirements.join('\n') : form.requirements} onChange={(e) => update('requirements', e.target.value)} />
      <div><label className="text-sm font-semibold">Skills</label><div className="mt-2 flex flex-wrap gap-2">{form.skills.map((item) => <SkillChip key={item} onRemove={() => update('skills', form.skills.filter((s) => s !== item))}>{item}</SkillChip>)}</div>{errors.skills && <p className="mt-1 text-xs text-rose-600">{errors.skills}</p>}<div className="mt-2 flex gap-2"><Input aria-label="Skill" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="React" /><Button variant="secondary" onClick={() => { if (skill.trim()) update('skills', [...form.skills, skill.trim()]); setSkill(''); }}>Add Skill</Button></div></div>
      <div className="flex gap-3"><Button variant="secondary" onClick={() => submit('Draft')}>Save Draft</Button><Button onClick={() => submit('Active')}>Publish Job</Button></div>
    </div>
  );
}
