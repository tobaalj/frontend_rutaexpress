import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { AppRole, useRoles } from './useRoles';

interface Props extends PropsWithChildren {
  allowedRoles: AppRole[];
}

/**
 * Se usa DENTRO de <RequireAuth>: ya hay sesión, esto solo valida
 * si el claim "roles" del token permite ver la pantalla.
 */
export function RequireRole({ allowedRoles, children }: Props) {
  const { hasAnyRole } = useRoles();

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
