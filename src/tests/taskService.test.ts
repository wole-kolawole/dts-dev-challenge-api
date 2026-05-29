import * as taskService from '../services/taskService';
import { TaskModel } from '../models/task';

jest.mock('../models/task');

const mockedTaskModel = TaskModel as jest.Mocked<typeof TaskModel>;

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults description when creating a task', async () => {
    const mockTask = {
      _id: '507f1f77bcf86cd799439011',
      title: 'New task',
      description: '',
      status: 'pending' as const,
      dueDate: new Date('2026-06-01T12:00:00'),
      createdAt: new Date('2026-05-26T12:00:00.000Z'),
      updatedAt: new Date('2026-05-26T12:00:00.000Z'),
      save: jest.fn().mockResolvedValue({}),
    };

    const payload = {
      title: 'New task',
      status: 'pending' as const,
      dueDate: '2026-06-01T12:00',
    };

    // Mock the constructor
    (TaskModel as any).mockImplementation(() => mockTask);
    mockTask.save.mockResolvedValue(mockTask);

    const task = await taskService.createTask(payload);

    expect(task).toEqual(expect.objectContaining({ title: 'New task', status: 'pending' }));
  });

  it('returns null when no task exists for getTaskById', async () => {
    (mockedTaskModel.findById as jest.Mock).mockResolvedValue(null);

    const task = await taskService.getTaskById('507f1f77bcf86cd799439011');

    expect(task).toBeNull();
  });

  it('returns the updated task when updateTaskStatus succeeds', async () => {
    const mockTask = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Test task',
      status: 'completed',
      updatedAt: new Date(),
    };

    (mockedTaskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTask);

    const task = await taskService.updateTaskStatus('507f1f77bcf86cd799439011', { status: 'completed' });

    expect(task).toEqual(expect.objectContaining({ status: 'completed' }));
  });

  it('returns null when updateTaskStatus does not find a task', async () => {
    (mockedTaskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const task = await taskService.updateTaskStatus('999', { status: 'completed' });

    expect(task).toBeNull();
  });

  it('returns false when deleteTask does not remove a document', async () => {
    (mockedTaskModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

    const deleted = await taskService.deleteTask('999');

    expect(deleted).toBe(false);
  });

  it('returns true when deleteTask removes a document', async () => {
    (mockedTaskModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const deleted = await taskService.deleteTask('507f1f77bcf86cd799439011');

    expect(deleted).toBe(true);
  });
});
});
