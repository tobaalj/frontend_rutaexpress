export type ShipmentStatus =
  | 'CREADO'
  | 'ACEPTADO'
  | 'EN_BODEGA'
  | 'EN_RUTA'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface Shipment {
  id: string;
  destinatario: string;
  direccion: string;
  servicioId: string;
  status: ShipmentStatus;
  creadoEn: string;
}

export interface ShipmentCreateRequest {
  destinatario: string;
  direccion: string;
  servicioId: string;
}

export interface CatalogServiceItem {
  id: string;
  nombre: string;
  tarifa: number;
  capacidad: number;
}

export interface ReportKpis {
  enviosPorHora: number;
  leadTimePromedioMin: number;
  estadosActivos: Record<ShipmentStatus, number>;
}

export interface TopService {
  servicioId: string;
  nombre: string;
  totalEnvios: number;
}

export interface AuditEvent {
  id: string;
  envioId: string;
  usuario: string;
  accion: string;
  fecha: string;
}
