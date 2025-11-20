import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['monthly', 'yearly', 'one-time'], default: 'monthly' },
    features: [{ type: String }],
    popular: { type: Boolean, default: false, index: true },
    buttonText: { type: String, default: 'Get Started' },
    buttonLink: { type: String },
    order: { type: Number, default: 0, index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for common queries
pricingPlanSchema.index({ status: 1, order: 1 });
pricingPlanSchema.index({ featured: 1, status: 1 });

export const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);


