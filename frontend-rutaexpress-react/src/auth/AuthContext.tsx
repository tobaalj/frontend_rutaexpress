import { createContext, useContext, useState, PropsWithChildren } from 'react';
import { AppRole } from './useRoles';

export interface DemoUser {
  username: string;
  password: string;
  displayName: string;
  roles: AppRole[];
}

/**
 * Usuarios de prueba mientras no está disponible Azure AD.
 * Cuando migren a MSAL, esta lista deja de usarse: los roles vendrán
 * del claim "roles" del token, tal como está documentado en el README.
 */
export const DEMO_USERS: DemoUser[] = [
  { username: 'admin', password: 'admin123', displayName: 'Admin Demo', roles: ['Admin'] },
  { username: 'operador', password: 'operador123', displayName: 'Operador Demo', roles: ['Operador'] },
  { username: 'cliente', password: 'cliente123', displayName: 'Cliente Demo', roles: ['Cliente'] },
  { username: 'auditor', password: 'auditor123', displayName: 'Auditor Demo', roles: ['Auditor'] }
];

interface AuthContextValue {
  currentUser: DemoUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'rutaexpress.currentUser';

function readStoredUser(): DemoUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(readStoredUser);

  const login = (username: string, password: string): boolean => {
    const found = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (!found) return false;

    setCurrentUser(found);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
