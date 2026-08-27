import { Router } from 'express';
import { factoryRoutes } from './factory.routes';
import { projectRoutes } from './project.routes';
import { workItemRoutes } from './workItem.routes';
import { activityService } from '../services/activity.service';
import { paginationQuerySchema } from '@fms/shared';
import { parseOrThrow } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { ok } from '../utils/response';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => ok(res, { status: 'ok' }));

apiRouter.use('/factories', factoryRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/work-items', workItemRoutes);

apiRouter.get(
  '/activities',
  asyncHandler(async (req, res) => {
    const { page, pageSize } = parseOrThrow(paginationQuerySchema, req.query);
    ok(res, activityService.list({}, page, pageSize));
  }),
);
