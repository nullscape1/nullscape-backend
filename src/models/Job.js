import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    requiredSkills: [{ type: String }],
    responsibilities: [{ type: String }],
    location: { type: String },
    experience: { type: String },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);



