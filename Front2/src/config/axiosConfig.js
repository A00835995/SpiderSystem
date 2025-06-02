import axios from 'axios';
import { API_CONFIG } from './api';

// Crear una instancia de axios con la URL base
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl
});

// Interceptor para agregar el token de autorización a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token almacenado en localStorage
    const token = localStorage.getItem('token');
    
    // Si existe un token, agregarlo al header de autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado a la petición:', token.substring(0, 20) + '...');
      console.log('URL de la petición:', config.url);
    } else {
      console.warn('No se encontró token para la petición');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 