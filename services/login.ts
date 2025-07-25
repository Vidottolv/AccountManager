import api from './api';

export async function login(username: string, password: string) {
    // console.log('email ', username);
    // console.log('password ', password);
    const response = await api.post('/login', { username, password });
    console.log('response ', response.data)
    return response.data; 
}

export async function register(username: string, email: string, password: string) {
  console.log(username, email, password)
  const response = await api.post('/register', { username, email, password });
  console.log(response.data, response.status)
  if (response.status === 201) {
    console.log(username, password)
    login(username, password);
  }
  return response.data;
}
