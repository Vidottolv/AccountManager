import { SaleRequest } from '@/schema/saleSchema';
import api from './api';

export async function getSales() {
    const response = await api.get('/sales');
    return response.data;
}

// export async function getSalesByMonth(month: number, year: number) {
//     const response = await api.post('/sales/salesByMonth', {month, year});
//     return response.data;
// }

export async function postSales(sale: SaleRequest) {
    const response = await api.post('/sales', sale);
    return response.data;
}

export async function updateSales(commission: number, language: string, _id: string) {
    const response = await api.put(`/sales/${_id}`, {commission, language});
    return response.data;
}