import mongoose, { Document, Schema } from 'mongoose';

interface Tag extends Document {
  title: string;
}

const TagSchema = new Schema(
  {
    title: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Tag>('Tag', TagSchema);
