import type {
  Paginated,
  Project,
  ProjectInput,
  ProjectStats,
  ProjectWithStats,
  WorkItem,
} from '@fms/shared';
import { projectRepository } from '../repositories/project.repository';
import { workItemRepository } from '../repositories/workItem.repository';
import { factoryService } from './factory.service';
import { activityService } from './activity.service';
import { AppError } from '../utils/AppError';
import { generateId, nowIso } from '../utils/id';
import { paginate } from '../utils/response';

/** Rollups for the project dashboard (spec madde 28-29). */
function computeStats(items: WorkItem[]): ProjectStats {
  const today = nowIso().slice(0, 10);
  const isOverdue = (w: WorkItem) =>
    w.dueDate !== null && w.dueDate < today && w.status !== 'completed' && w.status !== 'cancelled';

  const total = items.length;
  // Overall progress = average of each item's progress (madde 16/29). 0 when empty.
  const overallProgress =
    total === 0 ? 0 : Math.round(items.reduce((sum, w) => sum + w.progress, 0) / total);

  return {
    totalWorkItems: total,
    completed: items.filter((w) => w.status === 'completed').length,
    inProgress: items.filter((w) => w.status === 'in_progress').length,
    testing: items.filter((w) => w.status === 'testing').length,
    waitingApproval: items.filter((w) => w.status === 'waiting_approval').length,
    overdue: items.filter(isOverdue).length,
    overallProgress,
  };
}

export const projectService = {
  list(filters: { factoryId?: string }, page: number, pageSize: number): Paginated<ProjectWithStats> {
    const total = projectRepository.count(filters);
    const projects = projectRepository.list(filters, pageSize, (page - 1) * pageSize);
    const items = projects.map((p) => this.withStats(p));
    return paginate(items, page, pageSize, total);
  },

  getByIdOrThrow(id: string): Project {
    const project = projectRepository.getById(id);
    if (!project) throw AppError.notFound('Proje bulunamadi');
    return project;
  },

  getWithStats(id: string): ProjectWithStats {
    return this.withStats(this.getByIdOrThrow(id));
  },

  withStats(project: Project): ProjectWithStats {
    const items = workItemRepository.listByProject(project.id);
    return { ...project, factoryName: factorySafeName(project.factoryId), stats: computeStats(items) };
  },

  create(input: ProjectInput): Project {
    // Referential integrity: factory must exist (throws 404 otherwise).
    factoryService.getByIdOrThrow(input.factoryId);
    const now = nowIso();
    const project: Project = { id: generateId('project'), ...input, createdAt: now, updatedAt: now };
    projectRepository.insert(project);
    activityService.log({
      factoryId: project.factoryId,
      projectId: project.id,
      entityType: 'project',
      entityId: project.id,
      action: 'project_created',
      description: `Proje olusturuldu: ${project.name}`,
    });
    return project;
  },

  update(id: string, input: ProjectInput): Project {
    const existing = this.getByIdOrThrow(id);
    // factoryId is fixed after creation to keep the tree stable.
    const updated: Project = {
      ...existing,
      ...input,
      factoryId: existing.factoryId,
      updatedAt: nowIso(),
    };
    projectRepository.update(updated);
    activityService.log({
      factoryId: updated.factoryId,
      projectId: id,
      entityType: 'project',
      entityId: id,
      action: 'project_updated',
      description: `Proje guncellendi: ${updated.name}`,
    });
    return updated;
  },

  remove(id: string): void {
    const existing = this.getByIdOrThrow(id);
    projectRepository.softDelete(id, nowIso());
    activityService.log({
      factoryId: existing.factoryId,
      projectId: id,
      entityType: 'project',
      entityId: id,
      action: 'project_deleted',
      description: `Proje silindi: ${existing.name}`,
    });
  },
};

// Local helper kept private: resolve a factory display name without throwing.
function factorySafeName(factoryId: string): string | null {
  try {
    return factoryService.getByIdOrThrow(factoryId).name;
  } catch {
    return null;
  }
}
