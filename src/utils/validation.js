export const validators = {
  required: (value) => (String(value ?? '').trim() ? '' : 'This field is required.'),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.'),
  password: (value) => (String(value).length >= 8 ? '' : 'Password must be at least 8 characters.'),
  salary: (value) => (String(value).trim().length >= 3 ? '' : 'Enter a valid salary range.'),
  experience: (value) => (Number(value) >= 0 ? '' : 'Experience cannot be negative.'),
  description: (value) => (String(value).trim().length >= 30 ? '' : 'Description should be at least 30 characters.'),
  skills: (value) => (value?.length ? '' : 'Add at least one skill.'),
};

export function validateJobForm(form) {
  const errors = {};
  ['title', 'company', 'location', 'jobType', 'workMode'].forEach((field) => {
    const error = validators.required(form[field]);
    if (error) errors[field] = error;
  });
  const description = validators.description(form.description);
  if (description) errors.description = description;
  const salary = validators.salary(form.salary);
  if (salary) errors.salary = salary;
  const experience = validators.experience(form.experience);
  if (experience) errors.experience = experience;
  const skills = validators.skills(form.skills);
  if (skills) errors.skills = skills;
  return errors;
}
