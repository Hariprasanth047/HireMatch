import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Known technical skills dictionary
const SKILLS_DICTIONARY = [
  'React', 'React.js', 'Node.js', 'Node', 'Express', 'Express.js', 'MongoDB',
  'JavaScript', 'TypeScript', 'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind', 'Tailwind CSS',
  'Bootstrap', 'Redux', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Python', 'Django',
  'Flask', 'FastAPI', 'Java', 'Spring', 'Spring Boot', 'C++', 'C#', '.NET',
  'PHP', 'Laravel', 'SQL', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'GraphQL',
  'REST API', 'RESTful API', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'CI/CD', 'Git', 'GitHub', 'GitLab', 'Figma', 'Linux', 'Microservices',
  'Jest', 'Mocha', 'Playwright', 'Selenium', 'Machine Learning', 'Data Analysis'
];

const DEGREE_PATTERNS = [
  'B\\.Tech', 'BTech', 'B\\.E', 'BE', 'BCA', 'MCA', 'M\\.Tech', 'MTech',
  'B\\.Sc', 'BSc', 'M\\.Sc', 'MSc', 'Bachelor of Technology',
  'Bachelor of Engineering', 'Master of Computer Applications', 'B\\.Com', 'MBA', 'PhD'
];

/**
 * Extract plain text from PDF, DOCX, or DOC files
 */
export async function extractTextFromFile(filePath, fileType) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const dataBuffer = fs.readFileSync(filePath);

    if (ext === '.pdf' || fileType === 'application/pdf') {
      const parsedPdf = await pdfParse(dataBuffer);
      return parsedPdf.text || '';
    } else if (ext === '.docx' || fileType.includes('openxmlformats')) {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value || '';
    } else {
      // Fallback text read
      return dataBuffer.toString('utf-8', 0, Math.min(dataBuffer.length, 50000));
    }
  } catch (error) {
    console.warn(`[Resume Extraction Warning] Could not parse text from ${filePath}:`, error.message);
    return '';
  }
}

/**
 * Analyze extracted resume text to find skills, experience, degrees, and scores
 */
export function analyzeResumeText(rawText = '', existingSkills = []) {
  const text = rawText.toLowerCase();

  // 1. Detect Skills
  const detectedSkillsSet = new Set();

  SKILLS_DICTIONARY.forEach((skill) => {
    // Check if skill word exists in text with word boundary or clean check
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(rawText)) {
      detectedSkillsSet.add(skill);
    }
  });

  // Combine with existing user profile skills if present
  existingSkills.forEach((s) => detectedSkillsSet.add(s));
  const detectedSkills = Array.from(detectedSkillsSet);

  // 2. Detect Experience
  const detectedExperience = [];
  const expMatch = rawText.match(/(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of\s+experience)?/i);
  if (expMatch) {
    detectedExperience.push(`${expMatch[1]} years`);
  } else {
    detectedExperience.push(existingSkills.length > 3 ? '2+ years (Estimated)' : '1 year (Entry-level)');
  }

  // 3. Detect Education / Degree
  const detectedEducation = [];
  DEGREE_PATTERNS.forEach((deg) => {
    const reg = new RegExp(`\\b${deg}\\b`, 'i');
    const match = rawText.match(reg);
    if (match && !detectedEducation.includes(match[0])) {
      detectedEducation.push(match[0]);
    }
  });

  if (detectedEducation.length === 0) {
    detectedEducation.push('B.Tech / Bachelor Degree (Inferred)');
  }

  // 4. Detected Keywords
  const detectedKeywords = [];
  const sampleKeywords = ['REST API', 'Responsive Design', 'Git', 'Agile', 'Clean Code', 'Performance Optimization', 'Full-stack'];
  sampleKeywords.forEach((kw) => {
    if (rawText.toLowerCase().includes(kw.toLowerCase())) {
      detectedKeywords.push(kw);
    }
  });
  if (detectedKeywords.length === 0) {
    detectedKeywords.push('REST API', 'Git', 'Responsive Design');
  }

  // 5. Strengths
  const strengths = [];
  if (detectedSkills.length >= 5) strengths.push('Broad technical skill set');
  if (detectedSkills.some((s) => ['React', 'Vue', 'Angular'].includes(s))) strengths.push('Strong modern frontend capabilities');
  if (detectedSkills.some((s) => ['Node.js', 'Express', 'Python', 'Java'].includes(s))) strengths.push('Solid backend and API foundation');
  if (strengths.length === 0) strengths.push('Eager learner with core technical fundamentals');

  // 6. Missing & Suggested Skills
  const commonCloudSkills = ['Docker', 'AWS', 'CI/CD', 'Kubernetes', 'TypeScript', 'Testing'];
  const missingSkills = commonCloudSkills.filter((s) => !detectedSkills.includes(s)).slice(0, 3);
  const suggestedSkills = ['TypeScript', 'Testing (Jest/Playwright)', 'Cloud Deployment (AWS/Docker)'].filter(
    (s) => !detectedSkills.some((ds) => s.toLowerCase().includes(ds.toLowerCase()))
  ).slice(0, 3);

  // 7. Analysis Score
  let score = 70;
  score += Math.min(20, detectedSkills.length * 3);
  if (detectedEducation.length > 0) score += 5;
  if (detectedKeywords.length > 1) score += 5;
  const analysisScore = Math.min(96, Math.max(60, score));

  return {
    detectedSkills,
    detectedExperience,
    detectedEducation,
    detectedKeywords,
    strengths,
    missingSkills,
    suggestedSkills,
    analysisScore,
  };
}
