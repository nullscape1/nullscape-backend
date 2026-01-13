import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String }, // URL or image path
    subtitle: { type: String }, // Optional subtitle like "Enterprise", "Kotak Mahindra Bank", etc.
    logoColor: { type: String, default: '#005CFF' }, // Color for text-based logos
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    website: { type: String }, // Optional website URL
  },
  { timestamps: true }
);

// Compound indexes
partnerSchema.index({ status: 1, order: 1 });
partnerSchema.index({ status: 1, createdAt: -1 });

export const Partner = mongoose.model('Partner', partnerSchema);



