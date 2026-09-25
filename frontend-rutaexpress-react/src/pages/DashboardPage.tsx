import { useEffect, useState } from 'react';
import { useRoles } from '../auth/useRoles';
import { reportApi } from '../api/reportApi';
import { shipmentsApi } from '../api/shipmentsApi';
import { ReportKpis, Shipment } from '../types/models';

export function DashboardPage() {
  const { displayName, isAdmin } = useRoles();
  const [kpis, setKpis] = useState<ReportKpis>();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin()) {
      reportApi
        .getKpis('last24h')
        .then(setKpis)
        .catch(() => setError('No se pudieron cargar los KPIs (¿backend desplegado?)'));
    } else {
      shipmentsApi
        .list()
        .then(data => setShipments(data.slice(0, 8)))
        .catch(() => setError('No se pudieron cargar los envíos (¿backend desplegado?)'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h1>Hola, {displayName}</h1>
      {error && <p className="card error-box">{error}</p>}

      {isAdmin() ? (
        kpis && (
          <div className="card">
            <h3>KPIs de la red (últimas 24h)</h3>
            <div className="form-row">
              <div><strong>{kpis.enviosPorHora}</strong><div>Envíos / hora</div></div>
              <div><strong>{kpis.leadTimePromedioMin} min</strong><div>Lead time promedio</div></div>
            </div>
            <table>
              <thead><tr><th>Estado</th><th>Cantidad</th></tr></thead>
              <tbody>
                {Object.entries(kpis.estadosActivos).map(([estado, cantidad]) => (
                  <tr key={estado}><td>{estado}</td><td>{cantidad}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="card">
          <h3>Tus envíos recientes</h3>
          <table>
            <thead><tr><th>Destinatario</th><th>Estado</th><th>Creado</th></tr></thead>
            <tbody>
              {shipments.map(s => (
                <tr key={s.id}>
                  <td>{s.destinatario}</td>
                  <td><span className="badge">{s.status}</span></td>
                  <td>{new Date(s.creadoEn).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
