import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Resume } from '../models/Resume.js';
import { calculateJobMatch } from '../services/matchingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hirematch';

const mockSeedUsers = [
  {
    name: 'Aarav Mehta',
    email: 'candidate@example.com',
    password: 'password123',
    role: 'JOB_SEEKER',
    phone: '+91 98765 43210',
    location: 'Bangalore',
    currentRole: 'MERN Stack Developer',
    experience: 2,
    education: 'B.Tech Information Technology',
    bio: 'Frontend-focused MERN developer building responsive dashboards and REST APIs.',
    skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'HTML', 'CSS', 'Git'],
    links: { github: 'github.com/aarav-dev', linkedin: 'linkedin.com/in/aarav', portfolio: 'aarav.dev' },
  },
  {
    name: 'John Mathew',
    email: 'john@example.com',
    password: 'password123',
    role: 'JOB_SEEKER',
    phone: '+91 98765 11111',
    location: 'Bangalore',
    currentRole: 'Senior React Developer',
    experience: 3,
    education: 'B.Tech CSE',
    bio: 'Passionate about React performance, state management, and Node microservices.',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express', 'Git', 'Docker'],
  },
  {
    name: 'Alex Roy',
    email: 'alex@example.com',
    password: 'password123',
    role: 'JOB_SEEKER',
    phone: '+91 98765 22222',
    location: 'Pune',
    currentRole: 'Full Stack Engineer',
    experience: 2,
    education: 'BCA',
    bio: 'MERN stack builder passionate about modern web apps.',
    skills: ['React', 'Node.js', 'MongoDB', 'Git', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'David Kumar',
    email: 'david@example.com',
    password: 'password123',
    role: 'JOB_SEEKER',
    phone: '+91 98765 33333',
    location: 'Mumbai',
    currentRole: 'Java Backend Engineer',
    experience: 4,
    education: 'MCA',
    bio: 'Experienced Java & Spring Boot developer with relational database optimization expertise.',
    skills: ['Java', 'Spring Boot', 'SQL', 'REST API', 'PostgreSQL', 'Docker'],
  },
  {
    name: 'Sara Khan',
    email: 'sara@example.com',
    password: 'password123',
    role: 'JOB_SEEKER',
    phone: '+91 98765 44444',
    location: 'Bangalore',
    currentRole: 'Node.js Developer',
    experience: 2,
    education: 'B.Tech CSE',
    bio: 'Backend developer focused on scalable APIs and containerization.',
    skills: ['React', 'Node.js', 'Express', 'Docker', 'MongoDB', 'JavaScript'],
  },
  {
    name: 'Priya Nair',
    email: 'recruiter@example.com',
    password: 'password123',
    role: 'RECRUITER',
    phone: '+91 98765 99999',
    company: 'NovaTech Labs',
    location: 'Bangalore',
    bio: 'Lead Talent Partner at NovaTech Labs scaling cloud engineering teams.',
  },
];

const mockJobsData = [
  {
    title: 'MERN Stack Developer',
    company: 'NovaTech Labs',
    companyDescription: 'Cloud hiring products for fast-growing enterprise engineering teams.',
    location: 'Bangalore',
    workMode: 'Hybrid',
    experience: 2,
    salary: '8-12 LPA',
    jobType: 'Full Time',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express', 'Git'],
    niceToHave: ['Docker', 'AWS'],
    status: 'Active',
    description: 'Build scalable hiring dashboards and applicant workflows for enterprise teams.',
    responsibilities: ['Build responsive React modules', 'Integrate REST API contracts', 'Improve frontend performance'],
    requirements: ['2+ years MERN experience', 'Strong JavaScript fundamentals', 'Good component design habits'],
  },
  {
    title: 'Frontend Developer',
    company: 'PixelCraft Studio',
    companyDescription: 'Product design and frontend engineering studio.',
    location: 'Pune',
    workMode: 'Remote',
    experience: 1,
    salary: '6-9 LPA',
    jobType: 'Full Time',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind'],
    niceToHave: ['Figma', 'TypeScript'],
    status: 'Active',
    description: 'Create polished customer-facing web experiences with modern React.',
    responsibilities: ['Ship UI components', 'Collaborate with designers', 'Maintain accessibility'],
    requirements: ['React project experience', 'Strong CSS layout skills', 'Portfolio or GitHub work'],
  },
  {
    title: 'Java Developer',
    company: 'FinEdge Digital',
    companyDescription: 'Consumer finance and payment workflow products.',
    location: 'Mumbai',
    workMode: 'On-site',
    experience: 3,
    salary: '10-15 LPA',
    jobType: 'Full Time',
    skills: ['Java', 'Spring Boot', 'SQL', 'REST API'],
    niceToHave: ['Kafka', 'AWS'],
    status: 'Active',
    description: 'Develop secure financial services APIs and payment workflows.',
    responsibilities: ['Build Spring services', 'Write reliable tests', 'Review API designs'],
    requirements: ['3+ years Java', 'SQL knowledge', 'API security awareness'],
  },
  {
    title: 'Backend Developer',
    company: 'CloudNest Systems',
    companyDescription: 'Managed DevOps and platform automation services.',
    location: 'Remote',
    workMode: 'Remote',
    experience: 2,
    salary: '9-13 LPA',
    jobType: 'Full Time',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
    niceToHave: ['Kubernetes', 'AWS'],
    status: 'Active',
    description: 'Own backend services for cloud automation products.',
    responsibilities: ['Design APIs', 'Maintain databases', 'Improve observability'],
    requirements: ['Node.js services', 'Database fundamentals', 'Docker basics'],
  },
  {
    title: 'Full Stack Developer',
    company: 'DataForge AI',
    companyDescription: 'Analytics platforms for finance and retail teams.',
    location: 'Hyderabad',
    workMode: 'Hybrid',
    experience: 2,
    salary: '9-14 LPA',
    jobType: 'Full Time',
    skills: ['React', 'Python', 'FastAPI', 'SQL', 'JavaScript'],
    niceToHave: ['ML', 'Docker'],
    status: 'Active',
    description: 'Build analytics features across React dashboards and Python services.',
    responsibilities: ['Create data-rich UI', 'Wire API responses', 'Support backend endpoints'],
    requirements: ['React and API experience', 'Python basics', 'SQL comfort'],
  },
  {
    title: 'React Developer Intern',
    company: 'PixelCraft Studio',
    companyDescription: 'Product design and frontend engineering studio.',
    location: 'Chennai',
    workMode: 'Remote',
    experience: 0,
    salary: '25K/month',
    jobType: 'Internship',
    skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    niceToHave: ['Tailwind'],
    status: 'Active',
    description: 'Internship for developers who enjoy clean UI implementation.',
    responsibilities: ['Build small features', 'Fix UI bugs', 'Document components'],
    requirements: ['React fundamentals', 'CSS basics', 'Learning mindset'],
  },
  {
    title: 'Software Engineer',
    company: 'NovaTech Labs',
    companyDescription: 'Cloud hiring products for fast-growing teams.',
    location: 'Bangalore',
    workMode: 'On-site',
    experience: 2,
    salary: '8-11 LPA',
    jobType: 'Full Time',
    skills: ['JavaScript', 'React', 'REST API', 'Git'],
    niceToHave: ['Testing', 'CI/CD'],
    status: 'Active',
    description: 'Work across customer features, integrations, and internal tools.',
    responsibilities: ['Implement product features', 'Debug production issues', 'Partner with QA'],
    requirements: ['Web development experience', 'Git workflow', 'API integration'],
  },
  {
    title: 'Data Analyst',
    company: 'DataForge AI',
    companyDescription: 'Analytics platforms for finance and retail teams.',
    location: 'Hyderabad',
    workMode: 'Hybrid',
    experience: 1,
    salary: '5-8 LPA',
    jobType: 'Full Time',
    skills: ['SQL', 'Python', 'Excel', 'Power BI'],
    niceToHave: ['Statistics'],
    status: 'Active',
    description: 'Turn product data into useful operational reports.',
    responsibilities: ['Create dashboards', 'Analyze funnels', 'Prepare reports'],
    requirements: ['SQL queries', 'Python notebooks', 'Data storytelling'],
  },
  {
    title: 'Python Developer',
    company: 'CloudNest Systems',
    companyDescription: 'Managed DevOps and platform automation services.',
    location: 'Remote',
    workMode: 'Remote',
    experience: 2,
    salary: '7-10 LPA',
    jobType: 'Contract',
    skills: ['Python', 'Django', 'REST API', 'PostgreSQL'],
    niceToHave: ['Docker'],
    status: 'Active',
    description: 'Contract role building service APIs and automation scripts.',
    responsibilities: ['Develop endpoints', 'Refactor jobs', 'Write tests'],
    requirements: ['Python web experience', 'PostgreSQL', 'API design'],
  },
  {
    title: 'Node.js Developer',
    company: 'NovaTech Labs',
    companyDescription: 'Cloud hiring products for fast-growing teams.',
    location: 'Bangalore',
    workMode: 'Hybrid',
    experience: 2,
    salary: '8-13 LPA',
    jobType: 'Full Time',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    niceToHave: ['Redis', 'Docker'],
    status: 'Active',
    description: 'Build APIs for matching workflows and recruiter tools.',
    responsibilities: ['Design backend modules', 'Optimize queries', 'Support integrations'],
    requirements: ['Node.js experience', 'MongoDB schema design', 'REST APIs'],
  },
  {
    title: 'Product Engineer',
    company: 'FinEdge Digital',
    companyDescription: 'Consumer finance and payment workflow products.',
    location: 'Mumbai',
    workMode: 'Hybrid',
    experience: 2,
    salary: '10-16 LPA',
    jobType: 'Full Time',
    skills: ['React', 'Node.js', 'SQL', 'Testing'],
    niceToHave: ['TypeScript'],
    status: 'Draft',
    description: 'Own product features from UX through release.',
    responsibilities: ['Scope features', 'Implement full-stack changes', 'Measure adoption'],
    requirements: ['Product thinking', 'React skills', 'Backend collaboration'],
  },
  {
    title: 'QA Automation Engineer',
    company: 'DataForge AI',
    companyDescription: 'Analytics platforms for finance and retail teams.',
    location: 'Hyderabad',
    workMode: 'Remote',
    experience: 1,
    salary: '6-9 LPA',
    jobType: 'Full Time',
    skills: ['JavaScript', 'Playwright', 'Testing', 'CI/CD'],
    niceToHave: ['React'],
    status: 'Closed',
    description: 'Create reliable browser tests and release quality checks.',
    responsibilities: ['Automate test flows', 'Review regressions', 'Improve CI signals'],
    requirements: ['Testing basics', 'JavaScript', 'Debugging skills'],
  },
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const isClearOnly = process.argv.includes('--clear');

    // Wipe collections
    console.log('Clearing existing collections...');
    await Application.deleteMany({});
    await Resume.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data.');

    if (isClearOnly) {
      console.log('Database successfully cleared. Exiting.');
      process.exit(0);
    }

    // 1. Create Users
    console.log('Seeding demo users...');
    const createdUsers = [];
    for (const userData of mockSeedUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} demo users.`);

    const primarySeeker = createdUsers.find((u) => u.email === 'candidate@example.com');
    const primaryRecruiter = createdUsers.find((u) => u.email === 'recruiter@example.com');
    const otherSeekers = createdUsers.filter((u) => u.role === 'JOB_SEEKER' && u.email !== 'candidate@example.com');

    // 2. Create Sample Resume for Primary Seeker
    const resumeDoc = await Resume.create({
      user: primarySeeker._id,
      originalFileName: 'Aarav_Mehta_Resume.pdf',
      filePath: 'uploads/resumes/demo-resume.pdf',
      fileType: 'application/pdf',
      fileSize: '142.5 KB',
      extractedText: 'Aarav Mehta MERN Developer React Node.js Express MongoDB JavaScript HTML CSS Git 2 years experience B.Tech IT',
      extractedSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'HTML', 'CSS', 'Git'],
      extractedExperience: ['2 years'],
      extractedEducation: ['B.Tech Information Technology'],
      extractedKeywords: ['REST API', 'Responsive Design', 'Git', 'Agile'],
      strengths: ['Strong frontend skills', 'Good JavaScript knowledge', 'MERN stack experience'],
      missingSkills: ['Docker', 'AWS', 'CI/CD'],
      suggestedSkills: ['TypeScript', 'Testing', 'Cloud Basics'],
      analysisScore: 88,
      status: 'Resume Analysis Complete',
    });

    // 3. Create Jobs
    console.log('Seeding jobs...');
    const createdJobs = [];
    for (const jobData of mockJobsData) {
      const job = await Job.create({
        ...jobData,
        recruiter: primaryRecruiter._id,
      });
      createdJobs.push(job);
    }
    console.log(`Created ${createdJobs.length} jobs.`);

    // 4. Create Applications for Primary Seeker & other candidates
    console.log('Seeding applications...');
    const initialSeekerJobs = [createdJobs[0], createdJobs[1], createdJobs[6], createdJobs[9]];

    for (const job of initialSeekerJobs) {
      const match = calculateJobMatch(primarySeeker, job);
      await Application.create({
        applicant: primarySeeker._id,
        job: job._id,
        resume: resumeDoc._id,
        coverLetter: `I am excited to apply for the ${job.title} position at ${job.company}. My 2+ years of MERN stack experience matches your requirements well.`,
        status: job.title.includes('MERN') ? 'Shortlisted' : 'Applied',
        matchScore: match.overallScore,
        skillScore: match.skillScore,
        experienceScore: match.experienceScore,
        locationScore: match.locationScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        compatibilityLevel: match.compatibilityLevel,
      });
      await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });
    }

    // Add applications from other seekers to job 0 (MERN Stack Developer)
    const mernJob = createdJobs[0];
    for (const seeker of otherSeekers) {
      const match = calculateJobMatch(seeker, mernJob);
      let status = 'Applied';
      if (match.overallScore >= 90) status = 'Shortlisted';
      else if (match.overallScore >= 80) status = 'Interview';

      await Application.create({
        applicant: seeker._id,
        job: mernJob._id,
        coverLetter: `Hello, applying for ${mernJob.title}.`,
        status,
        matchScore: match.overallScore,
        skillScore: match.skillScore,
        experienceScore: match.experienceScore,
        locationScore: match.locationScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        compatibilityLevel: match.compatibilityLevel,
      });
      await Job.findByIdAndUpdate(mernJob._id, { $inc: { applicationsCount: 1 } });
    }

    console.log('✅ Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO ACCOUNTS:');
    console.log('1) Job Seeker:  candidate@example.com / password123');
    console.log('2) Recruiter:   recruiter@example.com / password123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
