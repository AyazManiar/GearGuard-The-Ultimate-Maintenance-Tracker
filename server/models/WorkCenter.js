import mongoose from 'mongoose';

const workCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Work center name is required'],
      trim: true,
      minlength: [2, 'Work center name must be at least 2 characters'],
      maxlength: [100, 'Work center name cannot exceed 100 characters'],
    },

    code: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [255, 'Description cannot exceed 255 characters'],
    },

    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: 1,
    },

    cost_per_hour: {
      type: Number,
      min: [0, 'Cost per hour cannot be negative'],
    },

    efficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    oee_target: {
      type: Number,
      min: 0,
      max: 100,
    },

    alternative_work_centers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkCenter',
      },
    ],

    company: {
      type: String,
      required: true,
      default: 'Default Company',
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search & planning
workCenterSchema.index({ name: 1 });
workCenterSchema.index({ code: 1 });

const WorkCenter = mongoose.model('WorkCenter', workCenterSchema);

export default WorkCenter;
