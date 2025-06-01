import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import

const API = axios.create({
  baseURL: 'http://192.168.80.109:5000/api', // Asegúrate de que tu backend esté corriendo aquí
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
