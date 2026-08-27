import { z } from 'zod';

/** WorkItem type (spec madde 13). */
export const workItemTypes = [
  'screen',
  'feature',
  'task',
  'bug',
  'integration',
  'report',
  'other',
] as const;
export type WorkItemType = (typeof workItemTypes)[number];

/** WorkItem status (spec madde 14). */
export const workItemStatuses = [
  'backlog',
  'planned',
  'in_progress',
  'testing',
  'waiting_approval',
  'completed',
  'cancelled',
] as const;
export type WorkItemStatus = (typeof workItemStatuses)[number];

export const workItemStatusLabelsTr: Record<WorkItemStatus, string> = {
  backlog: 'Backlog',
  planned: 'Planlandi',
  in_progress: 'Devam Ediyor',
  testing: 'Testte',
  waiting_approval: 'Onay Bekliyor',
  completed: 'Tamamlandi',
  cancelled: 'Iptal',
};

/** Priority (spec madde 15). */
export const priorities = ['low', 'medium', 'high', 'critical'] as const;
export type Priority = (typeof priorities)[number];

/** WorkItem — the core entity (spec madde 12). */
export interface WorkItem {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: Priority;
  progress: number; // 0-100
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih YYYY-MM-DD formatinda olmalidir')
  .nullish()
  .transform((v) => v ?? null);

export const workItemInputSchema = z.object({
  projectId: z.string().min(1, 'projectId zorunludur'),
  title: z.string().trim().min(1, 'Baslik zorunludur').max(300),
  description: z.string().trim().max(4000).nullish().transform((v) => v ?? null),
  type: z.enum(workItemTypes).default('task'),
  status: z.enum(workItemStatuses).default('backlog'),
  priority: z.enum(priorities).default('medium'),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  startDate: isoDate,
  dueDate: isoDate,
});

export type WorkItemInput = z.infer<typeof workItemInputSchema>;

export const workItemStatusUpdateSchema = z.object({
  status: z.enum(workItemStatuses),
});
export type WorkItemStatusUpdate = z.infer<typeof workItemStatusUpdateSchema>;

// List filters (spec madde 37).
export const workItemFilterSchema = z.object({
  projectId: z.string().optional(),
  status: z.enum(workItemStatuses).optional(),
  type: z.enum(workItemTypes).optional(),
  priority: z.enum(priorities).optional(),
  search: z.string().trim().optional(),
});
export type WorkItemFilter = z.infer<typeof workItemFilterSchema>;
