import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { asyncHandler } from '../middleware/asyncHandler';

export const projectRoutes = Router();

projectRoutes.get('/', asyncHandler(projectController.list));
projectRoutes.get('/:id', asyncHandler(projectController.get));
projectRoutes.get('/:id/activities', asyncHandler(projectController.activities));
projectRoutes.post('/', asyncHandler(projectController.create));
projectRoutes.put('/:id', asyncHandler(projectController.update));
projectRoutes.delete('/:id', asyncHandler(projectController.remove));
