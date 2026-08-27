import type { Factory, FactoryInput, Paginated } from '@fms/shared';
import { factoryRepository } from '../repositories/factory.repository';
import { activityService } from './activity.service';
import { AppError } from '../utils/AppError';
import { generateId, nowIso } from '../utils/id';
import { paginate } from '../utils/response';

export const factoryService = {
  list(page: number, pageSize: number): Paginated<Factory> {
    const total = factoryRepository.count();
    const items = factoryRepository.list(pageSize, (page - 1) * pageSize);
    return paginate(items, page, pageSize, total);
  },

  getByIdOrThrow(id: string): Factory {
    const factory = factoryRepository.getById(id);
    if (!factory) throw AppError.notFound('Fabrika bulunamadi');
    return factory;
  },

  create(input: FactoryInput): Factory {
    if (factoryRepository.existsByCode(input.code)) {
      throw AppError.conflict('Bu kod ile bir fabrika zaten var');
    }
    const now = nowIso();
    const factory: Factory = { id: generateId('factory'), ...input, createdAt: now, updatedAt: now };
    factoryRepository.insert(factory);
    activityService.log({
      factoryId: factory.id,
      entityType: 'factory',
      entityId: factory.id,
      action: 'factory_created',
      description: `Fabrika olusturuldu: ${factory.name}`,
    });
    return factory;
  },

  update(id: string, input: FactoryInput): Factory {
    const existing = this.getByIdOrThrow(id);
    if (factoryRepository.existsByCode(input.code, id)) {
      throw AppError.conflict('Bu kod ile baska bir fabrika zaten var');
    }
    const updated: Factory = { ...existing, ...input, updatedAt: nowIso() };
    factoryRepository.update(updated);
    activityService.log({
      factoryId: id,
      entityType: 'factory',
      entityId: id,
      action: 'factory_updated',
      description: `Fabrika guncellendi: ${updated.name}`,
    });
    return updated;
  },

  remove(id: string): void {
    const existing = this.getByIdOrThrow(id);
    factoryRepository.softDelete(id, nowIso());
    activityService.log({
      factoryId: id,
      entityType: 'factory',
      entityId: id,
      action: 'factory_deleted',
      description: `Fabrika silindi: ${existing.name}`,
    });
  },
};
