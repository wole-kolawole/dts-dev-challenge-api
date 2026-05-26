import { Router } from 'express';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTaskStatus } from '../controllers/taskController';
import { createTaskValidator, idParamValidator, updateStatusValidator } from '../validators/taskValidators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/', createTaskValidator, validateRequest, createTask);
router.get('/', getAllTasks);
router.get('/:id', idParamValidator, validateRequest, getTaskById);
router.patch('/:id/status', updateStatusValidator, validateRequest, updateTaskStatus);
router.delete('/:id', idParamValidator, validateRequest, deleteTask);

export default router;
