import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'reviewed', 'rejected', 'accepted'], default: 'pending' }
  },
  { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);



