import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { calculateJobMatch } from '../services/matchingService.js';

/**
 * @desc    Get smart recommended jobs for logged-in job seeker
 * @route   GET /api/recommendations/jobs
 * @access  Private (Job Seeker only)
 */
export const getJobRecommendations = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    // Get jobs user has already applied for
    const existingApplications = await Application.find({ applicant: req.user._id }).select('job');
    const appliedJobIds = new Set(existingApplications.map((app) => app.job.toString()));

    // Find all active jobs
    const activeJobs = await Job.find({ status: { $in: ['Active', 'ACTIVE'] } }).lean();

    // Calculate match score for all active jobs
    const scoredJobs = activeJobs.map((job) => {
      const matchAnalysis = calculateJobMatch(req.user, job);
      const isApplied = appliedJobIds.has(job._id.toString());

      return {
        ...job,
        id: job._id.toString(),
        postedDate: job.createdAt ? job.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        match: matchAnalysis.overallScore,
        skillScore: matchAnalysis.skillScore,
        experienceScore: matchAnalysis.experienceScore,
        locationScore: matchAnalysis.locationScore,
        matchedSkills: matchAnalysis.matchedSkills,
        missingSkills: matchAnalysis.missingSkills,
        compatibilityLevel: matchAnalysis.compatibilityLevel,
        isApplied,
      };
    });

    // Sort by highest match score first, prioritize unapplied jobs
    scoredJobs.sort((a, b) => {
      if (a.isApplied !== b.isApplied) {
        return a.isApplied ? 1 : -1;
      }
      return b.match - a.match;
    });

    const recommendations = scoredJobs.slice(0, parseInt(limit, 10));

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};
