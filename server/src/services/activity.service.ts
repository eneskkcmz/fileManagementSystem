import type { Activity, ActivityAction, Paginated } from '@fms/shared';
import { activityRepository } from '../repositories/activity.repository';
import { generateId, nowIso } from '../utils/id';
import { paginate } from '../utils/response';

interface LogInput {
  factoryId?: string | null;
  projectId?: string | null;
  entityType: string;
  entityId: string;
  action: ActivityAction | string;
  description: string;
}

export const activityService = {
  /** Record an important event (spec madde 27). Also structured-logged to console (madde 54). */
  log(input: LogInput): Activity {
    const activity: Activity = {
      id: generateId('activity'),
      factoryId: input.factoryId ?? null,
      projectId: input.projectId ?? null,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      description: input.description,
      createdAt: nowIso(),
    };
    activityRepository.insert(activity);
    console.log(`[ACTIVITY] ${activity.action} entity=${activity.entityType}:${activity.entityId}`);
    return activity;
  },

  list(filters: { projectId?: string }, page: number, pageSize: number): Paginated<Activity> {
    const total = activityRepository.count(filters);
    const items = activityRepository.list(filters, pageSize, (page - 1) * pageSize);
    return paginate(items, page, pageSize, total);
  },
};
