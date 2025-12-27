import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
      minlength: [2, 'Equipment name must be at least 2 characters'],
      maxlength: [100, 'Equipment name cannot exceed 100 characters'],
    },
    serial_number: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EquipmentCategory',
      required: [true, 'Equipment category is required'],
    },

    // When bought and will expire
    purchase_date: { type: Date },
    warranty_expiry: { type: Date },

    // Belongs to
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },

    // Maintanece and Technician
    maintenance_team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
      required: [true, 'Maintenance team is required'],
    },
    default_technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Work Center and Compant
    work_center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkCenter',
    },
    company: {
      type: String,
      required: true,
      default: 'Default Company',
    },

    // Scrapped or not?
    is_scrapped: {
      type: Boolean,
      default: false,
    },
    scrap_date: {
      type: Date,
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

// Indexes for performance & filtering
equipmentSchema.index({ serial_number: 1 });
equipmentSchema.index({ name: 1 });
equipmentSchema.index({ maintenance_team: 1 }); // For: Show all equipment handled by Team A
equipmentSchema.index({ department: 1 });   // For quick search by department

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;
