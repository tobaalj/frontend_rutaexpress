import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Envuelve una ruta protegida: si no hay sesión (login básico), redirige a /login.
 * Esta es la única pieza que cambia cuando se migre a Azure AD: en vez de
 * redirigir a /login, se disparará loginRedirect de MSAL automáticamente.
 */
export function RequireAuth({ children }: PropsWithChildren) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
