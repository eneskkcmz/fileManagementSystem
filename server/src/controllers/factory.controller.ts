import type { Request, Response } from 'express';
import { factoryInputSchema, paginationQuerySchema } from '@fms/shared';
import { factoryService } from '../services/factory.service';
import { parseOrThrow } from '../middleware/validate';
import { created, ok } from '../utils/response';

export const factoryController = {
  async list(req: Request, res: Response): Promise<void> {
    const { page, pageSize } = parseOrThrow(paginationQuerySchema, req.query);
    ok(res, factoryService.list(page, pageSize));
  },

  async get(req: Request, res: Response): Promise<void> {
    ok(res, factoryService.getByIdOrThrow(req.params.id));
  },

  async create(req: Request, res: Response): Promise<void> {
    const input = parseOrThrow(factoryInputSchema, req.body);
    created(res, factoryService.create(input));
  },

  async update(req: Request, res: Response): Promise<void> {
    const input = parseOrThrow(factoryInputSchema, req.body);
    ok(res, factoryService.update(req.params.id, input));
  },

  async remove(req: Request, res: Response): Promise<void> {
    factoryService.remove(req.params.id);
    ok(res, { id: req.params.id }, 200, 'Fabrika silindi');
  },
};
