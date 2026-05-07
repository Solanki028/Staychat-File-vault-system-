import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model('File', fileSchema);
