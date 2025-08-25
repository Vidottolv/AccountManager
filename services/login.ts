import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export async function login(email: string, password: string) {
    // console.log('email ', username);
    // console.log('password ', password);
    const response = await api.post('/login', { email, password });
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

export async function changePwd(email: string, password: string, newPassword: string) {
  const response = await api.put('/changePassword', { email, password, newPassword })
  return response.data;
}

export async function checkAuth() {
  const token = await AsyncStorage.getItem("token");
  const response = await api.get('/checkauth', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
