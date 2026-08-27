/** Activity log entry (spec madde 27). Append-only audit trail. */
export interface Activity {
  id: string;
  factoryId: string | null;
  projectId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  createdAt: string;
}

/** Well-known action names (spec madde 27). Kept as string in DB for forward-compat. */
export const activityActions = [
  'factory_created',
  'factory_updated',
  'factory_deleted',
  'project_created',
  'project_updated',
  'project_deleted',
  'work_item_created',
  'work_item_updated',
  'work_item_status_changed',
  'work_item_deleted',
] as const;
export type ActivityAction = (typeof activityActions)[number];
