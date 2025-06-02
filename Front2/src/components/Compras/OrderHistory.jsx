import React, { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Button,
  Icon,
  AnalyticalTable,
  BusyIndicator,
  FlexBox,
  Select,
  Option,
  Bar,
  Label
} from '@ui5/webcomponents-react';
import axiosInstance from '../../config/axiosConfig';
import { API_CONFIG } from '../../config/api';
import DetailsDialog from '../comprasproveedor(Ordenes)/DetailsDialog';
import OrderFilterBar from './OrderFilterBar';

const OrderHistory = ({ onClose }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [completingOrder, setCompletingOrder] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrdenesEnProgreso();
  }, []);

  // Efecto para filtrar las órdenes cuando cambia el filtro o las órdenes
  useEffect(() => {
    filterOrders();
  }, [selectedFilter, orderHistory]);

  // Función para filtrar las órdenes según el estado seleccionado
  const filterOrders = () => {
    if (selectedFilter === "todos") {
      setFilteredOrders(orderHistory);
      return;
    }

    const filtered = orderHistory.filter(order => {
      const normalizedStatus = order.estado.toLowerCase().replace(/ /g, '_');
      return normalizedStatus === selectedFilter;
    });

    setFilteredOrders(filtered);
  };

  const fetchOrdenesEnProgreso = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_CONFIG.endpoints.compras.ordenesProgreso);
      
      if (response.data && response.data.data) {
        // Transformar los datos al formato esperado por la tabla
        const formattedOrders = response.data.data.map(order => ({
          id: order.id,
          proveedor: order.proveedor,
          estado: order.estado,
          // Agregamos campos adicionales necesarios para el DetailsDialog
          fecha: new Date().toISOString(),
          fechaLimite: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          direccionEntrega: "Super Shoes - Tienda Principal",
          detalles: {
            metodoPago: "Crédito Corporativo"
          }
        }));
        
        setOrderHistory(formattedOrders);
      } else {
        setOrderHistory([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error al obtener órdenes en progreso:', err);
      setError('Error al cargar el historial de órdenes. Por favor, inténtalo de nuevo.');
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (order) => {
    try {
      setSelectedOrder(order);
      setLoadingDetail(true);
      setShowDetailDialog(true);
      
      // Llamar al endpoint para consultar detalles de la orden
      const response = await axiosInstance.post(API_CONFIG.endpoints.consultarOrdenCompra, {
        IdOrden: parseInt(order.id)
      });
      
      if (response.data && response.data.data) {
        setOrderDetail(response.data.data);
      } else {
        setOrderDetail(null);
      }
    } catch (err) {
      console.error('Error al obtener detalle de orden:', err);
      setOrderDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetailDialog(false);
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  // Nueva función para completar una orden
  const handleCompleteOrder = async (orderId) => {
    try {
      setCompletingOrder(true);
      
      // Llamar al endpoint para completar la orden
      const response = await axiosInstance.post(API_CONFIG.endpoints.compras.completarOrden, {
        IdOrden: parseInt(orderId)
      });
      
      if (response.data && response.data.success) {
        // Mostrar mensaje de éxito
        alert("Orden completada exitosamente. El inventario ha sido actualizado.");
        // Cerrar el diálogo si está abierto
        if (showDetailDialog) {
          handleCloseDetail();
        }
        // Actualizar la lista de órdenes
        fetchOrdenesEnProgreso();
      } else {
        throw new Error(response.data?.message || "Error al completar la orden");
      }
    } catch (err) {
      console.error('Error al completar la orden:', err);
      alert("Error al completar la orden. Por favor, inténtalo de nuevo.");
    } finally {
      setCompletingOrder(false);
    }
  };

  // Función para mostrar el color según el estado
  const getStatusColor = (status) => {
    // Normalizar el estado para manejar diferentes formatos (mayúsculas, espacios, etc.)
    const normalizedStatus = status.toLowerCase().replace(/ /g, '_');
    
    switch (normalizedStatus) {
      case 'en_proceso':
      case 'en proceso':
        return '#0a6ed1'; // Azul
      case 'completada':
      case 'completado':
        return '#107e3e'; // Verde
      case 'pendiente':
        return '#e9730c'; // Naranja
      case 'cancelada':
      case 'rechazada':
        return '#bb0000'; // Rojo
      default:
        return '#6a6d70'; // Gris para estados desconocidos
    }
  };

  // Función para manejar el cambio de filtro
  const handleFilterChange = (event) => {
    setSelectedFilter(event.detail.selectedOption.dataset.value);
  };

  // Cálculo de paginación
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPageData = filteredOrders.slice(startIndex, endIndex);

  // Manejador para cambiar el tamaño de página
  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.detail.selectedOption.textContent);
    setPageSize(newPageSize);
    setCurrentPage(1); // Resetear a la primera página cuando cambia el tamaño
  };

  // Manejador para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: 'var(--sapList_Background)',
      borderRadius: '0.5rem',
      boxShadow: 'var(--sapContent_Shadow0)',
      margin: '0 2rem 2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <Title level="H1">Órdenes en Progreso</Title>
        <Button 
          icon="decline"
          design="Transparent"
          onClick={onClose}
          tooltip="Cerrar"
        />
      </div>

      {/* Filtro por estado usando el componente OrderFilterBar */}
      <OrderFilterBar 
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        onRefresh={fetchOrdenesEnProgreso}
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <BusyIndicator active size="Medium" />
        </div>
      ) : error ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--sapErrorColor)'
        }}>
          <Icon 
            name="error"
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: 'var(--sapErrorColor)'
            }}
          />
          <Text>{error}</Text>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--sapContent_LabelColor)'
        }}>
          <Icon 
            name="document"
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: 'var(--sapContent_NonInteractiveIconColor)'
            }}
          />
          <Text>
            {selectedFilter === "todos" 
              ? "No hay órdenes disponibles" 
              : `No hay órdenes con estado "${selectedFilter.replace('_', ' ')}"`}
          </Text>
        </div>
      ) : (
        <>
          <AnalyticalTable
            data={currentPageData}
            columns={[
              {
                Header: "Orden #",
                accessor: "id",
                width: 120
              },
              {
                Header: "Proveedor",
                accessor: "proveedor"
              },
              {
                Header: "Estado",
                accessor: "estado",
                width: 150,
                Cell: ({ value }) => (
                  <div style={{
                    backgroundColor: getStatusColor(value),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}>
                    {value}
                  </div>
                )
              },
              {
                Header: "Acciones",
                accessor: "actions",
                width: 180,
                Cell: ({ row }) => (
                  <FlexBox>
                    <Button 
                      icon="information"
                      design="Transparent"
                      tooltip="Ver detalles"
                      onClick={() => handleViewDetail(row.original)}
                      style={{ color: 'var(--sapInformationColor)' }}
                    />
                    {row.original.estado.toLowerCase().includes('proceso') && (
                      <Button 
                        icon="complete"
                        design="Transparent"
                        tooltip="Completar orden"
                        onClick={() => {
                          if (window.confirm("¿Estás seguro de que quieres completar esta orden? Esta acción actualizará el inventario.")) {
                            handleCompleteOrder(row.original.id);
                          }
                        }}
                        style={{ color: '#107e3e' }}
                        disabled={completingOrder}
                      />
                    )}
                  </FlexBox>
                )
              }
            ]}
            alternateRowColor
            visibleRows={pageSize}
          />

          {/* Barra de paginación */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '1rem',
            padding: '0.5rem 0'
          }}>
            {/* Selector de elementos por página */}
            <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
              <Label>Elementos por página:</Label>
              <Select onChange={handlePageSizeChange} style={{ width: '5rem' }}>
                <Option selected={pageSize === 5}>5</Option>
                <Option selected={pageSize === 10}>10</Option>
                <Option selected={pageSize === 15}>15</Option>
                <Option selected={pageSize === 20}>20</Option>
              </Select>
            </FlexBox>

            {/* Navegación de páginas */}
            <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
              <Button 
                icon="nav-back" 
                design="Transparent" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
              
              {totalPages <= 5 ? (
                // Mostrar todos los números de página si hay 5 o menos
                Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    design={currentPage === i + 1 ? "Emphasized" : "Transparent"}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))
              ) : (
                // Lógica para mostrar páginas con elipsis
                <>
                  {currentPage > 1 && (
                    <Button
                      design="Transparent"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </Button>
                  )}
                  
                  {currentPage > 3 && <span>...</span>}
                  
                  {currentPage > 2 && (
                    <Button
                      design="Transparent"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </Button>
                  )}
                  
                  <Button design="Emphasized">
                    {currentPage}
                  </Button>
                  
                  {currentPage < totalPages - 1 && (
                    <Button
                      design="Transparent"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </Button>
                  )}
                  
                  {currentPage < totalPages - 2 && <span>...</span>}
                  
                  {currentPage < totalPages && (
                    <Button
                      design="Transparent"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </>
              )}
              
              <Button 
                icon="nav-forward" 
                design="Transparent" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </FlexBox>

            {/* Información de paginación */}
            <Text>
              {startIndex + 1} - {endIndex} de {totalItems}
            </Text>
          </div>
        </>
      )}

      {/* Utilizar el componente DetailsDialog existente */}
      <DetailsDialog
        isOpen={showDetailDialog}
        onClose={handleCloseDetail}
        selectedCompra={selectedOrder}
        detalleOrdenCompra={orderDetail}
        loadingDetalle={loadingDetail}
        onConfirm={() => {
          // Podemos implementar una acción de confirmación aquí si es necesario
          handleCloseDetail();
        }}
        onComplete={() => {
          // Implementar acción de completar orden desde el diálogo
          if (selectedOrder) {
            if (window.confirm("¿Estás seguro de que quieres completar esta orden? Esta acción actualizará el inventario.")) {
              handleCompleteOrder(selectedOrder.id);
            }
          }
        }}
      />
    </div>
  );
};

export default OrderHistory;