import api from './api';

export async function getProducts() {
  const response = await api.get('/products');
  return response.data;
}

export async function postProducts(productName: string) {
  const response = await api.post('/products', {productName})
  return response.data;
}

