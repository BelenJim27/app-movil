import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import

const API = axios.create({

  baseURL: 'https://api-server-zen2.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptor para añadir el token a cada petición
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token'); // token guardado en AsyncStorage tras login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default API;
