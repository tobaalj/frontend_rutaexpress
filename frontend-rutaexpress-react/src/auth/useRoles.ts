import { useAuth } from './AuthContext';

export type AppRole = 'Admin' | 'Operador' | 'Cliente' | 'Auditor';

/**
 * Mismo contrato que tendrá la versión con Azure AD (roles, displayName,
 * hasRole, hasAnyRole, isAdmin), pero leyendo el usuario logueado localmente
 * en vez de los claims del token. Así el resto de la app (Navbar, guards,
 * páginas) no cambia cuando migren a MSAL.
 */
export function useRoles() {
  const { currentUser } = useAuth();

  const roles = currentUser?.roles ?? [];
  const displayName = currentUser?.displayName ?? 'Usuario';

  const hasRole = (role: AppRole) => roles.includes(role);
  const hasAnyRole = (allowed: AppRole[]) => allowed.some(r => roles.includes(r));
  const isAdmin = () => hasRole('Admin');

  return { roles, displayName, hasRole, hasAnyRole, isAdmin };
}
