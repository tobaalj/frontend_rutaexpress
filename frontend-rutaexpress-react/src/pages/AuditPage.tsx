import { useEffect, useState } from 'react';
import { auditApi } from '../api/auditApi';
import { AuditEvent } from '../types/models';

export function AuditPage() {
  const [eventos, setEventos] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [usuario, setUsuario] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const buscar = () => {
    setLoading(true);
    auditApi
      .list({ usuario: usuario || undefined, from: desde || undefined, to: hasta || undefined })
      .then(setEventos)
      .catch(() => setError('No se pudo cargar el timeline (¿backend/Kafka desplegado?)'))
      .finally(() => setLoading(false));
  };

  useEffect(buscar, []);

  return (
    <div className="container">
      <h1>Auditoría (solo lectura)</h1>
      {error && <p className="card error-box">{error}</p>}

      <div className="card">
        <div className="form-row">
          <label>Usuario <input value={usuario} onChange={e => setUsuario(e.target.value)} /></label>
          <label>Desde <input type="date" value={desde} onChange={e => setDesde(e.target.value)} /></label>
          <label>Hasta <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} /></label>
        </div>
        <button className="btn" onClick={buscar}>Filtrar</button>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Envío</th><th>Usuario</th><th>Acción</th><th>Fecha</th></tr></thead>
          <tbody>
            {eventos.map(e => (
              <tr key={e.id}>
                <td>{e.envioId}</td>
                <td>{e.usuario}</td>
                <td>{e.accion}</td>
                <td>{new Date(e.fecha).toLocaleString()}</td>
              </tr>
            ))}
            {!loading && eventos.length === 0 && (
              <tr><td colSpan={4}>Sin eventos para el filtro seleccionado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
