import { useState, useEffect, useCallback } from 'react';
import { 
  fetchUsuarios, 
  fetchUsuario, 
  crearUsuario as apiCrearUsuario, 
  actualizarRolUsuario as apiActualizarRol, 
  actualizarNombreUsuario as apiActualizarNombre, 
  actualizarEmailUsuario as apiActualizarEmail, 
  eliminarUsuario as apiEliminarUsuario 
} from '../services/AdminService';

/**
 * Hook personalizado para gestionar las operaciones de administración de usuarios
 * @returns {Object} Estado y funciones para administrar usuarios
 */
export function useAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función para forzar una recarga de datos
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Cargar usuarios al iniciar
  useEffect(() => {
    const cargarUsuarios = async () => {
      setLoading(true);
      try {
        const data = await fetchUsuarios();
        setUsuarios(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los usuarios: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, [refreshTrigger]);

  /**
   * Obtiene los datos de un usuario específico
   * @param {number} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  const getUsuario = async (id) => {
    try {
      return await fetchUsuario(id);
    } catch (err) {
      setError('Error al obtener el usuario: ' + err.message);
      throw err;
    }
  };

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  const crearUsuario = async (userData) => {
    try {
      const result = await apiCrearUsuario(userData);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al crear el usuario: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el rol de un usuario
   * @param {number} id - ID del usuario
   * @param {string} rol - Nuevo rol
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarRolUsuario = async (id, rol) => {
    try {
      const result = await apiActualizarRol(id, rol);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el rol: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el nombre de un usuario
   * @param {number} id - ID del usuario
   * @param {string} nombre - Nuevo nombre
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarNombreUsuario = async (id, nombre) => {
    try {
      const result = await apiActualizarNombre(id, nombre);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el nombre: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el email de un usuario
   * @param {number} id - ID del usuario
   * @param {string} email - Nuevo email
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarEmailUsuario = async (id, email) => {
    try {
      const result = await apiActualizarEmail(id, email);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el email: ' + err.message);
      throw err;
    }
  };

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise<Object>} Resultado de la operación
   */
  const eliminarUsuario = async (id) => {
    try {
      const result = await apiEliminarUsuario(id);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al eliminar el usuario: ' + err.message);
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    error,
    getUsuario,
    crearUsuario,
    actualizarRolUsuario,
    actualizarNombreUsuario,
    actualizarEmailUsuario,
    eliminarUsuario,
    refreshData
  };
} 