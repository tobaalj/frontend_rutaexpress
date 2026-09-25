import { useEffect, useState } from 'react';
import { reportApi } from '../api/reportApi';
import { ReportKpis, TopService } from '../types/models';

export function ReportsPage() {
  const [kpis, setKpis] = useState<ReportKpis>();
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reportApi
      .getKpis('last24h')
      .then(setKpis)
      .catch(() => setError('No se pudieron cargar los KPIs (¿backend/Kafka desplegado?)'));

    reportApi
      .getTopServices('last7d')
      .then(setTopServices)
      .catch(() => setError('No se pudieron cargar los servicios más usados'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1>Reportería</h1>
      {error && <p className="card error-box">{error}</p>}

      {kpis && (
        <div className="card">
          <h3>KPIs (últimas 24h) — alimentado por streaming Kafka</h3>
          <div className="form-row">
            <div><strong>{kpis.enviosPorHora}</strong><div>Envíos / hora</div></div>
            <div><strong>{kpis.leadTimePromedioMin} min</strong><div>Lead time promedio</div></div>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Servicios más usados (últimos 7 días)</h3>
        <table>
          <thead><tr><th>Servicio</th><th>Total envíos</th></tr></thead>
          <tbody>
            {topServices.map(t => (
              <tr key={t.servicioId}><td>{t.nombre}</td><td>{t.totalEnvios}</td></tr>
            ))}
            {!loading && topServices.length === 0 && (
              <tr><td colSpan={2}>Sin datos todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
