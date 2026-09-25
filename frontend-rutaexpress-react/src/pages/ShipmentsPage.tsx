import { useEffect, useState } from 'react';
import { useRoles } from '../auth/useRoles';
import { shipmentsApi } from '../api/shipmentsApi';
import { Shipment, ShipmentStatus } from '../types/models';

const NEXT_STATUS: Record<ShipmentStatus, ShipmentStatus[]> = {
  CREADO: ['ACEPTADO', 'CANCELADO'],
  ACEPTADO: ['EN_BODEGA', 'CANCELADO'],
  EN_BODEGA: ['EN_RUTA', 'CANCELADO'],
  EN_RUTA: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: []
};

export function ShipmentsPage() {
  const { hasAnyRole } = useRoles();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  const [destinatario, setDestinatario] = useState('');
  const [direccion, setDireccion] = useState('');
  const [servicioId, setServicioId] = useState('');

  const puedeCrear = hasAnyRole(['Cliente', 'Operador', 'Admin']);
  const puedeCambiarEstado = hasAnyRole(['Operador', 'Admin']);

  const cargar = () => {
    setLoading(true);
    shipmentsApi
      .list()
      .then(setShipments)
      .catch(() => setError('No se pudieron cargar los envíos (¿backend desplegado?)'))
      .finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  const crearEnvio = () => {
    if (!destinatario || !direccion || !servicioId) return;
    setCreando(true);
    shipmentsApi
      .create({ destinatario, direccion, servicioId })
      .then(shipment => {
        setShipments(prev => [shipment, ...prev]);
        setDestinatario('');
        setDireccion('');
        setServicioId('');
      })
      .catch(() => setError('No se pudo crear el envío'))
      .finally(() => setCreando(false));
  };

  const cambiarEstado = (shipment: Shipment, status: ShipmentStatus) => {
    shipmentsApi
      .changeStatus(shipment.id, status)
      .then(actualizado => {
        setShipments(prev =>
          prev.map(s => (s.id === shipment.id ? { ...s, status: actualizado.status } : s))
        );
      })
      .catch(() => setError('No se pudo cambiar el estado del envío'));
  };

  return (
    <div className="container">
      <h1>Envíos</h1>
      {error && <p className="card error-box">{error}</p>}

      {puedeCrear && (
        <div className="card">
          <h3>Nuevo envío</h3>
          <div className="form-row">
            <label>Destinatario
              <input value={destinatario} onChange={e => setDestinatario(e.target.value)} />
            </label>
            <label>Dirección
              <input value={direccion} onChange={e => setDireccion(e.target.value)} />
            </label>
            <label>Servicio (ID catálogo)
              <input value={servicioId} onChange={e => setServicioId(e.target.value)} />
            </label>
          </div>
          <button className="btn" disabled={creando} onClick={crearEnvio}>Crear envío</button>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Destinatario</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Creado</th>
              {puedeCambiarEstado && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s.id}>
                <td>{s.destinatario}</td>
                <td>{s.direccion}</td>
                <td><span className="badge">{s.status}</span></td>
                <td>{new Date(s.creadoEn).toLocaleString()}</td>
                {puedeCambiarEstado && (
                  <td>
                    {NEXT_STATUS[s.status].map(next => (
                      <button key={next} className="btn secondary" onClick={() => cambiarEstado(s, next)}>
                        → {next}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
            {!loading && shipments.length === 0 && (
              <tr><td colSpan={5}>No hay envíos registrados todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
