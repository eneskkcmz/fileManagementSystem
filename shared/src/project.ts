import { z } from 'zod';

/** Project status — DB values English, UI shows Turkish (spec madde 11). */
export const projectStatuses = [
  'planning',
  'active',
  'on_hold',
  'completed',
  'cancelled',
] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabelsTr: Record<ProjectStatus, string> = {
  planning: 'Planlama',
  active: 'Aktif',
  on_hold: 'Beklemede',
  completed: 'Tamamlandi',
  cancelled: 'Iptal',
};

/** Project — belongs to a factory (spec madde 10). */
export interface Project {
  id: string;
  factoryId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  targetEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tarih YYYY-MM-DD formatinda olmalidir')
  .nullish()
  .transform((v) => v ?? null);

export const projectInputSchema = z.object({
  factoryId: z.string().min(1, 'factoryId zorunludur'),
  name: z.string().trim().min(1, 'Proje adi zorunludur').max(200),
  description: z.string().trim().max(2000).nullish().transform((v) => v ?? null),
  status: z.enum(projectStatuses).default('planning'),
  startDate: isoDate,
  targetEndDate: isoDate,
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

/** Project with computed dashboard rollups (spec madde 28-29). */
export interface ProjectWithStats extends Project {
  factoryName: string | null;
  stats: ProjectStats;
}

export interface ProjectStats {
  totalWorkItems: number;
  completed: number;
  inProgress: number;
  testing: number;
  waitingApproval: number;
  overdue: number;
  overallProgress: number; // 0-100
}
