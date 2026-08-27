import { Router } from 'express';
import { factoryController } from '../controllers/factory.controller';
import { projectController } from '../controllers/project.controller';
import { asyncHandler } from '../middleware/asyncHandler';

export const factoryRoutes = Router();

factoryRoutes.get('/', asyncHandler(factoryController.list));
factoryRoutes.get('/:id', asyncHandler(factoryController.get));
factoryRoutes.post('/', asyncHandler(factoryController.create));
factoryRoutes.put('/:id', asyncHandler(factoryController.update));
factoryRoutes.delete('/:id', asyncHandler(factoryController.remove));

// Factory-scoped projects (spec madde 36).
factoryRoutes.get('/:factoryId/projects', asyncHandler(async (req, res) => {
  req.query.factoryId = req.params.factoryId;
  await projectController.list(req, res);
}));
