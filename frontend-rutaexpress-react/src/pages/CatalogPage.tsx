import { useEffect, useState } from 'react';
import { useRoles } from '../auth/useRoles';
import { catalogApi } from '../api/catalogApi';
import { CatalogServiceItem } from '../types/models';

export function CatalogPage() {
  const { isAdmin } = useRoles();
  const [services, setServices] = useState<CatalogServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [tarifa, setTarifa] = useState(0);
  const [capacidad, setCapacidad] = useState(0);

  useEffect(() => {
    catalogApi
      .list()
      .then(setServices)
      .catch(() => setError('No se pudo cargar el catálogo (¿backend desplegado?)'))
      .finally(() => setLoading(false));
  }, []);

  const crearServicio = () => {
    if (!nombre) return;
    catalogApi
      .create({ nombre, tarifa, capacidad })
      .then(servicio => {
        setServices(prev => [servicio, ...prev]);
        setNombre('');
        setTarifa(0);
        setCapacidad(0);
      })
      .catch(() => setError('No se pudo crear el servicio'));
  };

  return (
    <div className="container">
      <h1>Catálogo de servicios</h1>
      {error && <p className="card error-box">{error}</p>}

      {isAdmin() && (
        <div className="card">
          <h3>Nuevo servicio</h3>
          <div className="form-row">
            <label>Nombre <input value={nombre} onChange={e => setNombre(e.target.value)} /></label>
            <label>Tarifa <input type="number" value={tarifa} onChange={e => setTarifa(Number(e.target.value))} /></label>
            <label>Capacidad <input type="number" value={capacidad} onChange={e => setCapacidad(Number(e.target.value))} /></label>
          </div>
          <button className="btn" onClick={crearServicio}>Agregar servicio</button>
        </div>
      )}

      <div className="card">
        <table>
          <thead><tr><th>Nombre</th><th>Tarifa</th><th>Capacidad</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.nombre}</td>
                <td>{s.tarifa.toLocaleString()}</td>
                <td>{s.capacidad}</td>
              </tr>
            ))}
            {!loading && services.length === 0 && (
              <tr><td colSpan={3}>Sin servicios registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
