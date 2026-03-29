import mongoose from 'mongoose';

const globalSettingV2Schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    label: { type: String, trim: true, default: '' },
    value: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const GlobalSettingV2 = mongoose.model('GlobalSettingV2', globalSettingV2Schema);
