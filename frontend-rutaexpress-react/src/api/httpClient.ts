import axios from 'axios';
import { environment } from '../environment';

const STORAGE_KEY = 'rutaexpress.currentUser';

export const httpClient = axios.create({
  baseURL: environment.api.baseUrl
});

/**
 * Mientras no hay Azure AD, se manda HTTP Basic Auth con el usuario/contraseña
 * del login local (username:password en Base64). Si el backend define un
 * Spring Security con los MISMOS usuarios demo (in-memory), esto ya funciona
 * sin tocar el frontend.
 *
 * Cuando migren a Azure AD, este interceptor se reemplaza por el que adjunta
 * el Bearer <access_token> obtenido con MSAL (acquireTokenSilent) — el resto
 * de las llamadas (shipmentsApi, catalogApi, etc.) no cambia.
 */
httpClient.interceptors.request.use(config => {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw) {
    const { username, password } = JSON.parse(raw) as { username: string; password: string };
    config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
  }
  return config;
});
