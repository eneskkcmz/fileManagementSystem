import type { Request, Response } from 'express';
import {
  paginationQuerySchema,
  workItemFilterSchema,
  workItemInputSchema,
  workItemStatusUpdateSchema,
} from '@fms/shared';
import { workItemService } from '../services/workItem.service';
import { parseOrThrow } from '../middleware/validate';
import { created, ok } from '../utils/response';

export const workItemController = {
  async list(req: Request, res: Response): Promise<void> {
    const { page, pageSize } = parseOrThrow(paginationQuerySchema, req.query);
    const filters = parseOrThrow(workItemFilterSchema, req.query);
    ok(res, workItemService.list(filters, page, pageSize));
  },

  async get(req: Request, res: Response): Promise<void> {
    ok(res, workItemService.getByIdOrThrow(req.params.id));
  },

  async create(req: Request, res: Response): Promise<void> {
    const input = parseOrThrow(workItemInputSchema, req.body);
    created(res, workItemService.create(input));
  },

  async update(req: Request, res: Response): Promise<void> {
    const input = parseOrThrow(workItemInputSchema, req.body);
    ok(res, workItemService.update(req.params.id, input));
  },

  async changeStatus(req: Request, res: Response): Promise<void> {
    const { status } = parseOrThrow(workItemStatusUpdateSchema, req.body);
    ok(res, workItemService.changeStatus(req.params.id, status));
  },

  async remove(req: Request, res: Response): Promise<void> {
    workItemService.remove(req.params.id);
    ok(res, { id: req.params.id }, 200, 'Is kalemi silindi');
  },
};
