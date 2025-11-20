import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // create, update, delete, upload
    entity: { type: String, required: true }, // Service, BlogPost, etc.
    entityId: { type: String },
    user: {
      id: { type: String },
      email: { type: String },
      roles: [{ type: String }]
    },
    ip: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);



