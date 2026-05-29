import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}

const taskSchema = new Schema<Task>(
  {
    title: { type: String, required: true, maxlength: 250 },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      required: true,
    },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = mongoose.model<Task>('Task', taskSchema);
