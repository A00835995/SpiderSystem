import { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/api';

export const useComprasProveedor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compras, setCompras] = useState([]);
  const [detalleOrdenCompra, setDetalleOrdenCompra] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    fetchOrdenesProveedor();
  }, []);

  // Función para obtener las órdenes de proveedor del backend
  const fetchOrdenesProveedor = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get(API_CONFIG.endpoints.ordenesProveedor);
      
      if (response.data && response.data.data) {
        // Transformar los datos del backend al formato esperado por los componentes
        const ordenesFormateadas = response.data.data.map(orden => ({
          id: orden.IDORDEN.toString(),
          proveedor: orden.NOMPROV || "Proveedor Sin Nombre",
          fecha: orden.FECMOVTO,
          producto: "Por consultar",
          cantidad: 0,
          precioUnitario: 0,
          total: 0,
          estado: mapearEstado(orden.ORDSTATNOM),
          prioridad: "media",
          fechaLimite: orden.FECHAENTREGA,
          notas: "-",
          metodoEnvio: "Por definir",
          direccionEntrega: "Super Shoes - Tienda Principal",
          detalles: {
            metodoPago: "Por definir",
            terminosPago: "Por definir"
          }
        }));
        
        setCompras(ordenesFormateadas);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al obtener órdenes de proveedor:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para consultar los detalles de una orden específica
  const consultarDetalleOrden = async (ordenId) => {
    setLoadingDetalle(true);
    setError(null);
    setDetalleOrdenCompra(null);
    
    try {
      const response = await axiosInstance.post(API_CONFIG.endpoints.consultarOrdenCompra, {
        IdOrden: parseInt(ordenId)
      });
      
      if (response.data && response.data.data) {
        setDetalleOrdenCompra(response.data.data);
      } else {
        console.warn('No se recibieron datos del detalle de la orden');
      }
    } catch (error) {
      console.error('Error al consultar detalle de orden:', error);
      setError('Error al cargar los detalles de la orden. Por favor, intente nuevamente.');
    } finally {
      setLoadingDetalle(false);
    }
  };

  // Función para mapear el estado del backend al formato esperado por los componentes
  const mapearEstado = (estadoBackend) => {
    switch(estadoBackend?.toLowerCase()) {
      case 'pendiente': return 'pendiente';
      case 'en proceso': return 'en_proceso';
      case 'en tránsito': return 'en_transito';
      case 'completada': return 'completada';
      case 'rechazada': return 'rechazada';
      case 'cancelada': return 'cancelada';
      default: return 'pendiente';
    }
  };

  return {
    loading,
    error,
    compras,
    detalleOrdenCompra,
    loadingDetalle,
    fetchOrdenesProveedor,
    consultarDetalleOrden,
    setError
  };
}; 