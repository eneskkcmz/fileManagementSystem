/**
 * Idempotent-ish demo seed. Run: `npm run seed --workspace=server`.
 * Safe to run on an empty DB; re-running just adds another factory.
 */
import './connection';
import { factoryService } from '../services/factory.service';
import { projectService } from '../services/project.service';
import { workItemService } from '../services/workItem.service';
import type { WorkItemInput } from '@fms/shared';

const factory = factoryService.create({
  name: 'Eskisehir Fabrikasi',
  code: 'ESK',
  description: 'Eskisehir uretim tesisi',
});

const project = projectService.create({
  factoryId: factory.id,
  name: 'ERP Projesi',
  description: 'Fabrika ERP gelistirme projesi',
  status: 'active',
  startDate: '2026-08-01',
  targetEndDate: '2026-12-31',
});

const items: WorkItemInput[] = [
  { projectId: project.id, title: 'Login Ekrani', description: null, type: 'screen', status: 'completed', priority: 'high', progress: 100, startDate: null, dueDate: '2026-08-20' },
  { projectId: project.id, title: 'Urun Yonetimi', description: 'Urun ekleme, silme ve guncelleme', type: 'screen', status: 'in_progress', priority: 'high', progress: 70, startDate: '2026-08-20', dueDate: '2026-09-05' },
  { projectId: project.id, title: 'Stok Yonetimi', description: null, type: 'screen', status: 'testing', priority: 'medium', progress: 60, startDate: null, dueDate: '2026-09-10' },
  { projectId: project.id, title: 'Raporlama', description: null, type: 'report', status: 'waiting_approval', priority: 'medium', progress: 90, startDate: null, dueDate: '2026-08-25' },
  { projectId: project.id, title: 'ERP Entegrasyonu', description: 'SAP entegrasyonu', type: 'integration', status: 'backlog', priority: 'critical', progress: 0, startDate: null, dueDate: '2026-08-15' },
];

for (const item of items) workItemService.create(item);

console.log(`[seed] Olusturuldu: fabrika=${factory.id} proje=${project.id} isKalemi=${items.length}`);
