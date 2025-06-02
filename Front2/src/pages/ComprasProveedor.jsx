import React from 'react';
import { Card, Title, MessageStrip, IllustratedMessage, IllustrationMessageType } from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';

// Importar componentes refactorizados
import ComprasProveedorHeader from '../components/comprasproveedor(Ordenes)/ComprasProveedorHeader';
import ComprasToolbar from '../components/comprasproveedor(Ordenes)/ComprasToolbar';
import ComprasTable from '../components/comprasproveedor(Ordenes)/ComprasTable';
import PaginationControls from '../components/comprasproveedor(Ordenes)/PaginationControls';
import DetailsDialog from '../components/comprasproveedor(Ordenes)/DetailsDialog';
import ConfirmDialog from '../components/comprasproveedor(Ordenes)/ConfirmDialog';
import OrderConfirmationDialog from '../components/Compras/OrderConfirmationDialog';

// Importar hooks personalizados
import { useComprasProveedor } from '../hooks/useComprasProveedor';
import { usePaginationSearch } from '../hooks/usePaginationSearch';
import { useDialogs } from '../hooks/useDialogs';
import { useExportData } from '../hooks/useExportData';

const ComprasProveedor = () => {
  const navigate = useNavigate();
  
  // Usar hooks personalizados
  const { 
    loading: comprasLoading, 
    error, 
    compras, 
    detalleOrdenCompra, 
    loadingDetalle, 
    fetchOrdenesProveedor, 
    consultarDetalleOrden, 
    setError 
  } = useComprasProveedor();
  
  const {
    currentItems,
    totalPages,
    currentPage,
    itemsPerPage,
    searchQuery,
    filteredItems,
    indexOfFirstItem,
    indexOfLastItem,
    setSearchQuery,
    handlePageChange,
    handleItemsPerPageChange
  } = usePaginationSearch(compras);
  
  const {
    showDetailsDialog,
    showConfirmDialog,
    selectedCompra,
    showConfirmationDialog,
    confirmationMessage,
    confirmationType,
    confirmationTitle,
    loading: dialogLoading,
    handleViewDetails,
    handleConfirmCompra,
    handleConfirmFromDetails,
    handleConfirmAction,
    closeDetailsDialog,
    closeConfirmDialog,
    closeConfirmationDialog
  } = useDialogs(compras, (updatedCompras) => {
    // Esta función actualiza las compras y podríamos llamar a fetchOrdenesProveedor,
    // pero no es necesario porque useDialogs ya actualiza el estado local
  });
  
  const { handleExportData } = useExportData();
  
  // Función combinada para manejar la visualización de detalles
  const onViewDetails = (compra) => {
    handleViewDetails(compra, consultarDetalleOrden);
  };
  
  // Función combinada para exportar datos
  const onExportData = () => {
    handleExportData(filteredItems);
  };

  // Renderizar mensaje de carga
  const loading = comprasLoading || dialogLoading;
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
            onExport={onExportData}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={fetchOrdenesProveedor}
          />
          
          {/* Tabla */}
          <ComprasTable 
            data={currentItems}
            itemsPerPage={itemsPerPage}
            onViewDetails={onViewDetails}
            onConfirmCompra={handleConfirmCompra}
          />
          
          {/* Paginación */}
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredItems.length}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </Card>

      {/* Diálogos */}
      <DetailsDialog 
        isOpen={showDetailsDialog}
        onClose={closeDetailsDialog}
        selectedCompra={selectedCompra}
        onConfirm={handleConfirmFromDetails}
        detalleOrdenCompra={detalleOrdenCompra}
        loadingDetalle={loadingDetalle}
      />

      <ConfirmDialog 
        isOpen={showConfirmDialog}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmAction}
        selectedCompra={selectedCompra}
      />

      <OrderConfirmationDialog
        open={showConfirmationDialog}
        onClose={closeConfirmationDialog}
        message={confirmationMessage}
        type={confirmationType}
        title={confirmationTitle}
        ordenId={selectedCompra?.id}
      />
    </div>
  );
};

export default ComprasProveedor; 