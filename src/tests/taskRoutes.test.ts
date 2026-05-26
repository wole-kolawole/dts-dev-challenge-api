import request from 'supertest';
import app from '../app';
import * as taskService from '../services/taskService';

jest.mock('../services/taskService');

const mockedTaskService = taskService as jest.Mocked<typeof taskService>;

describe('Task routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a task', async () => {
    mockedTaskService.createTask.mockResolvedValue({
      id: 1,
      title: 'Test task',
      description: 'A sample description',
      status: 'pending',
      dueDate: '2026-06-01T12:00:00.000Z',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

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

  it('fetches task list', async () => {
    mockedTaskService.getAllTasks.mockResolvedValue([
      {
        id: 1,
        title: 'List task',
        description: 'Test',
        status: 'pending',
        dueDate: '2026-06-05T12:00:00.000Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('returns 404 for missing task', async () => {
    mockedTaskService.getTaskById.mockResolvedValue(null);
    const response = await request(app).get('/api/tasks/999');
    expect(response.status).toBe(404);
  });
});
