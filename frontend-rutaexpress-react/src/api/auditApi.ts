import { httpClient } from './httpClient';
import { AuditEvent } from '../types/models';

export const auditApi = {
  list: (filters?: { usuario?: string; from?: string; to?: string; tipoEvento?: string }) =>
    httpClient.get<AuditEvent[]>('/api/audit', { params: filters }).then(r => r.data)
};
