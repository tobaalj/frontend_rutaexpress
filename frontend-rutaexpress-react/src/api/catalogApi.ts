import { httpClient } from './httpClient';
import { CatalogServiceItem } from '../types/models';

export const catalogApi = {
  list: () => httpClient.get<CatalogServiceItem[]>('/api/catalog/services').then(r => r.data),

  create: (payload: Omit<CatalogServiceItem, 'id'>) =>
    httpClient.post<CatalogServiceItem>('/api/catalog/services', payload).then(r => r.data),

  update: (id: string, payload: Partial<CatalogServiceItem>) =>
    httpClient.put<CatalogServiceItem>(`/api/catalog/services/${id}`, payload).then(r => r.data)
};
