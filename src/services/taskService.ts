import { CreateTaskPayload, Task, UpdateTaskStatusPayload, TaskModel } from '../models/task';

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  payload.description = payload.description ?? '';

  const task = new TaskModel({
    title: payload.title,
    description: payload.description,
    status: payload.status,
    dueDate: new Date(payload.dueDate),
  });

  return task.save();
}

export async function getAllTasks(): Promise<Task[]> {
  return TaskModel.find().sort({ dueDate: 1, _id: 1 });
}

export async function getTaskById(id: string): Promise<Task | null> {
  return TaskModel.findById(id);
}

export async function updateTaskStatus(id: string, payload: UpdateTaskStatusPayload): Promise<Task | null> {
  return TaskModel.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true }
  );
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await TaskModel.deleteOne({ _id: id });
  return result.deletedCount > 0;
}
