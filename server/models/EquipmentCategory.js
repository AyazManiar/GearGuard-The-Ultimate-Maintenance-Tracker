import mongoose from 'mongoose';

const equipmentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment category name is required'],
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [255, 'Description cannot exceed 255 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup & reporting
equipmentCategorySchema.index({ name: 1 });

const EquipmentCategory = mongoose.model(
  'EquipmentCategory',
  equipmentCategorySchema
);

export default EquipmentCategory;
