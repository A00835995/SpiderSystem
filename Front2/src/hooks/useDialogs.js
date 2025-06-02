import { useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/api';

export const useDialogs = (compras, setCompras) => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [actionType, setActionType] = useState(null);
  
  // Estado para el diálogo de confirmación
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationType, setConfirmationType] = useState('Success');
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Handlers para las acciones
  const handleViewDetails = (compra, consultarDetalleOrden) => {
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
      
      const response = await axiosInstance.post(API_CONFIG.endpoints.actualizarOrdenAProceso, {
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

  const closeDetailsDialog = () => setShowDetailsDialog(false);
  const closeConfirmDialog = () => setShowConfirmDialog(false);
  const closeConfirmationDialog = () => setShowConfirmationDialog(false);

  return {
    showDetailsDialog,
    showConfirmDialog,
    selectedCompra,
    actionType,
    showConfirmationDialog,
    confirmationMessage,
    confirmationType,
    confirmationTitle,
    loading,
    handleViewDetails,
    handleConfirmCompra,
    handleConfirmFromDetails,
    handleConfirmAction,
    closeDetailsDialog,
    closeConfirmDialog,
    closeConfirmationDialog
  };
}; 