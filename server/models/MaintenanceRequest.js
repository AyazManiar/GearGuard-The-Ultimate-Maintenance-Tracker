import mongoose from 'mongoose';

const maintenanceRequestSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Request subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
      maxlength: [255, 'Subject cannot exceed 255 characters'],
    },

    request_type: {
      type: String,
      enum: ['corrective', 'preventive'],
      required: true,
    },

    // Equipment OR Work Center (one must exist)
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
    },

    work_center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkCenter',
    },

    maintenance_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
      required: true,
    },

    assigned_technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    status: {
      type: String,
      enum: ['new', 'in_progress', 'repaired', 'scrap'],
      default: 'new',
    },

    scheduled_date: {
      type: Date,
    },

    duration_hours: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    completed_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for workflow & UI
maintenanceRequestSchema.index({ status: 1 });
maintenanceRequestSchema.index({ maintenance_team: 1 });
maintenanceRequestSchema.index({ assigned_technician: 1 });
maintenanceRequestSchema.index({ scheduled_date: 1 });
maintenanceRequestSchema.index({ equipment: 1 });
maintenanceRequestSchema.index({ work_center: 1 });

// Validation: either equipment or work_center must exist
maintenanceRequestSchema.pre('validate', function (next) {
  if (!this.equipment && !this.work_center) {
    return next(
      new Error('Maintenance request must be linked to equipment or work center')
    );
  }
  next();
});

const MaintenanceRequest = mongoose.model(
  'MaintenanceRequest',
  maintenanceRequestSchema
);

export default MaintenanceRequest;
