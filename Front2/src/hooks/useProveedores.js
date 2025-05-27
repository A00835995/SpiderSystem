import { useState, useEffect, useCallback } from 'react';
import { 
  fetchProveedoresResumen, 
  fetchDetalleProveedor, 
  fetchTiposProveedores,
  fetchTiposPagosProveedores,
  crearProveedor as apiCrearProveedor, 
  actualizarNombreProveedor as apiActualizarNombre, 
  actualizarNombreContactoProveedor as apiActualizarNombreContacto,
  actualizarTelefonoProveedor as apiActualizarTelefono,
  actualizarEmailProveedor as apiActualizarEmail,
  actualizarDireccionProveedor as apiActualizarDireccion,
  actualizarTipoProveedor as apiActualizarTipo,
  actualizarTipoPagoProveedor as apiActualizarTipoPago,
  fetchResumenCategorias,
  fetchDistribucionProveedorInventario
} from '../services/ProveedoresService';

/**
 * Hook personalizado para gestionar las operaciones de proveedores
 * @returns {Object} Estado y funciones para administrar proveedores
 */
export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [tiposProveedores, setTiposProveedores] = useState([]);
  const [tiposPagos, setTiposPagos] = useState([]);
  const [resumenCategorias, setResumenCategorias] = useState([]);
  const [distribucionInventario, setDistribucionInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función para forzar una recarga de datos
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Cargar datos principales en paralelo
        const [
          proveedoresData,
          tiposData,
          tiposPagosData,
          categoriasData,
          distribucionData
        ] = await Promise.all([
          fetchProveedoresResumen(),
          fetchTiposProveedores(),
          fetchTiposPagosProveedores(),
          fetchResumenCategorias(),
          fetchDistribucionProveedorInventario()
        ]);

        setProveedores(proveedoresData);
        setTiposProveedores(tiposData);
        setTiposPagos(tiposPagosData);
        setResumenCategorias(categoriasData);
        setDistribucionInventario(distribucionData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [refreshTrigger]);

  /**
   * Obtiene los datos de un proveedor específico
   * @param {number} id - ID del proveedor
   * @returns {Promise<Object>} Datos del proveedor
   */
  const getProveedor = async (id) => {
    try {
      return await fetchDetalleProveedor(id);
    } catch (err) {
      setError('Error al obtener el proveedor: ' + err.message);
      throw err;
    }
  };

  /**
   * Crea un nuevo proveedor
   * @param {Object} proveedorData - Datos del nuevo proveedor
   * @returns {Promise<Object>} Resultado de la operación
   */
  const crearProveedor = async (proveedorData) => {
    try {
      const result = await apiCrearProveedor(proveedorData);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al crear el proveedor: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el nombre de un proveedor
   * @param {number} id - ID del proveedor
   * @param {string} nombre - Nuevo nombre
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarNombreProveedor = async (id, nombre) => {
    try {
      const result = await apiActualizarNombre(id, nombre);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el nombre del proveedor: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el nombre del contacto de un proveedor
   * @param {number} id - ID del proveedor
   * @param {string} nombreContacto - Nuevo nombre del contacto
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarNombreContactoProveedor = async (id, nombreContacto) => {
    try {
      const result = await apiActualizarNombreContacto(id, nombreContacto);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el nombre del contacto: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el email de un proveedor
   * @param {number} id - ID del proveedor
   * @param {string} email - Nuevo email
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarEmailProveedor = async (id, email) => {
    try {
      const result = await apiActualizarEmail(id, email);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el email del proveedor: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el teléfono de un proveedor
   * @param {number} id - ID del proveedor
   * @param {string} telefono - Nuevo teléfono
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarTelefonoProveedor = async (id, telefono) => {
    try {
      const result = await apiActualizarTelefono(id, telefono);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el teléfono del proveedor: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza la dirección de un proveedor
   * @param {number} id - ID del proveedor
   * @param {string} direccion - Nueva dirección
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarDireccionProveedor = async (id, direccion) => {
    try {
      const result = await apiActualizarDireccion(id, direccion);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar la dirección del proveedor: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el tipo de un proveedor
   * @param {number} id - ID del proveedor
   * @param {number} idTipoProveedor - ID del nuevo tipo
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarTipoProveedor = async (id, idTipoProveedor) => {
    try {
      const result = await apiActualizarTipo(id, idTipoProveedor);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el tipo de proveedor: ' + err.message);
      throw err;
    }
  };

  /**
   * Actualiza el tipo de pago de un proveedor
   * @param {number} id - ID del proveedor
   * @param {number} idPago - ID del nuevo tipo de pago
   * @returns {Promise<Object>} Resultado de la operación
   */
  const actualizarTipoPagoProveedor = async (id, idPago) => {
    try {
      const result = await apiActualizarTipoPago(id, idPago);
      refreshData();
      return result;
    } catch (err) {
      setError('Error al actualizar el tipo de pago: ' + err.message);
      throw err;
    }
  };

  /**
   * Recarga solo los proveedores (útil para actualizaciones específicas)
   * @returns {Promise<void>}
   */
  const recargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await fetchProveedoresResumen();
      setProveedores(data);
      setError(null);
    } catch (err) {
      setError('Error al recargar proveedores: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recarga solo los datos de análisis (categorías y distribución)
   * @returns {Promise<void>}
   */
  const recargarAnalisis = async () => {
    try {
      const [categoriasData, distribucionData] = await Promise.all([
        fetchResumenCategorias(),
        fetchDistribucionProveedorInventario()
      ]);
      
      setResumenCategorias(categoriasData);
      setDistribucionInventario(distribucionData);
      setError(null);
    } catch (err) {
      setError('Error al recargar datos de análisis: ' + err.message);
      console.error(err);
    }
  };

  return {
    // Estados
    proveedores,
    tiposProveedores,
    tiposPagos,
    resumenCategorias,
    distribucionInventario,
    loading,
    error,
    
    // Funciones de consulta
    getProveedor,
    
    // Funciones de creación
    crearProveedor,
    
    // Funciones de actualización
    actualizarNombreProveedor,
    actualizarNombreContactoProveedor,
    actualizarTelefonoProveedor,
    actualizarDireccionProveedor,
    actualizarEmailProveedor,
    actualizarTipoProveedor,
    actualizarTipoPagoProveedor,
    
    // Funciones de recarga
    refreshData,
    recargarProveedores,
    recargarAnalisis
  };
}
