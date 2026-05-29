import request from 'supertest';
import app from '../app';
import * as taskService from '../services/taskService';

jest.mock('../services/taskService');

const mockedTaskService = taskService as jest.Mocked<typeof taskService>;
const validObjectId = '507f1f77bcf86cd799439011';

describe('Task routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns API health on root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'DTS Task Manager API' });
  });

  it('creates a task', async () => {
    mockedTaskService.createTask.mockResolvedValue({
      _id: validObjectId,
      title: 'Test task',
      description: 'A sample description',
      status: 'pending',
      dueDate: new Date('2026-06-01T12:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const response = await request(app).post('/api/tasks').send({
      title: 'Test task',
      status: 'pending',
      dueDate: '2026-06-01T12:00:00.000Z',
    });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test task');
    expect(mockedTaskService.createTask).toHaveBeenCalled();
  });

  it('returns validation errors when creating a task with missing fields', async () => {
    const response = await request(app).post('/api/tasks').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
    expect(response.body.details).toBeInstanceOf(Array);
  });

  it('returns validation errors for invalid status on create', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Invalid task',
      status: 'done',
      dueDate: '2026-06-01T12:00:00.000Z',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('returns validation errors for invalid due date on create', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Bad date',
      status: 'pending',
      dueDate: 'not-a-date',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('handles service errors on create', async () => {
    mockedTaskService.createTask.mockRejectedValue(new Error('Database failure'));

    const response = await request(app).post('/api/tasks').send({
      title: 'Test task',
      status: 'pending',
      dueDate: '2026-06-01T12:00:00.000Z',
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Database failure');
  });

  it('fetches task list', async () => {
    mockedTaskService.getAllTasks.mockResolvedValue([
      {
        _id: validObjectId,
        title: 'List task',
        description: 'Test',
        status: 'pending',
        dueDate: new Date('2026-06-05T12:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);

    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('fetches a task by id', async () => {
    mockedTaskService.getTaskById.mockResolvedValue({
      _id: validObjectId,
      title: 'Single task',
      description: 'Test',
      status: 'pending',
      dueDate: new Date('2026-06-05T12:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const response = await request(app).get(`/api/tasks/${validObjectId}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(validObjectId);
  });

  it('returns 400 for invalid task id on get by id', async () => {
    const response = await request(app).get('/api/tasks/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('returns 404 for missing task by id', async () => {
    mockedTaskService.getTaskById.mockResolvedValue(null);
    const response = await request(app).get(`/api/tasks/${validObjectId}`);
    expect(response.status).toBe(404);
  });

  it('updates task status', async () => {
    mockedTaskService.updateTaskStatus.mockResolvedValue({
      _id: validObjectId,
      title: 'Update task',
      description: 'Test',
      status: 'completed',
      dueDate: new Date('2026-06-05T12:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const response = await request(app).patch(`/api/tasks/${validObjectId}/status`).send({ status: 'completed' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('completed');
  });

  it('returns 400 for invalid status update payload', async () => {
    const response = await request(app).patch(`/api/tasks/${validObjectId}/status`).send({ status: 'done' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('returns 400 for invalid id on status update', async () => {
    const response = await request(app).patch('/api/tasks/invalid-id/status').send({ status: 'pending' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('returns 404 when updating status for missing task', async () => {
    mockedTaskService.updateTaskStatus.mockResolvedValue(null);
    const response = await request(app).patch(`/api/tasks/${validObjectId}/status`).send({ status: 'pending' });
    expect(response.status).toBe(404);
  });

  it('deletes a task', async () => {
    mockedTaskService.deleteTask.mockResolvedValue(true);
    const response = await request(app).delete(`/api/tasks/${validObjectId}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('returns 400 for invalid id on delete', async () => {
    const response = await request(app).delete('/api/tasks/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('returns 404 when deleting a missing task', async () => {
    mockedTaskService.deleteTask.mockResolvedValue(false);
    const response = await request(app).delete(`/api/tasks/${validObjectId}`);
    expect(response.status).toBe(404);
  });
});
