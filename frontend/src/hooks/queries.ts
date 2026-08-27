import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { FactoryInput, ProjectInput, WorkItemFilter, WorkItemInput, WorkItemStatus } from '@fms/shared';
import { activityApi, factoryApi, projectApi, workItemApi } from '../api/endpoints';

export const qk = {
  factories: ['factories'] as const,
  factory: (id: string) => ['factories', id] as const,
  projects: (factoryId?: string) => ['projects', { factoryId: factoryId ?? null }] as const,
  project: (id: string) => ['projects', id] as const,
  projectActivities: (id: string) => ['projects', id, 'activities'] as const,
  workItems: (filter: WorkItemFilter) => ['work-items', filter] as const,
  activities: ['activities'] as const,
};

// ---- Factories ----
export const useFactories = () => useQuery({ queryKey: qk.factories, queryFn: factoryApi.list });

export function useCreateFactory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FactoryInput) => factoryApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.factories }),
  });
}

export function useDeleteFactory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => factoryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.factories }),
  });
}

// ---- Projects ----
export const useProjects = (factoryId?: string) =>
  useQuery({ queryKey: qk.projects(factoryId), queryFn: () => projectApi.list(factoryId) });

export const useProject = (id: string) =>
  useQuery({ queryKey: qk.project(id), queryFn: () => projectApi.get(id) });

export const useProjectActivities = (id: string) =>
  useQuery({ queryKey: qk.projectActivities(id), queryFn: () => projectApi.activities(id) });

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInput) => projectApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

// ---- Work Items ----
export const useWorkItems = (filter: WorkItemFilter) =>
  useQuery({ queryKey: qk.workItems(filter), queryFn: () => workItemApi.list(filter) });

function invalidateProjectViews(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['work-items'] });
  qc.invalidateQueries({ queryKey: ['projects'] }); // stats depend on work items
  qc.invalidateQueries({ queryKey: ['activities'] });
}

export function useCreateWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: WorkItemInput) => workItemApi.create(input),
    onSuccess: () => invalidateProjectViews(qc),
  });
}

export function useUpdateWorkItemStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: WorkItemStatus }) =>
      workItemApi.changeStatus(vars.id, vars.status),
    onSuccess: () => invalidateProjectViews(qc),
  });
}

export function useDeleteWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workItemApi.remove(id),
    onSuccess: () => invalidateProjectViews(qc),
  });
}

// ---- Activities ----
export const useActivities = () => useQuery({ queryKey: qk.activities, queryFn: activityApi.list });
