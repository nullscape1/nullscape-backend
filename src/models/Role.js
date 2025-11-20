import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ['SuperAdmin', 'Admin', 'Editor'], required: true, unique: true },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export const Role = mongoose.model('Role', roleSchema);



