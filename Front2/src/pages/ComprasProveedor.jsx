import React, { useState, useEffect } from 'react';
import { Card, Title, MessageStrip, IllustratedMessage, IllustrationMessageType } from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Importar componentes refactorizados
import ComprasProveedorHeader from '../components/comprasproveedor(Ordenes)/ComprasProveedorHeader';
import ComprasToolbar from '../components/comprasproveedor(Ordenes)/ComprasToolbar';
import ComprasTable from '../components/comprasproveedor(Ordenes)/ComprasTable';
import PaginationControls from '../components/comprasproveedor(Ordenes)/PaginationControls';
import DetailsDialog from '../components/comprasproveedor(Ordenes)/DetailsDialog';
import ConfirmDialog from '../components/comprasproveedor(Ordenes)/ConfirmDialog';
import OrderConfirmationDialog from '../components/Compras/OrderConfirmationDialog';

const ComprasProveedor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compras, setCompras] = useState([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [detalleOrdenCompra, setDetalleOrdenCompra] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionType, setActionType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Estado para el diálogo de confirmación
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationType, setConfirmationType] = useState('Success');
  const [confirmationTitle, setConfirmationTitle] = useState('');

  useEffect(() => {
    fetchOrdenesProveedor();
  }, []);

  // Función para obtener las órdenes de proveedor del backend
  const fetchOrdenesProveedor = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.ordenesProveedor}`;
      const response = await axios.get(url);
      
      if (response.data && response.data.data) {
        // Transformar los datos del backend al formato esperado por los componentes
        const ordenesFormateadas = response.data.data.map(orden => ({
          id: orden.IDORDEN.toString(),
          proveedor: orden.NOMPROV || "Proveedor Sin Nombre", // Usar el nombre del proveedor del backend
          fecha: orden.FECMOVTO,
          producto: "Por consultar", // Ya no viene del backend
          cantidad: 0, // Ya no viene del backend
          precioUnitario: 0, // Este dato no viene del backend
          total: 0, // Este dato no viene del backend
          estado: mapearEstado(orden.ORDSTATNOM),
          prioridad: "media", // Este dato no viene del backend
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
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.consultarOrdenCompra}`;
      const response = await axios.post(url, {
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
    // ORDSTATNOM del backend viene como "Pendiente", etc.
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

  // Filtrar compras según la búsqueda
  const filteredCompras = compras.filter(compra => 
    compra.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (compra.proveedor && compra.proveedor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    compra.producto.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Efecto para resetear a la primera página cuando se realiza una búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompras.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCompras.length / itemsPerPage);

  // Handlers para las acciones
  const handleViewDetails = (compra) => {
    setSelectedCompra(compra);
    
    // Consultar detalles usando solo el ID de la orden
    if (compra.id) {
      console.log(`Consultando detalles para orden ${compra.id}`);
      consultarDetalleOrden(compra.id);
    }
    
    setShowDetailsDialog(true);
  };

  const handleConfirmCompra = (compra) => {
    setSelectedCompra(compra);
    setActionType('confirm');
    setShowConfirmDialog(true);
  };

  const handleConfirmFromDetails = () => {
    setActionType('confirm');
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    try {
      // Mostrar estado de carga
      setLoading(true);
      
      // Llamar al endpoint para actualizar el estado
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarOrdenAProceso}`;
      const response = await axios.post(url, {
        IdOrden: parseInt(selectedCompra.id)
      });
      
      console.log('Respuesta de actualización:', response.data);
      
      // Actualizar el estado local
      const updatedCompras = compras.map(compra => 
        compra.id === selectedCompra.id 
          ? { ...compra, estado: 'en_proceso' } 
          : compra
      );
      setCompras(updatedCompras);
      
      // Mostrar mensaje de éxito
      setShowConfirmationDialog(true);
      setConfirmationMessage('Su orden ha sido actualizada exitosamente.');
      setConfirmationType('Success');
      setConfirmationTitle('¡Orden Actualizada!');
      
      // Cerrar diálogos y resetear estados
      setShowConfirmDialog(false);
      setShowDetailsDialog(false);
      
    } catch (error) {
      console.error('Error al confirmar la acción:', error);
      setShowConfirmationDialog(true);
      setConfirmationMessage('Error al procesar la solicitud. Por favor, intente nuevamente.');
      setConfirmationType('Error');
      setConfirmationTitle('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const getStatusText = (estado) => {
      switch(estado) {
        case 'pendiente': return 'Pendiente';
        case 'en_proceso': return 'En proceso';
        case 'en_transito': return 'En tránsito';
        case 'confirmada': return 'Confirmada';
        case 'completada': return 'Completada';
        case 'rechazada': return 'Rechazada';
        case 'cancelada': return 'Cancelada';
        default: return 'Pendiente';
      }
    };

    const getPriorityText = (prioridad) => {
      switch(prioridad) {
        case 'alta': return 'Alta';
        case 'media': return 'Media';
        case 'baja': return 'Baja';
        default: return prioridad;
      }
    };

    const header = [
      'Número de Orden',
      'Fecha de Pedido',
      'Producto',
      'Cantidad',
      'Estado',
      'Prioridad',
      'Fecha Límite',
      'Notas',
      'Método de Envío',
      'Dirección de Entrega',
      'Proveedor',
      'Total'
    ].join(',');
    
    const rows = filteredCompras.map(compra => [
      compra.id,
      compra.fecha,
      `"${compra.producto}"`,
      compra.cantidad,
      getStatusText(compra.estado),
      getPriorityText(compra.prioridad),
      compra.fechaLimite,
      `"${compra.notas}"`,
      `"${compra.metodoEnvio}"`,
      `"${compra.direccionEntrega}"`,
      `"${compra.proveedor}"`,
      compra.total
    ].join(','));
    
    const csv = [header, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ordenes_de_compra.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Renderizar mensaje de carga
  if (loading) {
    return (
      <div style={{ 
        padding: '1.5rem',
        paddingTop: '6rem',
        maxWidth: '100%',
        boxSizing: 'border-box',
        background: '#f5f5f5'
      }}>
        <ComprasProveedorHeader />
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <IllustratedMessage
            name={IllustrationMessageType.UploadToCloud}
            titleText="Cargando órdenes de compra"
            subtitleText="Por favor espere mientras obtenemos los datos..."
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '1.5rem',
      paddingTop: '6rem',
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: '#f5f5f5'
    }}>
      {/* Header */}
      <ComprasProveedorHeader />
      
      {/* Mensaje de error si existe */}
      {error && (
        <MessageStrip
          design="Negative"
          onClose={() => setError(null)}
          style={{ marginBottom: '1rem' }}
        >
          {error}
        </MessageStrip>
      )}
      
      {/* Tarjeta principal */}
      <Card 
        style={{ 
          marginBottom: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: '8px'
        }}
        header={
          <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
            <Title level="H4">Órdenes de Compra</Title>
          </div>
        }
      >
        <div style={{ padding: '1.5rem' }}>
          {/* Toolbar */}
          <ComprasToolbar 
            onExport={handleExportData}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={fetchOrdenesProveedor}
          />
          
          {/* Tabla */}
          <ComprasTable 
            data={currentItems}
            itemsPerPage={itemsPerPage}
            onViewDetails={handleViewDetails}
            onConfirmCompra={handleConfirmCompra}
          />
          
          {/* Paginación */}
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCompras.length}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
            }}
          />
        </div>
      </Card>

      {/* Diálogos */}
      <DetailsDialog 
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        selectedCompra={selectedCompra}
        onConfirm={handleConfirmFromDetails}
        detalleOrdenCompra={detalleOrdenCompra}
        loadingDetalle={loadingDetalle}
      />

      <ConfirmDialog 
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmAction}
        selectedCompra={selectedCompra}
      />

      <OrderConfirmationDialog
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
        message={confirmationMessage}
        type={confirmationType}
        title={confirmationTitle}
        ordenId={selectedCompra?.id}
      />
    </div>
  );
};

export default ComprasProveedor; 