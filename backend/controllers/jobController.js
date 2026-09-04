import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { calculateJobMatch } from '../services/matchingService.js';

/**
 * @desc    Get all active jobs with search, filtering, sorting and pagination
 * @route   GET /api/jobs
 * @access  Public (Enhanced if authenticated)
 */
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      skill,
      location,
      jobType,
      workMode,
      experience,
      salary,
      sort = 'recent',
      page = 1,
      limit = 10,
      status = 'Active',
    } = req.query;

    const query = {};

    // Filter by status (Default Active unless recruiter wants all)
    if (status && status !== 'all') {
      query.status = new RegExp(`^${status}$`, 'i');
    }

    // Search keyword
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Specific skill filter
    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job Type filter
    if (jobType) {
      query.$or = [
        { jobType: { $regex: jobType, $options: 'i' } },
        { employmentType: { $regex: jobType, $options: 'i' } },
      ];
    }

    // Work Mode filter
    if (workMode) {
      query.workMode = { $regex: workMode, $options: 'i' };
    }

    // Experience filter (jobs requiring up to this experience or minimum)
    if (experience !== undefined && experience !== '') {
      const expNum = Number(experience);
      if (!isNaN(expNum)) {
        query.$or = [
          { experience: { $gte: expNum } },
          { requiredExperience: { $gte: expNum } },
        ];
      }
    }

    // Salary filter
    if (salary) {
      query.salary = { $regex: salary, $options: 'i' };
    }

    // Sorting definition
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'salary') {
      sortOption = { salary: -1 };
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const totalJobs = await Job.countDocuments(query);
    let jobs = await Job.find(query)
      .populate('recruiter', 'name email company')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Map jobs to ensure consistent frontend property shape and smart match score
    const transformedJobs = jobs.map((job) => {
      let matchMetrics = { overallScore: 75 };
      if (req.user && req.user.role === 'JOB_SEEKER') {
        matchMetrics = calculateJobMatch(req.user, job);
      }

      return {
        ...job,
        id: job._id.toString(),
        postedDate: job.createdAt ? job.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        match: matchMetrics.overallScore,
        matchAnalysis: req.user && req.user.role === 'JOB_SEEKER' ? matchMetrics : undefined,
        applications: job.applicationsCount || 0,
      };
    });

    // If sorting by match requested
    if (sort === 'match') {
      transformedJobs.sort((a, b) => (b.match || 0) - (a.match || 0));
    }

    res.json({
      success: true,
      count: transformedJobs.length,
      total: totalJobs,
      totalPages: Math.ceil(totalJobs / pageSize) || 1,
      currentPage: pageNumber,
      jobs: transformedJobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public (Enhanced if authenticated)
 */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const jobObj = job.toObject();
    jobObj.id = jobObj._id.toString();
    jobObj.postedDate = jobObj.createdAt ? jobObj.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    jobObj.applications = jobObj.applicationsCount || 0;

    let matchMetrics = null;
    let hasApplied = false;

    if (req.user && req.user.role === 'JOB_SEEKER') {
      matchMetrics = calculateJobMatch(req.user, jobObj);
      jobObj.match = matchMetrics.overallScore;
      jobObj.matchAnalysis = matchMetrics;

      const existingApp = await Application.findOne({ applicant: req.user._id, job: job._id });
      hasApplied = Boolean(existingApp);
    }

    res.json({
      success: true,
      job: jobObj,
      matchAnalysis: matchMetrics,
      hasApplied,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Private (Recruiter only)
 */
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      companyDescription,
      location,
      employmentType,
      jobType,
      workMode,
      salary,
      description,
      responsibilities,
      requirements,
      skills,
      requiredSkills,
      niceToHave,
      preferredSkills,
      experience,
      requiredExperience,
      education,
      status,
      applicationDeadline,
    } = req.body;

    const rawSkills = skills || requiredSkills || [];
    const normalizedSkills = Array.isArray(rawSkills)
      ? rawSkills
      : String(rawSkills).split(',').map((s) => s.trim()).filter(Boolean);

    const rawNice = niceToHave || preferredSkills || [];
    const normalizedNice = Array.isArray(rawNice)
      ? rawNice
      : String(rawNice).split(',').map((s) => s.trim()).filter(Boolean);

    const job = await Job.create({
      title,
      company: company || req.user.company || 'NovaTech Labs',
      companyDescription: companyDescription || '',
      location,
      employmentType: employmentType || jobType || 'Full Time',
      jobType: jobType || employmentType || 'Full Time',
      workMode: workMode || 'Hybrid',
      salary,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : String(responsibilities || '').split('\n').filter(Boolean),
      requirements: Array.isArray(requirements) ? requirements : String(requirements || '').split('\n').filter(Boolean),
      skills: normalizedSkills,
      requiredSkills: normalizedSkills,
      niceToHave: normalizedNice,
      preferredSkills: normalizedNice,
      experience: Number(experience !== undefined ? experience : requiredExperience) || 0,
      requiredExperience: Number(requiredExperience !== undefined ? requiredExperience : experience) || 0,
      education: education || '',
      status: status || 'Active',
      applicationDeadline: applicationDeadline || null,
      recruiter: req.user._id,
    });

    const jobObj = job.toObject();
    jobObj.id = jobObj._id.toString();

    res.status(201).json({
      success: true,
      job: jobObj,
      message: 'Job created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing job
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiter only - own job)
 */
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this job posting',
      });
    }

    const updates = { ...req.body };
    if (updates.skills && !Array.isArray(updates.skills)) {
      updates.skills = String(updates.skills).split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (updates.responsibilities && !Array.isArray(updates.responsibilities)) {
      updates.responsibilities = String(updates.responsibilities).split('\n').filter(Boolean);
    }
    if (updates.requirements && !Array.isArray(updates.requirements)) {
      updates.requirements = String(updates.requirements).split('\n').filter(Boolean);
    }

    Object.assign(job, updates);
    const updatedJob = await job.save();

    const jobObj = updatedJob.toObject();
    jobObj.id = jobObj._id.toString();

    res.json({
      success: true,
      job: jobObj,
      message: 'Job updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter only - own job)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job posting',
      });
    }

    // Delete associated applications
    await Application.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(job._id);

    res.json({
      success: true,
      message: 'Job and associated applications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs posted by current recruiter
 * @route   GET /api/jobs/recruiter/my-jobs
 * @access  Private (Recruiter only)
 */
export const getMyPostedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 }).lean();

    const formatted = jobs.map((job) => ({
      ...job,
      id: job._id.toString(),
      createdDate: job.createdAt ? job.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      applications: job.applicationsCount || 0,
    }));

    res.json({
      success: true,
      count: formatted.length,
      jobs: formatted,
    });
  } catch (error) {
    next(error);
  }
};
