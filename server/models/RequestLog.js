// models/RequestLog.js
import mongoose from 'mongoose';

const requestLogSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRequest',
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        'created',
        'assigned',
        'status_changed',
        'duration_logged',
        'scrapped',
      ],
    },

    previous_value: mongoose.Schema.Types.Mixed,
    new_value: mongoose.Schema.Types.Mixed,

    performed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

requestLogSchema.index({ request: 1 });

export default mongoose.model('RequestLog', requestLogSchema);
