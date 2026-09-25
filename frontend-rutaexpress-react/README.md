# frontend-rutaexpress (React)

Frontend en **React + Vite + TypeScript** del sistema **RutaExpress**
(Evaluación Parcial N°1 — DSY1107).

⚠️ **Estado actual: login básico (usuario/contraseña), sin Azure AD todavía.**
Se implementó así para poder seguir avanzando con las pantallas y el consumo
del backend mientras se gestiona el acceso a Azure AD / la App Registration.
Antes de la entrega final hay que migrar a MSAL (ver sección 6).

## 1. Requisitos

- Node.js 18+ y npm

## 2. Instalar y ejecutar

```bash
npm install
npm run dev      # http://localhost:4200
```

## 3. Usuarios de prueba (login básico)

Definidos en `src/auth/AuthContext.tsx`:

| Usuario    | Contraseña     | Rol       |
|------------|----------------|-----------|
| admin      | admin123       | Admin     |
| operador   | operador123    | Operador  |
| cliente    | cliente123     | Cliente   |
| auditor    | auditor123     | Auditor   |

En la pantalla de login hay botones de acceso rápido para cada uno.

## 4. Cómo funciona el login básico

- `AuthContext.tsx`: guarda el usuario logueado en `sessionStorage` y expone
  `login(username, password)` / `logout()`.
- `RequireAuth.tsx`: si no hay sesión, redirige a `/login` (protege las rutas).
- `RequireRole.tsx`: bloquea la ruta si el rol del usuario no está permitido
  (misma lógica que tendrá con Azure AD).
- `useRoles.ts`: expone `roles`, `displayName`, `hasRole`, `hasAnyRole`,
  `isAdmin` — **este contrato no cambia** cuando se migre a MSAL, así que el
  resto de la app (Navbar, páginas) no se toca.
- `api/httpClient.ts`: adjunta `Authorization: Basic base64(usuario:contraseña)`
  a cada llamada al backend. Si el backend define temporalmente los mismos
  usuarios con Spring Security (HTTP Basic, in-memory), las llamadas ya
  funcionan sin tocar el frontend.

## 5. Configurar la URL del backend

Edita `src/environment.ts`:

```ts
export const environment = {
  azureAd: { /* se completa cuando esté disponible el tenant */ },
  api: {
    baseUrl: 'https://<tu-backend>' // BFF o API Gateway
  }
};
```

## 6. Migrar a Azure AD (MSAL) más adelante

Cuando tengan la App Registration en Azure AD lista, hay que reemplazar solo
la carpeta `src/auth/` y dos archivos más, manteniendo el resto de la app
intacta:

1. `src/auth/authConfig.ts` — instancia MSAL, `loginRequest`/`apiRequest`.
2. `src/auth/useRoles.ts` — leer roles desde `idTokenClaims` en vez del
   `AuthContext` local.
3. `src/auth/RequireAuth.tsx` — usar `MsalAuthenticationTemplate` en vez de
   redirigir a `/login`.
4. `src/api/httpClient.ts` — usar `acquireTokenSilent` para el Bearer token
   en vez de Basic Auth.
5. `src/main.tsx` — envolver la app en `<MsalProvider>` en vez de
   `<AuthProvider>`.
6. `src/components/Navbar.tsx` y `src/pages/LoginPage.tsx` — usar
   `useMsal()` / `loginRedirect()` en vez del formulario de usuario/contraseña.

(Ya se armó esa versión completa con MSAL antes; si necesitas que te la
vuelva a generar cuando tengan el tenant, solo pide "ahora sí conecta Azure AD".)

## 7. Estructura del proyecto

```
src/
  auth/
    AuthContext.tsx     Login básico (usuario/contraseña) en sessionStorage
    useRoles.ts          Hook con roles/usuario del login actual
    RequireAuth.tsx      Protege rutas: sin sesión → /login
    RequireRole.tsx      Bloquea rutas según rol permitido
  api/
    httpClient.ts        axios + Authorization Basic hacia el backend
    shipmentsApi.ts, catalogApi.ts, reportApi.ts, auditApi.ts
  types/models.ts         Interfaces de dominio
  components/Navbar.tsx   Navegación condicionada por rol + login/logout
  pages/
    LoginPage, DashboardPage, ShipmentsPage, CatalogPage, ReportsPage, AuditPage
```

## 8. Notas para el repositorio GitHub

- El `.gitignore` excluye `node_modules`, `dist` y archivos de entorno locales.
- Las contraseñas de `AuthContext.tsx` son solo para desarrollo: no deben
  quedar como mecanismo real de autenticación en la versión final entregada.
