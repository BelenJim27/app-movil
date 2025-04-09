import axios from 'axios';

const API = axios.create({
  baseURL: 'http://10.168.113.245:5000/api', // Asegúrate de que tu backend esté corriendo aquí
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
