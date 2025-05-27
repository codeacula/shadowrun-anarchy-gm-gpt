import { Document, Schema, model } from "mongoose";

export interface IMemory extends Document {
  category: string;
  data: any;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
  {
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for efficient category + id lookups
memorySchema.index({ category: 1, _id: 1 });

// Index for listing memories by category and creation date
memorySchema.index({ category: 1, createdAt: -1 });

export const Memory = model<IMemory>("Memory", memorySchema);
