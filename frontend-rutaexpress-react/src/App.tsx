import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { RequireAuth } from './auth/RequireAuth';
import { RequireRole } from './auth/RequireRole';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { CatalogPage } from './pages/CatalogPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditPage } from './pages/AuditPage';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />

        <Route
          path="/shipments"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={['Admin', 'Operador', 'Cliente']}>
                <ShipmentsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/catalog"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={['Admin', 'Operador']}>
                <CatalogPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/reports"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={['Admin']}>
                <ReportsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/audit"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={['Admin', 'Auditor']}>
                <AuditPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="*"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}
