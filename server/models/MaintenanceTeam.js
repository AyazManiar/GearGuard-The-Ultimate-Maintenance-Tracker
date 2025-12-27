import mongoose from 'mongoose';

const maintenanceTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Maintenance team name is required'],
      trim: true,
      minlength: [2, 'Team name must be at least 2 characters'],
      maxlength: [50, 'Team name cannot exceed 50 characters'],
      unique: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    description: {
      type: String,
      trim: true,
      maxlength: [255, 'Description cannot exceed 255 characters'],
    },

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

// Indexes
maintenanceTeamSchema.index({ name: 1 });
maintenanceTeamSchema.index({ members: 1 });

const MaintenanceTeam = mongoose.model(
  'MaintenanceTeam',
  maintenanceTeamSchema
);

export default MaintenanceTeam;
