import type { Paginated, WorkItem, WorkItemFilter, WorkItemInput, WorkItemStatus } from '@fms/shared';
import { workItemRepository } from '../repositories/workItem.repository';
import { projectService } from './project.service';
import { activityService } from './activity.service';
import { AppError } from '../utils/AppError';
import { generateId, nowIso } from '../utils/id';
import { paginate } from '../utils/response';

/** When an item is completed/cancelled its progress snaps to a consistent value. */
function reconcileProgress(status: WorkItemStatus, progress: number): number {
  if (status === 'completed') return 100;
  if (status === 'cancelled') return 0;
  return progress;
}

export const workItemService = {
  list(filters: WorkItemFilter, page: number, pageSize: number): Paginated<WorkItem> {
    const total = workItemRepository.count(filters);
    const items = workItemRepository.list(filters, pageSize, (page - 1) * pageSize);
    return paginate(items, page, pageSize, total);
  },

  getByIdOrThrow(id: string): WorkItem {
    const item = workItemRepository.getById(id);
    if (!item) throw AppError.notFound('Is kalemi bulunamadi');
    return item;
  },

  create(input: WorkItemInput): WorkItem {
    const project = projectService.getByIdOrThrow(input.projectId);
    const now = nowIso();
    const item: WorkItem = {
      id: generateId('work'),
      ...input,
      progress: reconcileProgress(input.status, input.progress),
      createdAt: now,
      updatedAt: now,
    };
    workItemRepository.insert(item);
    activityService.log({
      factoryId: project.factoryId,
      projectId: project.id,
      entityType: 'workItem',
      entityId: item.id,
      action: 'work_item_created',
      description: `Is kalemi olusturuldu: ${item.title}`,
    });
    return item;
  },

  update(id: string, input: WorkItemInput): WorkItem {
    const existing = this.getByIdOrThrow(id);
    const statusChanged = existing.status !== input.status;
    const updated: WorkItem = {
      ...existing,
      ...input,
      projectId: existing.projectId, // item cannot move projects in the MVP
      progress: reconcileProgress(input.status, input.progress),
      updatedAt: nowIso(),
    };
    workItemRepository.update(updated);

    const project = projectService.getByIdOrThrow(updated.projectId);
    if (statusChanged) {
      activityService.log({
        factoryId: project.factoryId,
        projectId: project.id,
        entityType: 'workItem',
        entityId: id,
        action: 'work_item_status_changed',
        description: `Durum degisti: ${existing.status} -> ${updated.status} (${updated.title})`,
      });
    } else {
      activityService.log({
        factoryId: project.factoryId,
        projectId: project.id,
        entityType: 'workItem',
        entityId: id,
        action: 'work_item_updated',
        description: `Is kalemi guncellendi: ${updated.title}`,
      });
    }
    return updated;
  },

  changeStatus(id: string, status: WorkItemStatus): WorkItem {
    const existing = this.getByIdOrThrow(id);
    if (existing.status === status) return existing;
    const updated: WorkItem = {
      ...existing,
      status,
      progress: reconcileProgress(status, existing.progress),
      updatedAt: nowIso(),
    };
    workItemRepository.update(updated);
    const project = projectService.getByIdOrThrow(updated.projectId);
    activityService.log({
      factoryId: project.factoryId,
      projectId: project.id,
      entityType: 'workItem',
      entityId: id,
      action: 'work_item_status_changed',
      description: `Durum degisti: ${existing.status} -> ${status} (${updated.title})`,
    });
    return updated;
  },

  remove(id: string): void {
    const existing = this.getByIdOrThrow(id);
    workItemRepository.softDelete(id, nowIso());
    const project = projectService.getByIdOrThrow(existing.projectId);
    activityService.log({
      factoryId: project.factoryId,
      projectId: project.id,
      entityType: 'workItem',
      entityId: id,
      action: 'work_item_deleted',
      description: `Is kalemi silindi: ${existing.title}`,
    });
  },
};
