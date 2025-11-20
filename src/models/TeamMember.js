import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    role: { type: String, required: true },
    image: { type: String },
    social: {
      linkedin: { type: String },
      twitter: { type: String },
      github: { type: String },
      website: { type: String }
    },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// Compound indexes for common queries
teamMemberSchema.index({ status: 1, order: 1 });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);



