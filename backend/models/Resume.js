import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    extractedText: {
      type: String,
      default: '',
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    extractedExperience: {
      type: [String],
      default: [],
    },
    extractedEducation: {
      type: [String],
      default: [],
    },
    extractedKeywords: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestedSkills: {
      type: [String],
      default: [],
    },
    analysisScore: {
      type: Number,
      default: 75,
    },
    status: {
      type: String,
      default: 'Analysis Complete',
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ user: 1 });

export const Resume = mongoose.model('Resume', resumeSchema);
