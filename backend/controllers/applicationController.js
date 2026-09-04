import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { Resume } from '../models/Resume.js';
import { User } from '../models/User.js';
import { calculateJobMatch } from '../services/matchingService.js';

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private (Job Seeker only)
 */
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resumeId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      applicant: req.user._id,
      job: job._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position',
      });
    }

    // Get applicant's latest resume if not provided
    let resume = null;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    }

    // Calculate smart match score between candidate and job
    const matchAnalysis = calculateJobMatch(req.user, job);

    const application = await Application.create({
      applicant: req.user._id,
      job: job._id,
      resume: resume ? resume._id : null,
      resumeUrl: resume ? `/api/resumes/download/${resume._id}` : '',
      coverLetter: coverLetter || '',
      status: 'Applied',
      matchScore: matchAnalysis.overallScore,
      skillScore: matchAnalysis.skillScore,
      experienceScore: matchAnalysis.experienceScore,
      locationScore: matchAnalysis.locationScore,
      matchedSkills: matchAnalysis.matchedSkills,
      missingSkills: matchAnalysis.missingSkills,
      compatibilityLevel: matchAnalysis.compatibilityLevel,
    });

    // Increment job applications count
    await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });

    res.status(201).json({
      success: true,
      application: {
        ...application.toObject(),
        id: application._id.toString(),
        job: job.title,
        company: job.company,
        appliedDate: application.createdAt.toISOString().slice(0, 10),
        match: application.matchScore,
      },
      message: 'Application submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current job seeker's applications
 * @route   GET /api/applications/my-applications
 * @access  Private (Job Seeker only)
 */
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job')
      .populate('resume')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = applications.map((app) => ({
      id: app._id.toString(),
      _id: app._id,
      jobId: app.job?._id?.toString() || '',
      job: app.job?.title || 'Job Position',
      company: app.job?.company || 'Company',
      location: app.job?.location || '',
      match: app.matchScore || 75,
      skillScore: app.skillScore,
      experienceScore: app.experienceScore,
      locationScore: app.locationScore,
      matchedSkills: app.matchedSkills,
      missingSkills: app.missingSkills,
      compatibilityLevel: app.compatibilityLevel,
      status: app.status,
      appliedDate: app.createdAt ? app.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      jobDetails: app.job ? { ...app.job, id: app.job._id.toString() } : null,
      resume: app.resume,
    }));

    res.json({
      success: true,
      count: formatted.length,
      applications: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single application details
 * @route   GET /api/applications/:id
 * @access  Private (Applicant or Job Recruiter)
 */
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email phone location skills experience education bio links')
      .populate('resume');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const appObj = application.toObject();
    const formatted = {
      ...appObj,
      id: appObj._id.toString(),
      jobId: appObj.job?._id?.toString(),
      job: appObj.job?.title || 'Job Position',
      company: appObj.job?.company || 'Company',
      match: appObj.matchScore,
      appliedDate: appObj.createdAt ? appObj.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    };

    res.json({
      success: true,
      application: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all candidates for a specific job (Recruiter view)
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter only)
 */
export const getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const { sort = 'Match Score' } = req.query;

    const applications = await Application.find({ job: job._id })
      .populate('applicant', 'name email phone location skills experience education bio')
      .populate('resume')
      .lean();

    let formatted = applications.map((app) => ({
      id: app._id.toString(),
      applicationId: app._id.toString(),
      candidateId: app.applicant?._id?.toString(),
      name: app.applicant?.name || 'Applicant',
      email: app.applicant?.email || '',
      phone: app.applicant?.phone || '',
      location: app.applicant?.location || 'Remote',
      experience: app.applicant?.experience || 0,
      education: app.applicant?.education || 'Not specified',
      skills: app.applicant?.skills || [],
      jobId: job._id.toString(),
      job: job.title,
      company: job.company,
      match: app.matchScore,
      skillScore: app.skillScore,
      experienceScore: app.experienceScore,
      locationScore: app.locationScore,
      matchedSkills: app.matchedSkills,
      missingSkills: app.missingSkills,
      compatibilityLevel: app.compatibilityLevel,
      status: app.status,
      appliedDate: app.createdAt ? app.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      resumeUrl: app.resumeUrl,
    }));

    // Sorting
    if (sort === 'Experience') {
      formatted.sort((a, b) => b.experience - a.experience);
    } else if (sort === 'Application Date') {
      formatted.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    } else {
      // Default: Match Score descending
      formatted.sort((a, b) => b.match - a.match);
    }

    res.json({
      success: true,
      count: formatted.length,
      job: {
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        skills: job.skills,
        experience: job.experience,
      },
      applicants: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applicants across all recruiter jobs
 * @route   GET /api/applications/recruiter/all
 * @access  Private (Recruiter only)
 */
export const getAllRecruiterApplicants = async (req, res, next) => {
  try {
    const myJobs = await Job.find({ recruiter: req.user._id }).select('_id');
    const jobIds = myJobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email phone location skills experience education bio')
      .populate('job', 'title company location skills experience')
      .populate('resume')
      .sort({ createdAt: -1 })
      .lean();

    const formatted = applications.map((app) => ({
      id: app._id.toString(),
      applicationId: app._id.toString(),
      candidateId: app.applicant?._id?.toString(),
      name: app.applicant?.name || 'Applicant',
      email: app.applicant?.email || '',
      phone: app.applicant?.phone || '',
      location: app.applicant?.location || 'Remote',
      experience: app.applicant?.experience || 0,
      education: app.applicant?.education || 'Not specified',
      skills: app.applicant?.skills || [],
      jobId: app.job?._id?.toString(),
      job: app.job?.title || 'Job Position',
      company: app.job?.company || 'Company',
      match: app.matchScore,
      skillScore: app.skillScore,
      experienceScore: app.experienceScore,
      locationScore: app.locationScore,
      matchedSkills: app.matchedSkills,
      missingSkills: app.missingSkills,
      compatibilityLevel: app.compatibilityLevel,
      status: app.status,
      appliedDate: app.createdAt ? app.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      resumeUrl: app.resumeUrl,
    }));

    res.json({
      success: true,
      count: formatted.length,
      applicants: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status (Recruiter only)
 * @route   PUT /api/applications/:id/status
 * @access  Private (Recruiter only)
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      'Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Hired', 'Rejected',
      'APPLIED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application status provided',
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      application: {
        ...application.toObject(),
        id: application._id.toString(),
      },
      message: `Application status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};
