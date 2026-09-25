import { httpClient } from './httpClient';
import { Shipment, ShipmentCreateRequest, ShipmentStatus } from '../types/models';

export const shipmentsApi = {
  list: (filters?: { status?: ShipmentStatus; from?: string; to?: string }) =>
    httpClient.get<Shipment[]>('/api/shipments', { params: filters }).then(r => r.data),

  getById: (id: string) =>
    httpClient.get<Shipment>(`/api/shipments/${id}`).then(r => r.data),

  create: (payload: ShipmentCreateRequest) =>
    httpClient.post<Shipment>('/api/shipments', payload).then(r => r.data),

  changeStatus: (id: string, status: ShipmentStatus) =>
    httpClient.put<Shipment>(`/api/shipments/${id}/status`, { status }).then(r => r.data)
};
