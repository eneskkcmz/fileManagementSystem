import type {
  Activity,
  Factory,
  FactoryInput,
  Paginated,
  Project,
  ProjectInput,
  ProjectWithStats,
  WorkItem,
  WorkItemFilter,
  WorkItemInput,
  WorkItemStatus,
} from '@fms/shared';
import { http } from './client';

export const factoryApi = {
  list: () => http.get<Paginated<Factory>>('/factories', { pageSize: 200 }),
  get: (id: string) => http.get<Factory>(`/factories/${id}`),
  create: (input: FactoryInput) => http.post<Factory>('/factories', input),
  update: (id: string, input: FactoryInput) => http.put<Factory>(`/factories/${id}`, input),
  remove: (id: string) => http.del<{ id: string }>(`/factories/${id}`),
};

export const projectApi = {
  list: (factoryId?: string) =>
    http.get<Paginated<ProjectWithStats>>('/projects', { pageSize: 200, factoryId }),
  get: (id: string) => http.get<ProjectWithStats>(`/projects/${id}`),
  create: (input: ProjectInput) => http.post<Project>('/projects', input),
  update: (id: string, input: ProjectInput) => http.put<Project>(`/projects/${id}`, input),
  remove: (id: string) => http.del<{ id: string }>(`/projects/${id}`),
  activities: (id: string) => http.get<Paginated<Activity>>(`/projects/${id}/activities`, { pageSize: 20 }),
};

export const workItemApi = {
  list: (filter: WorkItemFilter) => http.get<Paginated<WorkItem>>('/work-items', { pageSize: 200, ...filter }),
  get: (id: string) => http.get<WorkItem>(`/work-items/${id}`),
  create: (input: WorkItemInput) => http.post<WorkItem>('/work-items', input),
  update: (id: string, input: WorkItemInput) => http.put<WorkItem>(`/work-items/${id}`, input),
  changeStatus: (id: string, status: WorkItemStatus) =>
    http.patch<WorkItem>(`/work-items/${id}/status`, { status }),
  remove: (id: string) => http.del<{ id: string }>(`/work-items/${id}`),
};

export const activityApi = {
  list: () => http.get<Paginated<Activity>>('/activities', { pageSize: 15 }),
};
