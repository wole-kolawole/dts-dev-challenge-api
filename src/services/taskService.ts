import { execute, query } from '../db/connection';
import { CreateTaskPayload, Task, UpdateTaskStatusPayload } from '../models/task';

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  payload.description = payload.description ?? '';
  if (payload.dueDate.split(':').length === 2) {
    // Add on seconds
    payload.dueDate += ':00';
  }

  const records = await query<Task>(
    `INSERT INTO tasks (title, description, status, dueDate)
     OUTPUT INSERTED.*
     VALUES (@title, @description, @status, @dueDate)`,
    payload,
  );

  return records[0];
}

export async function getAllTasks(): Promise<Task[]> {
  return query<Task>('SELECT * FROM tasks ORDER BY dueDate ASC, id ASC');
}

export async function getTaskById(id: number): Promise<Task | null> {
  const records = await query<Task>('SELECT * FROM tasks WHERE id = @id', { id });
  return records[0] ?? null;
}

export async function updateTaskStatus(id: number, payload: UpdateTaskStatusPayload): Promise<Task | null> {
  const records = await query<Task>(
    `UPDATE tasks
     SET status = @status,
         updatedAt = GETDATE()
     OUTPUT INSERTED.*
     WHERE id = @id`,
    { id, status: payload.status },
  );
  return records[0] ?? null;
}

export async function deleteTask(id: number): Promise<boolean> {
  const result = await execute('DELETE FROM tasks WHERE id = @id', { id });
  return result.rowsAffected[0] > 0;
}
