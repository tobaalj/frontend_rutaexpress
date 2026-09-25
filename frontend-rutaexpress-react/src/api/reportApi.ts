import { httpClient } from './httpClient';
import { ReportKpis, TopService } from '../types/models';

export const reportApi = {
  getKpis: (range: string = 'last24h') =>
    httpClient.get<ReportKpis>('/api/report/kpis', { params: { range } }).then(r => r.data),

  getTopServices: (range: string = 'last7d') =>
    httpClient
      .get<TopService[]>('/api/report/top-services', { params: { range } })
      .then(r => r.data)
};
