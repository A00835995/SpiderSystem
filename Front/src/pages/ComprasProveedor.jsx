import React, { useState, useContext } from "react";
import { ThemeContext } from "../App";
import UI5ThemeProvider from "../components/UI5ThemeProvider";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import {
  Container,
  PageHeader,
  PageTitle,
  ContentArea,
  Card,
  CardContent,
  Table,
  StatusIndicator,
  Button,
  ToolbarSection,
  SearchContainer,
  SearchInput,
  Pagination,
  PageButton,
  DialogBackdrop,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  FormLabel,
  Badge,
  ThemeToggle
} from "../styles/GestionDeProveedores/Gestion_de_Proveedores";
import { MdSearch, MdOutlineShoppingCart, MdFileDownload, MdSort } from 'react-icons/md';

// Define a GlobalStyle component for this page
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--sapFontFamily, "72", "72full", Arial, Helvetica, sans-serif);
  }
`;

// Custom styled components
const ExportButton = styled(Button)`
  background-color: ${props => props.theme.isDarkTheme ? '#0A6ED1' : '#0854a0'};
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.isDarkTheme ? '#085caf' : '#074888'};
  }
`;

const SortableHeader = styled.th`
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: relative;
  
  &:hover {
    background-color: ${props => props.theme.isDarkTheme ? '#333' : '#e6e6e6'};
  }
`;

const SortIcon = styled.span`
  display: inline-block;
  margin-left: 4px;
`;

const DetailPopup = styled.div`
  position: absolute;
  background-color: ${props => props.theme.isDarkTheme ? '#3d3d3d' : 'white'};
  border: 1px solid ${props => props.theme.isDarkTheme ? '#555' : '#e0e0e0'};
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 100;
  width: 300px;
  bottom: 0;
  right: 50%;
  transform: translateY(100%);
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 8px;
  font-size: 0.8rem;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: ${props => props.theme.isDarkTheme ? '#ccc' : '#666'};
`;

const DetailValue = styled.div`
  color: ${props => props.theme.isDarkTheme ? 'white' : 'black'};
`;

// Shoe icon for product display
const ShoeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7z"></path>
    <path d="M2 9c1-1 4-2 8-2s7 1 8 2"></path>
    <path d="M2 13c1-1 4-1 8-1s7 0 8 1"></path>
  </svg>
);

// Icons for theme toggle
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

// Sample data for orders
const ordersData = [
  {
    id: "OC-2025-001",
    date: "2025-02-15",
    product: "Zapatillas Deportivas Premium",
    quantity: 50,
    status: "pendiente",
    priority: "alta",
    dueDate: "2025-02-20",
    notes: "Urgente - Temporada nueva",
    shippingMethod: "Transportadora XYZ",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Calzado Deportivo Premium"
  },
  {
    id: "OC-2025-002",
    date: "2025-02-14",
    product: "Mocasines Elegance",
    quantity: 30,
    status: "en_proceso",
    priority: "media",
    dueDate: "2025-02-22",
    notes: "-",
    shippingMethod: "Transportadora ABC",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Distribuidora de Zapatos Elegance"
  },
  {
    id: "OC-2025-003",
    date: "2025-02-13",
    product: "Botas de Cuero Importadas",
    quantity: 25,
    status: "en_transito",
    priority: "baja",
    dueDate: "2025-02-25",
    notes: "-",
    shippingMethod: "Transportadora LMN",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Importadora Footwear Internacional"
  },
  {
    id: "OC-2025-004",
    date: "2025-02-12",
    product: "Zapatos Formales Modelo Ejecutivo",
    quantity: 40,
    status: "pendiente",
    priority: "alta",
    dueDate: "2025-02-18",
    notes: "Cliente corporativo",
    shippingMethod: "DHL Express",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Zapatos y Complementos Moda Total"
  },
  {
    id: "OC-2025-005",
    date: "2025-02-11",
    product: "Sandalias Verano Casual",
    quantity: 75,
    status: "en_transito",
    priority: "baja",
    dueDate: "2025-02-28",
    notes: "Colección verano",
    shippingMethod: "Transportadora XYZ",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Calzado Deportivo Premium"
  },
  {
    id: "OC-2025-006",
    date: "2025-02-10",
    product: "Tenis Running Pro",
    quantity: 50,
    status: "completada",
    priority: "media",
    dueDate: "2025-02-15",
    notes: "Factura enviada",
    shippingMethod: "Transportadora ABC",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Importadora Footwear Internacional"
  },
  {
    id: "OC-2025-007",
    date: "2025-02-09",
    product: "Zapatos Infantiles Colección Escolar",
    quantity: 60,
    status: "en_proceso",
    priority: "alta",
    dueDate: "2025-02-21",
    notes: "Temporada escolar",
    shippingMethod: "UPS",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Distribuidora de Zapatos Elegance"
  },
  {
    id: "OC-2025-008",
    date: "2025-02-08",
    product: "Zapatillas Casuales Urbanas",
    quantity: 45,
    status: "pendiente",
    priority: "media",
    dueDate: "2025-02-19",
    notes: "Urgente - Stock bajo",
    shippingMethod: "Transportadora LMN",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Zapatos y Complementos Moda Total"
  },
  {
    id: "OC-2025-009",
    date: "2025-02-07",
    product: "Botines Dama Temporada Otoño",
    quantity: 35,
    status: "completada",
    priority: "baja",
    dueDate: "2025-02-12",
    notes: "Enviado a tienda",
    shippingMethod: "DHL Express",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Importadora Footwear Internacional"
  },
  {
    id: "OC-2025-010",
    date: "2025-02-06",
    product: "Tenis Deportivos High-Performance",
    quantity: 30,
    status: "en_transito",
    priority: "alta",
    dueDate: "2025-02-20",
    notes: "Modelo exclusivo",
    shippingMethod: "Transportadora XYZ",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Calzado Deportivo Premium"
  },
  {
    id: "OC-2025-011",
    date: "2025-02-05",
    product: "Zapatos de Piel Ejecutivo Plus",
    quantity: 25,
    status: "en_proceso",
    priority: "media",
    dueDate: "2025-02-18",
    notes: "Cliente frecuente",
    shippingMethod: "Transportadora ABC",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Distribuidora de Zapatos Elegance"
  },
  {
    id: "OC-2025-012",
    date: "2025-02-04",
    product: "Colección Zapatos de Fiesta",
    quantity: 40,
    status: "pendiente",
    priority: "alta",
    dueDate: "2025-02-22",
    notes: "Temporada eventos",
    shippingMethod: "UPS",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Zapatos y Complementos Moda Total"
  },
  {
    id: "OC-2025-013",
    date: "2025-02-03",
    product: "Zapatillas Deportivas Niños",
    quantity: 55,
    status: "en_transito",
    priority: "baja",
    dueDate: "2025-02-25",
    notes: "Factura enviada",
    shippingMethod: "Transportadora LMN",
    deliveryAddress: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
    provider: "Calzado Deportivo Premium"
  }
];

// Add some shoe store themed styling
const ProductCell = styled.td`
  font-weight: 500;
  color: ${props => props.theme.isDarkTheme ? '#4dabf7' : '#0854a0'};
`;

const QuantityBadge = styled.span`
  background-color: ${props => props.theme.isDarkTheme ? '#333' : '#f8f9fa'};
  border: 1px solid ${props => props.theme.isDarkTheme ? '#444' : '#dee2e6'};
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  margin-left: 6px;
`;

export function ComprasProveedor() {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";
  const toggleTheme = () => setTheme(isDarkTheme ? "light" : "dark");
  
  const [orders, setOrders] = useState(ordersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [activeDetailId, setActiveDetailId] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState(null);
  
  const itemsPerPage = 8;

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort orders based on the selected field and direction
  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    // Handle special cases for date fields
    if (sortField === 'date' || sortField === 'dueDate') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }
    
    // Handle numeric fields
    if (sortField === 'quantity') {
      valueA = Number(valueA);
      valueB = Number(valueB);
    }
    
    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter orders based on search query
  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Handle order details view
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Handle approve order
  const handleApproveOrder = () => {
    if (selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'en_proceso' } 
          : order
      ));
      
      // Update selected order for the dialog display
      setSelectedOrder({...selectedOrder, status: 'en_proceso'});
      setShowConfirmationDialog(false);
    }
  };

  // Handle reject order
  const handleRejectOrder = () => {
    if (selectedOrder) {
      setOrders(orders.filter(order => order.id !== selectedOrder.id));
      setShowConfirmationDialog(false);
      setShowOrderDetails(false);
    }
  };

  // Show confirmation dialog
  const showConfirmation = (actionType) => {
    setConfirmActionType(actionType);
    setShowConfirmationDialog(true);
  };

  // Export to CSV
  const handleExportData = () => {
    const header = [
      'Orden #',
      'Fecha de Pedido',
      'Producto',
      'Cantidad',
      'Estado',
      'Prioridad',
      'Fecha Límite',
      'Notas',
      'Método de Envío',
      'Dirección de Entrega'
    ].join(',');
    
    const rows = filteredOrders.map(order => [
      order.id,
      order.date,
      `"${order.product}"`,
      order.quantity,
      order.status,
      order.priority,
      order.dueDate,
      `"${order.notes}"`,
      `"${order.shippingMethod}"`,
      `"${order.deliveryAddress}"`
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

  // Get status display name
  const getStatusDisplayName = (status) => {
    switch(status) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En proceso';
      case 'en_transito': return 'En tránsito';
      case 'completada': return 'Completada';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pendiente': return 'warning';
      case 'en_proceso': return 'info';
      case 'en_transito': return 'info';
      case 'completada': return 'success';
      default: return '';
    }
  };

  // Get priority display name
  const getPriorityDisplayName = (priority) => {
    switch(priority) {
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return priority;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baja': return 'info';
      default: return '';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Toggle order detail popup
  const toggleOrderDetail = (orderId) => {
    if (activeDetailId === orderId) {
      setActiveDetailId(null);
    } else {
      setActiveDetailId(orderId);
    }
  };

  return (
    <UI5ThemeProvider>
      <GlobalStyle />
      <Container>
        <ContentArea>
          <PageHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MdOutlineShoppingCart size={24} />
              <PageTitle>Órdenes de Compra - Super Shoes</PageTitle>
            </div>
          </PageHeader>

          <Card>
            <CardContent>
              <ToolbarSection>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <ExportButton onClick={handleExportData}>
                    <MdFileDownload style={{ marginRight: '8px' }} />
                    Exportar Catálogo
                  </ExportButton>
                </div>

                <SearchContainer>
                  <MdSearch size={18} />
                  <SearchInput 
                    type="text" 
                    placeholder="Buscar orden..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </SearchContainer>
              </ToolbarSection>

              <Table style={{ marginTop: '16px' }}>
                <thead>
                  <tr>
                    <SortableHeader onClick={() => handleSort('id')}>
                      # Orden
                      {sortField === 'id' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('date')}>
                      Fecha de Pedido
                      {sortField === 'date' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('product')}>
                      Producto
                      {sortField === 'product' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('quantity')}>
                      # Cantidad
                      {sortField === 'quantity' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('status')}>
                      Estado
                      {sortField === 'status' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('priority')}>
                      Prioridad
                      {sortField === 'priority' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('dueDate')}>
                      Fecha Límite
                      {sortField === 'dueDate' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('notes')}>
                      Notas
                      {sortField === 'notes' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('shippingMethod')}>
                      Método de Envío
                      {sortField === 'shippingMethod' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <SortableHeader onClick={() => handleSort('deliveryAddress')}>
                      Dirección de Entrega
                      {sortField === 'deliveryAddress' && (
                        <SortIcon>{sortDirection === 'asc' ? '↑' : '↓'}</SortIcon>
                      )}
                    </SortableHeader>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map(order => (
                    <tr key={order.id} style={{ position: 'relative' }}>
                      <td onClick={() => toggleOrderDetail(order.id)} style={{ cursor: 'pointer' }}>
                        {order.id}
                        {activeDetailId === order.id && (
                          <DetailPopup onClick={(e) => e.stopPropagation()}>
                            <DetailGrid>
                              <DetailLabel>Número de Orden</DetailLabel>
                              <DetailValue>{order.id}</DetailValue>
                              
                              <DetailLabel>Fecha de Pedido</DetailLabel>
                              <DetailValue>{formatDate(order.date)}</DetailValue>
                              
                              <DetailLabel>Proveedor</DetailLabel>
                              <DetailValue>{order.provider}</DetailValue>
                              
                              <DetailLabel>Productos</DetailLabel>
                              <DetailValue style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ShoeIcon /> {order.product} - {order.quantity} unidades
                              </DetailValue>
                              
                              <DetailLabel>Estado</DetailLabel>
                              <DetailValue>{getStatusDisplayName(order.status)}</DetailValue>
                              
                              <DetailLabel>Prioridad</DetailLabel>
                              <DetailValue>{getPriorityDisplayName(order.priority)}</DetailValue>
                              
                              <DetailLabel>Fecha Límite</DetailLabel>
                              <DetailValue>{formatDate(order.dueDate)}</DetailValue>
                              
                              <DetailLabel>Notas</DetailLabel>
                              <DetailValue>{order.notes}</DetailValue>
                              
                              <DetailLabel>Factura Adjunta</DetailLabel>
                              <DetailValue>No</DetailValue>
                            </DetailGrid>
                          </DetailPopup>
                        )}
                      </td>
                      <td>{formatDate(order.date)}</td>
                      <ProductCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShoeIcon />
                          {order.product}
                        </div>
                      </ProductCell>
                      <td>
                        <QuantityBadge>{order.quantity}</QuantityBadge>
                      </td>
                      <td>
                        <StatusIndicator status={getStatusColor(order.status)}>
                          {getStatusDisplayName(order.status)}
                        </StatusIndicator>
                      </td>
                      <td>
                        <Badge color={getPriorityColor(order.priority)}>
                          {getPriorityDisplayName(order.priority)}
                        </Badge>
                      </td>
                      <td>{formatDate(order.dueDate)}</td>
                      <td>{order.notes}</td>
                      <td>{order.shippingMethod}</td>
                      <td>{order.deliveryAddress}</td>
                      <td>
                        <Button 
                          onClick={() => handleViewDetails(order)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          primary
                        >
                          Ver Detalle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <Pagination>
                  <PageButton 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </PageButton>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PageButton 
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  
                  <PageButton 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </PageButton>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </ContentArea>

        {/* Order Details Dialog */}
        {showOrderDetails && selectedOrder && (
          <DialogBackdrop onClick={() => setShowOrderDetails(false)}>
            <Dialog size="md" onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Detalle</DialogTitle>
                <Button onClick={() => setShowOrderDetails(false)}>✕</Button>
              </DialogHeader>
              <DialogContent>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem 1.5rem' }}>
                  <FormLabel>Número de Orden</FormLabel>
                  <div>{selectedOrder.id}</div>
                  
                  <FormLabel>Fecha de Pedido</FormLabel>
                  <div>{formatDate(selectedOrder.date)}</div>
                  
                  <FormLabel>Proveedor</FormLabel>
                  <div>{selectedOrder.provider}</div>
                  
                  <FormLabel>Productos Solicitados</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoeIcon /> 
                    {selectedOrder.product} - {selectedOrder.quantity} unidades
                  </div>
                  
                  <FormLabel>Estado de la Orden</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StatusIndicator status={getStatusColor(selectedOrder.status)}>
                      {getStatusDisplayName(selectedOrder.status)}
                    </StatusIndicator>
                  </div>
                  
                  <FormLabel>Prioridad</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge color={getPriorityColor(selectedOrder.priority)}>
                      {getPriorityDisplayName(selectedOrder.priority)}
                    </Badge>
                  </div>
                  
                  <FormLabel>Fecha Límite de Entrega</FormLabel>
                  <div>{formatDate(selectedOrder.dueDate)}</div>
                  
                  <FormLabel>Método de Envío</FormLabel>
                  <div>{selectedOrder.shippingMethod}</div>
                  
                  <FormLabel>Dirección de Entrega</FormLabel>
                  <div>{selectedOrder.deliveryAddress}</div>
                  
                  <FormLabel>Notas Especiales</FormLabel>
                  <div>{selectedOrder.notes !== "-" ? `"${selectedOrder.notes}"` : "No hay notas adicionales"}</div>
                  
                  <FormLabel>Factura Adjunta</FormLabel>
                  <div>No</div>
                </div>
              </DialogContent>
              <DialogFooter>
                <Button onClick={() => setShowOrderDetails(false)}>Cerrar</Button>
                {selectedOrder.status === 'pendiente' && (
                  <>
                    <Button 
                      style={{ 
                        backgroundColor: isDarkTheme ? '#a30000' : '#bb0000', 
                        color: 'white',
                        marginRight: '8px'
                      }}
                      onClick={() => showConfirmation('reject')}
                    >
                      Rechazar Orden
                    </Button>
                    <Button 
                      primary
                      onClick={() => showConfirmation('approve')}
                    >
                      Aprobar Orden
                    </Button>
                  </>
                )}
              </DialogFooter>
            </Dialog>
          </DialogBackdrop>
        )}

        {/* Confirmation Dialog */}
        {showConfirmationDialog && (
          <DialogBackdrop onClick={() => setShowConfirmationDialog(false)}>
            <Dialog size="sm" onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Confirmar Acción</DialogTitle>
                <Button onClick={() => setShowConfirmationDialog(false)}>✕</Button>
              </DialogHeader>
              <DialogContent>
                {confirmActionType === 'approve' ? (
                  <p>¿Estás seguro de que deseas aprobar la orden {selectedOrder?.id}? Esta acción cambiará el estado a "En proceso".</p>
                ) : (
                  <p>¿Estás seguro de que deseas rechazar la orden {selectedOrder?.id}? Esta acción eliminará la orden de la lista.</p>
                )}
              </DialogContent>
              <DialogFooter>
                <Button onClick={() => setShowConfirmationDialog(false)}>Cancelar</Button>
                {confirmActionType === 'approve' ? (
                  <Button primary onClick={handleApproveOrder}>
                    Confirmar Aprobación
                  </Button>
                ) : (
                  <Button 
                    style={{ backgroundColor: isDarkTheme ? '#a30000' : '#bb0000', color: 'white' }}
                    onClick={handleRejectOrder}
                  >
                    Confirmar Rechazo
                  </Button>
                )}
              </DialogFooter>
            </Dialog>
          </DialogBackdrop>
        )}
      </Container>
    </UI5ThemeProvider>
  );
} 