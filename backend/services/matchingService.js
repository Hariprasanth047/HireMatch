/**
 * Smart Resume & Job Matching Service
 * 
 * Formula:
 * - Skills Match = 60%
 * - Experience Match = 25%
 * - Location Match = 15%
 * 
 * Overall = (skillScore * 0.60) + (experienceScore * 0.25) + (locationScore * 0.15)
 */

export function calculateJobMatch(candidate, job) {
  const candidateSkills = Array.isArray(candidate?.skills) ? candidate.skills : [];
  const jobSkills = Array.isArray(job?.skills) && job.skills.length > 0 
    ? job.skills 
    : (Array.isArray(job?.requiredSkills) ? job.requiredSkills : []);
  
  const candidateExp = Number(candidate?.experience) || 0;
  const requiredExp = Number(job?.experience !== undefined ? job.experience : (job?.requiredExperience || 0));
  
  const candidateLocation = (candidate?.location || '').trim().toLowerCase();
  const jobLocation = (job?.location || '').trim().toLowerCase();
  const jobWorkMode = (job?.workMode || '').trim().toLowerCase();

  // 1. Skill Matching (60%)
  const normalizedCandidate = candidateSkills.map((s) => s.trim().toLowerCase());
  
  const matchedSkills = [];
  const missingSkills = [];

  jobSkills.forEach((jobSkill) => {
    const norm = jobSkill.trim().toLowerCase();
    const isMatched = normalizedCandidate.some((candSkill) => {
      return candSkill === norm || candSkill.includes(norm) || norm.includes(candSkill);
    });

    if (isMatched) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  const skillScore = jobSkills.length > 0 
    ? Math.round((matchedSkills.length / jobSkills.length) * 100) 
    : 100;

  // 2. Experience Matching (25%)
  let experienceScore = 100;
  if (requiredExp > 0) {
    if (candidateExp >= requiredExp) {
      experienceScore = 100;
    } else {
      experienceScore = Math.min(100, Math.max(0, Math.round((candidateExp / requiredExp) * 100)));
    }
  }

  // 3. Location Matching (15%)
  let locationScore = 65;
  const isRemote = jobLocation === 'remote' || jobWorkMode === 'remote';
  const isSameLocation = candidateLocation && jobLocation && (candidateLocation === jobLocation || candidateLocation.includes(jobLocation) || jobLocation.includes(candidateLocation));

  if (isRemote) {
    locationScore = 100;
  } else if (isSameLocation) {
    locationScore = 100;
  } else if (jobWorkMode === 'hybrid') {
    locationScore = 80;
  } else {
    locationScore = 55;
  }

  // 4. Overall Weighted Score
  const rawOverall = (skillScore * 0.60) + (experienceScore * 0.25) + (locationScore * 0.15);
  const overallScore = Math.min(100, Math.max(0, Math.round(rawOverall)));

  // 5. Compatibility Level
  let compatibilityLevel = 'Low';
  if (overallScore >= 90) {
    compatibilityLevel = 'Excellent';
  } else if (overallScore >= 75) {
    compatibilityLevel = 'Good';
  } else if (overallScore >= 50) {
    compatibilityLevel = 'Moderate';
  } else {
    compatibilityLevel = 'Low';
  }

  return {
    overallScore,
    skillScore,
    experienceScore,
    locationScore,
    matchedSkills,
    missingSkills,
    compatibilityLevel,
  };
}
