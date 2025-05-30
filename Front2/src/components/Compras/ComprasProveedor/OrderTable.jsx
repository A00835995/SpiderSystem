import React, { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Button,
  Input,
  FlexBox,
  FlexBoxAlignItems,
  Icon,
  ValueState,
  MessageStrip,
  Toolbar,
  ToolbarSpacer,
  AnalyticalTable,
  Badge,
  IllustratedMessage,
  IllustrationMessageType
} from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// Importar componentes personalizados
import CustomDialog from '../components/Compras/ComprasProveedor/CustomDialog';
import OrderDetailsContent from '../components/Compras/ComprasProveedor/OrderDetailsContent';
import Pagination from '../components/Compras/ComprasProveedor/Pagination';
import ActionMenu from './ActionMenu';

const ComprasProveedor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionType, setActionType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setCompras([
        // ... (mantener los datos de ejemplo existentes)
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar compras según la búsqueda
  const filteredCompras = compras.filter(compra => 
    compra.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    compra.proveedor.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Función para manejar la paginación de forma segura
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      document.querySelector('.analyticalTable')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Funciones de utilidad
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  const getStatusValueState = (estado) => {
    switch(estado) {
      case 'pendiente': return ValueState.Warning;
      case 'en_proceso': return ValueState.Information;
      case 'en_transito': return ValueState.Information;
      case 'confirmada': return ValueState.Success;
      case 'completada': return ValueState.Success;
      case 'rechazada': return ValueState.Error;
      case 'cancelada': return ValueState.Error;
      default: return ValueState.Warning;
    }
  };

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

  const getPriorityBadgeColor = (prioridad) => {
    switch(prioridad) {
      case 'alta': return '3';
      case 'media': return '7';
      case 'baja': return '8';
      default: return '10';
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

  // Manejadores de eventos
  const handleViewDetails = (compra) => {
    setSelectedCompra(compra);
    setShowDetailsDialog(true);
  };

  const handleConfirmCompra = (compra) => {
    setSelectedCompra(compra);
    setActionType('confirm');
    setShowConfirmDialog(true);
  };

  const handleRejectCompra = (compra) => {
    setSelectedCompra(compra);
    setActionType('reject');
    setShowRejectDialog(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'confirm') {
      const updatedCompras = compras.map(compra => 
        compra.id === selectedCompra.id 
          ? { ...compra, estado: 'en_proceso' } 
          : compra
      );
      setCompras(updatedCompras);
      setShowConfirmDialog(false);
      setShowDetailsDialog(false);
      alert('Orden aceptada exitosamente');
    } else if (actionType === 'reject') {
      const updatedCompras = compras.filter(compra => compra.id !== selectedCompra.id);
      setCompras(updatedCompras);
      setShowRejectDialog(false);
      setShowDetailsDialog(false);
      alert('Orden rechazada exitosamente');
    }
    setSelectedCompra(null);
    setActionType(null);
  };

  const handleExportData = () => {
    const header = [
      'Número de Orden', 'Fecha de Pedido', 'Producto', 'Cantidad',
      'Estado', 'Prioridad', 'Fecha Límite', 'Notas',
      'Método de Envío', 'Dirección de Entrega', 'Proveedor', 'Total'
    ].join(',');
    
    const rows = filteredCompras.map(compra => [
      compra.id, compra.fecha, `"${compra.producto}"`, compra.cantidad,
      getStatusText(compra.estado), getPriorityText(compra.prioridad),
      compra.fechaLimite, `"${compra.notas}"`, `"${compra.metodoEnvio}"`,
      `"${compra.direccionEntrega}"`, `"${compra.proveedor}"`, compra.total
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

  return (
    <div style={{ 
      padding: '1.5rem',
      paddingTop: '6rem',
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: '#f5f5f5'
    }}>
      {/* Encabezado de la página */}
      <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ 
        marginBottom: '2rem',
        padding: '0.5rem 0'
      }}>
        <Icon name="shopping-cart" style={{ marginRight: '1rem', fontSize: '2rem', color: '#0854a0' }} />
        <Title level="H1" style={{ margin: 0, color: '#333' }}>Órdenes de Compra - Super Shoes</Title>
      </FlexBox>
      
      {/* Tarjeta principal de compras */}
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
          {/* Barra de herramientas */}
          <Toolbar style={{ marginBottom: '1.5rem', padding: '0.5rem 0' }}>
            <Button 
              icon="download"
              design="Emphasized"
              onClick={handleExportData}
              style={{
                backgroundColor: '#0854a0',
                color: 'white',
                padding: '0.5rem 1rem',
                height: 'auto'
              }}
            >
              Exportar Catálogo
            </Button>
            <ToolbarSpacer />
            <div style={{ position: 'relative', width: '300px' }}>
              <Input
                icon="search"
                placeholder="Buscar orden..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </Toolbar>
          
          {/* Tabla de órdenes */}
          <OrderTable
            currentItems={currentItems}
            itemsPerPage={itemsPerPage}
            formatDate={formatDate}
            getStatusText={getStatusText}
            getPriorityText={getPriorityText}
            getPriorityBadgeColor={getPriorityBadgeColor}
            handleViewDetails={handleViewDetails}
            handleRejectCompra={handleRejectCompra}
            handleConfirmCompra={handleConfirmCompra}
          />
          
          {/* Paginación */}
          {filteredCompras.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              filteredCompras={filteredCompras}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              setItemsPerPage={setItemsPerPage}
              paginate={paginate}
            />
          )}
        </div>
      </Card>

      {/* Diálogo de detalles */}
      <CustomDialog
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        title="Detalles de la Compra"
        footer={
          <FlexBox style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button 
              design="Default"
              onClick={() => setShowDetailsDialog(false)}
            >
              Cerrar
            </Button>
            {selectedCompra && selectedCompra.estado === 'pendiente' && (
              <>
                <Button 
                  design="Negative"
                  icon="decline"
                  onClick={() => {
                    setActionType('reject');
                    setShowRejectDialog(true);
                  }}
                  style={{ backgroundColor: '#bb0000', color: 'white' }}
                >
                  Rechazar Orden
                </Button>
                <Button 
                  design="Emphasized"
                  icon="accept"
                  onClick={() => {
                    setActionType('confirm');
                    setShowConfirmDialog(true);
                  }}
                  style={{ backgroundColor: '#0854a0', color: 'white' }}
                >
                  Aceptar
                </Button>
              </>
            )}
          </FlexBox>
        }
      >
        {selectedCompra && (
          <OrderDetailsContent
            selectedCompra={selectedCompra}
            formatDate={formatDate}
            getStatusValueState={getStatusValueState}
            getStatusText={getStatusText}
            getPriorityBadgeColor={getPriorityBadgeColor}
            getPriorityText={getPriorityText}
          />
        )}
      </CustomDialog>

      {/* Diálogo de confirmación */}
      <CustomDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="Aceptar Compra"
        width="500px"
        footer={
          <FlexBox style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button 
              design="Default"
              onClick={() => setShowConfirmDialog(false)}
              style={{ marginRight: '8px' }}
            >
              Cancelar
            </Button>
            <Button 
              design="Emphasized" 
              icon="accept"
              onClick={handleConfirmAction}
              style={{ backgroundColor: '#0854a0', color: 'white' }}
            >
              Aceptar
            </Button>
          </FlexBox>
        }
      >
        <div>
          <Text>¿Estás seguro que deseas aceptar la compra {selectedCompra?.id}?</Text>
          <MessageStrip
            design="Information"
            style={{ marginTop: '1rem' }}
          >
            Esta acción cambiará el estado de la compra a "En proceso"
          </MessageStrip>
        </div>
      </CustomDialog>

      {/* Diálogo de rechazo */}
      <CustomDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        title="Rechazar Compra"
        width="500px"
        footer={
          <FlexBox style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Button 
              design="Default"
              onClick={() => setShowRejectDialog(false)}
              style={{ marginRight: '8px' }}
            >
              Cancelar
            </Button>
            <Button 
              design="Negative" 
              icon="decline"
              onClick={handleConfirmAction}
              style={{ backgroundColor: '#bb0000', color: 'white' }}
            >
              Rechazar
            </Button>
          </FlexBox>
        }
      >
        <div>
          <Text>¿Estás seguro que deseas rechazar la compra {selectedCompra?.id}?</Text>
          <MessageStrip
            design="Warning"
            style={{ marginTop: '1rem' }}
          >
            Esta acción eliminará la compra del sistema
          </MessageStrip>
        </div>
      </CustomDialog>
    </div>
  );
};

export default ComprasProveedor;