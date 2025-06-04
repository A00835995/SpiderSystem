import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

/**
 * Servicio para gestionar las operaciones de administración de usuarios
 */
export async function fetchUsuarios() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.usuarios);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('Error al obtener usuarios');
  }
}

export async function fetchUsuario(id) {
  try {
    const url = API_CONFIG.endpoints.usuario.replace(':id', id);
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error);
    throw new Error(`Error al obtener usuario con ID ${id}`);
  }
}

export async function crearUsuario(userData) {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.crearUsuario, userData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw new Error(`Error al crear usuario: ${error.message}`);
  }
}

export async function actualizarRolUsuario(id, rol) {
  try {
    const response = await axiosInstance.put(API_CONFIG.endpoints.actualizarRolUsuario, { id, rol });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    throw new Error(`Error al actualizar rol: ${error.message}`);
  }
}

export async function actualizarNombreUsuario(id, nombre) {
  try {
    const response = await axiosInstance.put(API_CONFIG.endpoints.actualizarNombreUsuario, { id, nombre });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar nombre:', error);
    throw new Error(`Error al actualizar nombre: ${error.message}`);
  }
}

export async function actualizarEmailUsuario(id, email) {
  try {
    const response = await axiosInstance.put(API_CONFIG.endpoints.actualizarEmailUsuario, { id, email });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar email:', error);
    throw new Error(`Error al actualizar email: ${error.message}`);
  }
}

export async function eliminarUsuario(id) {
  try {
    const response = await axiosInstance.delete(API_CONFIG.endpoints.eliminarUsuario, {
      data: { id }
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw new Error(`Error al eliminar usuario: ${error.message}`);
  }
}