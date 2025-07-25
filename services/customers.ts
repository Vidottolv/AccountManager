import api from './api';

export async function getCustomer() {
  const response = await api.get('/customer');
  // console.log(response.data)
  return response.data;
}

export async function insertCustomer(name: string) {
  const response = await api.post('/customer', { name });
  return response.data;
}