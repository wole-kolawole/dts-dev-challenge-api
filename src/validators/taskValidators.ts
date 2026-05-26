import { body, param } from 'express-validator';
import { TaskStatus } from '../models/task';

const taskStatuses: TaskStatus[] = ['pending', 'in-progress', 'completed'];

export const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(taskStatuses)
    .withMessage(`Status must be one of: ${taskStatuses.join(', ')}`),
  body('dueDate').trim().notEmpty().withMessage('Due date is required').isISO8601().withMessage('Due date must be a date'),
];

export const updateStatusValidator = [
  param('id').isInt({ min: 1 }).withMessage('Task id must be a number greater than 0'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(taskStatuses)
    .withMessage(`Status must be one of: ${taskStatuses.join(', ')}`),
];

export const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('Task id must be a number greater than 0'),
];
