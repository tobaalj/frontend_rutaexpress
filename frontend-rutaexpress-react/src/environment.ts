// Reemplaza estos valores con los de tu App Registration "RutaExpress" en Azure AD
// y con la URL real del API Gateway / BFF una vez desplegado.
export const environment = {
  azureAd: {
    clientId: 'REEMPLAZAR_CLIENT_ID', // Application (client) ID
    tenantId: 'REEMPLAZAR_TENANT_ID', // Directory (tenant) ID
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
    // Scope expuesto por la API: api://<API_CLIENT_ID>/access_as_user
    apiScope: 'api://REEMPLAZAR_API_CLIENT_ID/access_as_user'
  },
  api: {
    // BFF detrás del AWS API Gateway
    baseUrl: 'https://REEMPLAZAR.execute-api.us-east-1.amazonaws.com'
  }
};
