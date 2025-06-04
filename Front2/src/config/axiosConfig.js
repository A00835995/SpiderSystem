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
      
      // Solo mostrar logs para rutas específicas que causan problemas
      if (config.url.includes('/gestion/usuarios')) {
        console.log('🔒 Token añadido a petición usuarios:', token);
        console.log('📨 Headers completos:', JSON.stringify(config.headers));
        console.log('🌐 URL completa:', config.baseURL + config.url);
      }
    } else {
      console.warn('⚠️ No se encontró token para la petición:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si es un error de petición a la ruta de usuarios
    if (error.config && error.config.url && error.config.url.includes('/gestion/usuarios')) {
      console.error('❌ Error en petición a usuarios:', error.message);
      
      if (error.response) {
        console.error('📄 Respuesta del servidor:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Si es un error de autenticación, mostrar información detallada
        if (error.response.status === 401) {
          console.error('🔑 Error de autenticación (401). Verificando token...');
          const token = localStorage.getItem('token');
          
          if (!token) {
            console.error('🔒 No hay token almacenado en localStorage');
          } else {
            console.error('🔒 Token presente pero posiblemente inválido o expirado:', token);
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 