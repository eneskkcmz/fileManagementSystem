import type { Request, Response } from 'express';
import { paginationQuerySchema, projectInputSchema } from '@fms/shared';
import { projectService } from '../services/project.service';
import { activityService } from '../services/activity.service';
import { parseOrThrow } from '../middleware/validate';
import { created, ok } from '../utils/response';

export const projectController = {
  async list(req: Request, res: Response): Promise<void> {
    const { page, pageSize } = parseOrThrow(paginationQuerySchema, req.query);
    const factoryId = typeof req.query.factoryId === 'string' ? req.query.factoryId : undefined;
    ok(res, projectService.list({ factoryId }, page, pageSize));
  },

  async get(req: Request, res: Response): Promise<void> {
    ok(res, projectService.getWithStats(req.params.id));
  },

  async create(req: Request, res: Response): Promise<void> {
    const input = parseOrThrow(projectInputSchema, req.body);
    created(res, projectService.create(input));
  },

  async update(req: Request, res: Response): Promise<void> {
    const input = parseOrThrow(projectInputSchema, req.body);
    ok(res, projectService.update(req.params.id, input));
  },

  async remove(req: Request, res: Response): Promise<void> {
    projectService.remove(req.params.id);
    ok(res, { id: req.params.id }, 200, 'Proje silindi');
  },

  async activities(req: Request, res: Response): Promise<void> {
    const { page, pageSize } = parseOrThrow(paginationQuerySchema, req.query);
    ok(res, activityService.list({ projectId: req.params.id }, page, pageSize));
  },
};
