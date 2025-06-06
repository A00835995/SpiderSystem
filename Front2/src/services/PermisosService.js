import { API_CONFIG } from '../config/api';

const API_BASE_URL = `${API_CONFIG.baseUrl}/permisos`;

// Obtener todos los roles
export const fetchRoles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`);
    if (!response.ok) {
      throw new Error('Error al obtener roles');
    }
    const data = await response.json();
    return data; // El DTO ya maneja la estructura de respuesta
  } catch (error) {
    console.error('Error en fetchRoles:', error);
    throw error;
  }
};

// Obtener todas las páginas
export const fetchPaginas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/paginas`);
    if (!response.ok) {
      throw new Error('Error al obtener páginas');
    }
    const data = await response.json();
    return data; // El DTO ya maneja la estructura de respuesta
  } catch (error) {
    console.error('Error en fetchPaginas:', error);
    throw error;
  }
};

// Obtener relación rol-página
export const fetchRolPagina = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rol-pagina`);
    if (!response.ok) {
      throw new Error('Error al obtener rol-página');
    }
    const data = await response.json();
    return data; // El DTO ya maneja la estructura de respuesta
  } catch (error) {
    console.error('Error en fetchRolPagina:', error);
    throw error;
  }
};

// Obtener páginas permitidas para un rol específico
export const fetchPaginasPermitidas = async (idRol) => {
  try {
    if (!idRol) {
      throw new Error('ID de rol es requerido');
    }
    
    const response = await fetch(`${API_BASE_URL}/paginas-permitidas/${idRol}`);
    if (!response.ok) {
      throw new Error('Error al obtener páginas permitidas');
    }
    const data = await response.json();
    return data; // El DTO ya maneja la estructura de respuesta
  } catch (error) {
    console.error('Error en fetchPaginasPermitidas:', error);
    throw error;
  }
};

// Verificar si un rol tiene permiso para una ruta específica
export const verificarPermiso = async (idRol, ruta) => {
  try {
    if (!idRol) {
      throw new Error('ID de rol es requerido');
    }
    
    if (!ruta) {
      throw new Error('Ruta es requerida');
    }
    
    // Codificar la ruta para manejar caracteres especiales como "/"
    const rutaCodificada = encodeURIComponent(ruta);
    const response = await fetch(`${API_BASE_URL}/verificar-permiso/${idRol}/${rutaCodificada}`);
    if (!response.ok) {
      throw new Error('Error al verificar permiso');
    }
    const data = await response.json();
    return data; // El DTO ya maneja la estructura de respuesta
  } catch (error) {
    console.error('Error en verificarPermiso:', error);
    throw error;
  }
}; 