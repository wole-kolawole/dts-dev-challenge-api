export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
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
