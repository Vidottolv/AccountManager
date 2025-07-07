import api from './api';

export async function login(username: string, password: string) {
    console.log('email ', username);
    console.log('password ', password);
    const response = await api.post('/login', { username, password });
    console.log('response ', response.data)
    return response.data; 
}

export async function register(username: string, password: string) {
  const response = await api.post('/register', { username, password });
  return response.data;
}
