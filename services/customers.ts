import api from './api';

export async function getCustomer() {
  const response = await api.get('/customer');
  // console.log(response.data)
  return response.data;
}