export function calculateMockMatch(candidateSkills = [], jobSkills = [], candidateExperience = 0, requiredExperience = 0, candidateLocation = '', jobLocation = '') {
  const normalizedCandidate = candidateSkills.map((skill) => skill.toLowerCase());
  const matchedSkills = jobSkills.filter((skill) => normalizedCandidate.includes(skill.toLowerCase()));
  const missingSkills = jobSkills.filter((skill) => !normalizedCandidate.includes(skill.toLowerCase()));
  const skillScore = jobSkills.length ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 100;
  const experienceScore = requiredExperience <= 0 ? 100 : Math.min(100, Math.round((candidateExperience / requiredExperience) * 100));
  const isRemote = jobLocation.toLowerCase() === 'remote';
  const locationScore = isRemote || candidateLocation.toLowerCase() === jobLocation.toLowerCase() ? 100 : 65;
  const overallScore = Math.round(skillScore * 0.6 + experienceScore * 0.25 + locationScore * 0.15);

  return { overallScore, skillScore, experienceScore, locationScore, matchedSkills, missingSkills };
}

export function matchTone(score) {
  if (score >= 90) return { label: 'Excellent', color: 'emerald' };
  if (score >= 75) return { label: 'Good', color: 'blue' };
  if (score >= 60) return { label: 'Moderate', color: 'amber' };
  return { label: 'Low', color: 'rose' };
}
