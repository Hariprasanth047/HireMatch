import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyDescription: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Contract'],
      default: 'Full Time',
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Internship', 'Contract'],
      default: 'Full Time',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Hybrid',
    },
    salary: {
      type: String,
      required: [true, 'Salary is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      required: [true, 'At least one required skill is needed'],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    niceToHave: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    requiredExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    education: {
      type: String,
      default: '',
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft', 'ACTIVE', 'CLOSED', 'DRAFT'],
      default: 'Active',
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Synchronize legacy/alternative field names on save
jobSchema.pre('save', function (next) {
  if (this.jobType && !this.employmentType) this.employmentType = this.jobType;
  if (this.employmentType && !this.jobType) this.jobType = this.employmentType;
  if (this.skills && (!this.requiredSkills || this.requiredSkills.length === 0)) this.requiredSkills = this.skills;
  if (this.requiredSkills && (!this.skills || this.skills.length === 0)) this.skills = this.requiredSkills;
  if (this.niceToHave && (!this.preferredSkills || this.preferredSkills.length === 0)) this.preferredSkills = this.niceToHave;
  if (this.preferredSkills && (!this.niceToHave || this.niceToHave.length === 0)) this.niceToHave = this.preferredSkills;
  if (this.experience !== undefined && this.requiredExperience === undefined) this.requiredExperience = this.experience;
  if (this.requiredExperience !== undefined && this.experience === undefined) this.experience = this.requiredExperience;
  next();
});

// Indexes for high performance searches and filtering
jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });
jobSchema.index({ location: 1, workMode: 1, jobType: 1, status: 1 });
jobSchema.index({ recruiter: 1 });

export const Job = mongoose.model('Job', jobSchema);
