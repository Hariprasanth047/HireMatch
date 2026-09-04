export const roles = {
  seeker: 'JOB_SEEKER',
  recruiter: 'RECRUITER',
};

export const mockUsers = [
  {
    id: 'u1',
    name: 'Aarav Mehta',
    email: 'candidate@example.com',
    password: 'password123',
    role: roles.seeker,
    phone: '+91 98765 43210',
    location: 'Bangalore',
    currentRole: 'MERN Stack Developer',
    experience: 2,
    education: 'B.Tech Information Technology',
    bio: 'Frontend-focused MERN developer building responsive dashboards and APIs.',
    skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'HTML', 'CSS', 'Git'],
    links: { github: 'github.com/aarav-dev', linkedin: 'linkedin.com/in/aarav', portfolio: 'aarav.dev' },
  },
  {
    id: 'u2',
    name: 'Priya Nair',
    email: 'recruiter@example.com',
    password: 'password123',
    role: roles.recruiter,
    company: 'NovaTech Labs',
    location: 'Bangalore',
  },
];

export const mockCompanies = [
  { id: 'c1', name: 'NovaTech Labs', industry: 'SaaS', location: 'Bangalore', openPositions: 8, description: 'Cloud hiring products for fast-growing teams.' },
  { id: 'c2', name: 'PixelCraft Studio', industry: 'Design Technology', location: 'Pune', openPositions: 5, description: 'Product design and frontend engineering studio.' },
  { id: 'c3', name: 'DataForge AI', industry: 'Analytics', location: 'Hyderabad', openPositions: 6, description: 'Analytics platforms for finance and retail teams.' },
  { id: 'c4', name: 'CloudNest Systems', industry: 'Cloud Infrastructure', location: 'Remote', openPositions: 4, description: 'Managed DevOps and platform automation services.' },
  { id: 'c5', name: 'FinEdge Digital', industry: 'FinTech', location: 'Mumbai', openPositions: 7, description: 'Consumer finance and payment workflow products.' },
];

export const mockJobs = [
  { id: 'j1', title: 'MERN Stack Developer', company: 'NovaTech Labs', location: 'Bangalore', workMode: 'Hybrid', experience: 2, salary: '8-12 LPA', jobType: 'Full Time', skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express', 'Git'], niceToHave: ['Docker', 'AWS'], postedDate: '2026-08-10', match: 92, status: 'Active', applications: 34, createdDate: '2026-08-01', description: 'Build scalable hiring dashboards and applicant workflows for enterprise teams.', responsibilities: ['Build responsive React modules', 'Integrate REST API contracts', 'Improve frontend performance'], requirements: ['2+ years MERN experience', 'Strong JavaScript fundamentals', 'Good component design habits'] },
  { id: 'j2', title: 'Frontend Developer', company: 'PixelCraft Studio', location: 'Pune', workMode: 'Remote', experience: 1, salary: '6-9 LPA', jobType: 'Full Time', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind'], niceToHave: ['Figma', 'TypeScript'], postedDate: '2026-08-08', match: 88, status: 'Active', applications: 21, createdDate: '2026-08-02', description: 'Create polished customer-facing web experiences with modern React.', responsibilities: ['Ship UI components', 'Collaborate with designers', 'Maintain accessibility'], requirements: ['React project experience', 'Strong CSS layout skills', 'Portfolio or GitHub work'] },
  { id: 'j3', title: 'Java Developer', company: 'FinEdge Digital', location: 'Mumbai', workMode: 'On-site', experience: 3, salary: '10-15 LPA', jobType: 'Full Time', skills: ['Java', 'Spring Boot', 'SQL', 'REST API'], niceToHave: ['Kafka', 'AWS'], postedDate: '2026-08-06', match: 64, status: 'Active', applications: 19, createdDate: '2026-07-25', description: 'Develop secure financial services APIs and payment workflows.', responsibilities: ['Build Spring services', 'Write reliable tests', 'Review API designs'], requirements: ['3+ years Java', 'SQL knowledge', 'API security awareness'] },
  { id: 'j4', title: 'Backend Developer', company: 'CloudNest Systems', location: 'Remote', workMode: 'Remote', experience: 2, salary: '9-13 LPA', jobType: 'Full Time', skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'], niceToHave: ['Kubernetes', 'AWS'], postedDate: '2026-08-05', match: 79, status: 'Active', applications: 26, createdDate: '2026-07-26', description: 'Own backend services for cloud automation products.', responsibilities: ['Design APIs', 'Maintain databases', 'Improve observability'], requirements: ['Node.js services', 'Database fundamentals', 'Docker basics'] },
  { id: 'j5', title: 'Full Stack Developer', company: 'DataForge AI', location: 'Hyderabad', workMode: 'Hybrid', experience: 2, salary: '9-14 LPA', jobType: 'Full Time', skills: ['React', 'Python', 'FastAPI', 'SQL', 'JavaScript'], niceToHave: ['ML', 'Docker'], postedDate: '2026-08-03', match: 81, status: 'Active', applications: 31, createdDate: '2026-07-23', description: 'Build analytics features across React dashboards and Python services.', responsibilities: ['Create data-rich UI', 'Wire API responses', 'Support backend endpoints'], requirements: ['React and API experience', 'Python basics', 'SQL comfort'] },
  { id: 'j6', title: 'React Developer Intern', company: 'PixelCraft Studio', location: 'Chennai', workMode: 'Remote', experience: 0, salary: '25K/month', jobType: 'Internship', skills: ['React', 'JavaScript', 'HTML', 'CSS'], niceToHave: ['Tailwind'], postedDate: '2026-08-11', match: 95, status: 'Active', applications: 45, createdDate: '2026-08-09', description: 'Internship for developers who enjoy clean UI implementation.', responsibilities: ['Build small features', 'Fix UI bugs', 'Document components'], requirements: ['React fundamentals', 'CSS basics', 'Learning mindset'] },
  { id: 'j7', title: 'Software Engineer', company: 'NovaTech Labs', location: 'Bangalore', workMode: 'On-site', experience: 2, salary: '8-11 LPA', jobType: 'Full Time', skills: ['JavaScript', 'React', 'REST API', 'Git'], niceToHave: ['Testing', 'CI/CD'], postedDate: '2026-08-01', match: 84, status: 'Active', applications: 28, createdDate: '2026-07-20', description: 'Work across customer features, integrations, and internal tools.', responsibilities: ['Implement product features', 'Debug production issues', 'Partner with QA'], requirements: ['Web development experience', 'Git workflow', 'API integration'] },
  { id: 'j8', title: 'Data Analyst', company: 'DataForge AI', location: 'Hyderabad', workMode: 'Hybrid', experience: 1, salary: '5-8 LPA', jobType: 'Full Time', skills: ['SQL', 'Python', 'Excel', 'Power BI'], niceToHave: ['Statistics'], postedDate: '2026-07-31', match: 48, status: 'Active', applications: 17, createdDate: '2026-07-18', description: 'Turn product data into useful operational reports.', responsibilities: ['Create dashboards', 'Analyze funnels', 'Prepare reports'], requirements: ['SQL queries', 'Python notebooks', 'Data storytelling'] },
  { id: 'j9', title: 'Python Developer', company: 'CloudNest Systems', location: 'Remote', workMode: 'Remote', experience: 2, salary: '7-10 LPA', jobType: 'Contract', skills: ['Python', 'Django', 'REST API', 'PostgreSQL'], niceToHave: ['Docker'], postedDate: '2026-07-29', match: 58, status: 'Active', applications: 14, createdDate: '2026-07-15', description: 'Contract role building service APIs and automation scripts.', responsibilities: ['Develop endpoints', 'Refactor jobs', 'Write tests'], requirements: ['Python web experience', 'PostgreSQL', 'API design'] },
  { id: 'j10', title: 'UI/UX Developer', company: 'PixelCraft Studio', location: 'Pune', workMode: 'Hybrid', experience: 1, salary: '6-8 LPA', jobType: 'Part Time', skills: ['HTML', 'CSS', 'JavaScript', 'Figma'], niceToHave: ['React'], postedDate: '2026-07-27', match: 76, status: 'Active', applications: 12, createdDate: '2026-07-10', description: 'Blend interface design and frontend implementation for product teams.', responsibilities: ['Prototype screens', 'Build landing flows', 'Run UI reviews'], requirements: ['Strong visual craft', 'CSS fluency', 'Design handoff comfort'] },
  { id: 'j11', title: 'DevOps Engineer', company: 'CloudNest Systems', location: 'Noida', workMode: 'On-site', experience: 3, salary: '12-18 LPA', jobType: 'Full Time', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], niceToHave: ['Terraform'], postedDate: '2026-07-25', match: 42, status: 'Active', applications: 18, createdDate: '2026-07-08', description: 'Automate cloud environments and deployment pipelines.', responsibilities: ['Maintain CI/CD', 'Monitor systems', 'Harden infrastructure'], requirements: ['Cloud experience', 'Container orchestration', 'Incident response'] },
  { id: 'j12', title: 'Junior Web Developer', company: 'FinEdge Digital', location: 'Kochi', workMode: 'Hybrid', experience: 0, salary: '4-6 LPA', jobType: 'Full Time', skills: ['HTML', 'CSS', 'JavaScript', 'React'], niceToHave: ['Git'], postedDate: '2026-07-24', match: 90, status: 'Active', applications: 39, createdDate: '2026-07-07', description: 'Entry-level role supporting frontend feature delivery.', responsibilities: ['Build UI fixes', 'Maintain pages', 'Learn product domain'], requirements: ['Frontend basics', 'Clear communication', 'Git exposure'] },
  { id: 'j13', title: 'Node.js Developer', company: 'NovaTech Labs', location: 'Bangalore', workMode: 'Hybrid', experience: 2, salary: '8-13 LPA', jobType: 'Full Time', skills: ['Node.js', 'Express', 'MongoDB', 'REST API'], niceToHave: ['Redis', 'Docker'], postedDate: '2026-07-22', match: 86, status: 'Active', applications: 23, createdDate: '2026-07-05', description: 'Build APIs for matching workflows and recruiter tools.', responsibilities: ['Design backend modules', 'Optimize queries', 'Support integrations'], requirements: ['Node.js experience', 'MongoDB schema design', 'REST APIs'] },
  { id: 'j14', title: 'Product Engineer', company: 'FinEdge Digital', location: 'Mumbai', workMode: 'Hybrid', experience: 2, salary: '10-16 LPA', jobType: 'Full Time', skills: ['React', 'Node.js', 'SQL', 'Testing'], niceToHave: ['TypeScript'], postedDate: '2026-07-20', match: 83, status: 'Draft', applications: 9, createdDate: '2026-07-02', description: 'Own product features from UX through release.', responsibilities: ['Scope features', 'Implement full-stack changes', 'Measure adoption'], requirements: ['Product thinking', 'React skills', 'Backend collaboration'] },
  { id: 'j15', title: 'QA Automation Engineer', company: 'DataForge AI', location: 'Hyderabad', workMode: 'Remote', experience: 1, salary: '6-9 LPA', jobType: 'Full Time', skills: ['JavaScript', 'Playwright', 'Testing', 'CI/CD'], niceToHave: ['React'], postedDate: '2026-07-18', match: 67, status: 'Closed', applications: 11, createdDate: '2026-06-28', description: 'Create reliable browser tests and release quality checks.', responsibilities: ['Automate test flows', 'Review regressions', 'Improve CI signals'], requirements: ['Testing basics', 'JavaScript', 'Debugging skills'] },
];

export const mockCandidates = [
  { id: 'a1', name: 'John Mathew', email: 'john@example.com', jobId: 'j1', job: 'MERN Stack Developer', location: 'Bangalore', experience: 3, education: 'B.Tech CSE', skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express'], status: 'Shortlisted', appliedDate: '2026-08-11', match: 94 },
  { id: 'a2', name: 'Alex Roy', email: 'alex@example.com', jobId: 'j1', job: 'MERN Stack Developer', location: 'Pune', experience: 2, education: 'BCA', skills: ['React', 'Node.js', 'MongoDB', 'Git'], status: 'Applied', appliedDate: '2026-08-10', match: 89 },
  { id: 'a3', name: 'David Kumar', email: 'david@example.com', jobId: 'j3', job: 'Java Developer', location: 'Mumbai', experience: 4, education: 'MCA', skills: ['Java', 'Spring Boot', 'SQL', 'REST API'], status: 'Interview', appliedDate: '2026-08-08', match: 82 },
  { id: 'a4', name: 'Michael Dsouza', email: 'michael@example.com', jobId: 'j2', job: 'Frontend Developer', location: 'Remote', experience: 1, education: 'B.Tech IT', skills: ['React', 'CSS', 'JavaScript', 'Tailwind'], status: 'Applied', appliedDate: '2026-08-07', match: 76 },
  { id: 'a5', name: 'Sara Khan', email: 'sara@example.com', jobId: 'j1', job: 'MERN Stack Developer', location: 'Bangalore', experience: 2, education: 'B.Tech CSE', skills: ['React', 'Node.js', 'Express', 'Docker'], status: 'Applied', appliedDate: '2026-08-06', match: 87 },
  { id: 'a6', name: 'Nisha Pillai', email: 'nisha@example.com', jobId: 'j6', job: 'React Developer Intern', location: 'Chennai', experience: 0, education: 'B.E ECE', skills: ['React', 'JavaScript', 'HTML', 'CSS'], status: 'Hired', appliedDate: '2026-08-05', match: 95 },
  { id: 'a7', name: 'Rohan Verma', email: 'rohan@example.com', jobId: 'j13', job: 'Node.js Developer', location: 'Bangalore', experience: 2, education: 'B.Tech CSE', skills: ['Node.js', 'Express', 'MongoDB', 'Redis'], status: 'Rejected', appliedDate: '2026-08-03', match: 81 },
  { id: 'a8', name: 'Meera Iyer', email: 'meera@example.com', jobId: 'j5', job: 'Full Stack Developer', location: 'Hyderabad', experience: 2, education: 'M.Sc CS', skills: ['React', 'Python', 'SQL', 'JavaScript'], status: 'Shortlisted', appliedDate: '2026-08-02', match: 84 },
];

export const mockApplications = [
  { id: 'ap1', jobId: 'j1', job: 'MERN Stack Developer', company: 'NovaTech Labs', match: 92, appliedDate: '2026-08-11', status: 'Shortlisted' },
  { id: 'ap2', jobId: 'j2', job: 'Frontend Developer', company: 'PixelCraft Studio', match: 88, appliedDate: '2026-08-09', status: 'Applied' },
  { id: 'ap3', jobId: 'j7', job: 'Software Engineer', company: 'NovaTech Labs', match: 84, appliedDate: '2026-08-07', status: 'Interview' },
  { id: 'ap4', jobId: 'j13', job: 'Node.js Developer', company: 'NovaTech Labs', match: 86, appliedDate: '2026-08-04', status: 'Applied' },
  { id: 'ap5', jobId: 'j12', job: 'Junior Web Developer', company: 'FinEdge Digital', match: 90, appliedDate: '2026-08-02', status: 'Hired' },
  { id: 'ap6', jobId: 'j10', job: 'UI/UX Developer', company: 'PixelCraft Studio', match: 76, appliedDate: '2026-07-29', status: 'Rejected' },
  { id: 'ap7', jobId: 'j4', job: 'Backend Developer', company: 'CloudNest Systems', match: 79, appliedDate: '2026-07-25', status: 'Applied' },
  { id: 'ap8', jobId: 'j5', job: 'Full Stack Developer', company: 'DataForge AI', match: 81, appliedDate: '2026-07-20', status: 'Shortlisted' },
  { id: 'ap9', jobId: 'j15', job: 'QA Automation Engineer', company: 'DataForge AI', match: 67, appliedDate: '2026-07-18', status: 'Applied' },
  { id: 'ap10', jobId: 'j6', job: 'React Developer Intern', company: 'PixelCraft Studio', match: 95, appliedDate: '2026-07-15', status: 'Interview' },
];

export const mockRecommendations = mockJobs
  .filter((job) => job.match)
  .sort((a, b) => b.match - a.match)
  .slice(0, 8);
