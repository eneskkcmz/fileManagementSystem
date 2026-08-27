import { Router } from 'express';
import { workItemController } from '../controllers/workItem.controller';
import { asyncHandler } from '../middleware/asyncHandler';

export const workItemRoutes = Router();

workItemRoutes.get('/', asyncHandler(workItemController.list));
workItemRoutes.get('/:id', asyncHandler(workItemController.get));
workItemRoutes.post('/', asyncHandler(workItemController.create));
workItemRoutes.put('/:id', asyncHandler(workItemController.update));
workItemRoutes.patch('/:id/status', asyncHandler(workItemController.changeStatus));
workItemRoutes.delete('/:id', asyncHandler(workItemController.remove));
