import React, { useState, useEffect } from 'react';
import { Card, Title } from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// Importar componentes refactorizados
import ComprasProveedorHeader from '../components/comprasproveedor(Ordenes)/ComprasProveedorHeader';
import ComprasToolbar from '../components/comprasproveedor(Ordenes)/ComprasToolbar';
import ComprasTable from '../components/comprasproveedor(Ordenes)/ComprasTable';
import PaginationControls from '../components/comprasproveedor(Ordenes)/PaginationControls';
import DetailsDialog from '../components/comprasproveedor(Ordenes)/DetailsDialog';
import ConfirmDialog from '../components/comprasproveedor(Ordenes)/ConfirmDialog';

const ComprasProveedor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionType, setActionType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setCompras([
        {
          id: "OC-2025-001",
          proveedor: "Calzado Deportivo Premium",
          fecha: "2024-03-13",
          producto: "Zapatillas Deportivas Premium",
          cantidad: 50,
          precioUnitario: 2400,
          total: 120000,
          estado: "pendiente",
          prioridad: "alta",
          fechaLimite: "2024-03-18",
          notas: "Urgente - Temporada nueva",
          metodoEnvio: "Transportadora XYZ",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Crédito Corporativo",
            terminosPago: "30 días"
          }
        },
        {
          id: "OC-2025-002",
          proveedor: "Distribuidora de Zapatos Elegance",
          fecha: "2024-03-12",
          producto: "Mocasines Elegance",
          cantidad: 30,
          precioUnitario: 3333,
          total: 100000,
          estado: "en_proceso",
          prioridad: "media",
          fechaLimite: "2024-03-20",
          notas: "-",
          metodoEnvio: "Transportadora ABC",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Factura a 45 días",
            terminosPago: "45 días"
          }
        },
        {
          id: "OC-2025-003",
          proveedor: "Importadora Footwear Internacional",
          fecha: "2024-03-11",
          producto: "Botas de Cuero Importadas",
          cantidad: 25,
          precioUnitario: 4800,
          total: 120000,
          estado: "en_transito",
          prioridad: "baja",
          fechaLimite: "2024-03-23",
          notas: "-",
          metodoEnvio: "Transportadora LMN",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Transferencia bancaria",
            terminosPago: "15 días"
          }
        },
        {
          id: "OC-2025-004",
          proveedor: "Zapatos y Complementos Moda Total",
          fecha: "2024-03-10",
          producto: "Zapatos Formales Modelo Ejecutivo",
          cantidad: 40,
          precioUnitario: 2500,
          total: 100000,
          estado: "pendiente",
          prioridad: "alta",
          fechaLimite: "2024-03-16",
          notas: "Cliente corporativo",
          metodoEnvio: "DHL Express",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Tarjeta corporativa",
            terminosPago: "Inmediato"
          }
        },
        {
          id: "OC-2025-005",
          proveedor: "Calzado Infantil Happy Feet",
          fecha: "2024-03-09",
          producto: "Zapatos Escolares Niño",
          cantidad: 60,
          precioUnitario: 1200,
          total: 72000,
          estado: "completada",
          prioridad: "media",
          fechaLimite: "2024-03-15",
          notas: "Pedido temporada escolar",
          metodoEnvio: "Fedex",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Transferencia bancaria",
            terminosPago: "Pagado"
          }
        },
        {
          id: "OC-2025-006",
          proveedor: "Accesorios para Calzado S.A.",
          fecha: "2024-03-08",
          producto: "Plantillas Ergonómicas",
          cantidad: 100,
          precioUnitario: 350,
          total: 35000,
          estado: "en_proceso",
          prioridad: "baja",
          fechaLimite: "2024-03-18",
          notas: "Accesorios",
          metodoEnvio: "Transportadora XYZ",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Crédito Corporativo",
            terminosPago: "30 días"
          }
        },
        {
          id: "OC-2025-007",
          proveedor: "Calzado Deportivo Premium",
          fecha: "2024-03-07",
          producto: "Zapatillas Running Pro",
          cantidad: 45,
          precioUnitario: 2800,
          total: 126000,
          estado: "completada",
          prioridad: "alta",
          fechaLimite: "2024-03-14",
          notas: "Stock prioritario",
          metodoEnvio: "DHL Express",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Tarjeta corporativa",
            terminosPago: "Pagado"
          }
        },
        {
          id: "OC-2025-008",
          proveedor: "Importadora Footwear Internacional",
          fecha: "2024-03-06",
          producto: "Sandalias Playa Deluxe",
          cantidad: 80,
          precioUnitario: 950,
          total: 76000,
          estado: "en_transito",
          prioridad: "media",
          fechaLimite: "2024-03-16",
          notas: "Temporada verano",
          metodoEnvio: "Transportadora LMN",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Crédito Corporativo",
            terminosPago: "45 días"
          }
        },
        {
          id: "OC-2025-009",
          proveedor: "Calzado Deportivo Premium",
          fecha: "2024-03-05",
          producto: "Tenis Casual Street",
          cantidad: 65,
          precioUnitario: 1800,
          total: 117000,
          estado: "pendiente",
          prioridad: "media",
          fechaLimite: "2024-03-15",
          notas: "Colección urbana",
          metodoEnvio: "Transportadora XYZ",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Crédito Corporativo",
            terminosPago: "30 días"
          }
        },
        {
          id: "OC-2025-010",
          proveedor: "Distribuidora de Zapatos Elegance",
          fecha: "2024-03-04",
          producto: "Zapatos de Vestir Premium",
          cantidad: 35,
          precioUnitario: 2900,
          total: 101500,
          estado: "en_proceso",
          prioridad: "alta",
          fechaLimite: "2024-03-14",
          notas: "Evento corporativo",
          metodoEnvio: "DHL Express",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Transferencia bancaria",
            terminosPago: "15 días"
          }
        },
        {
          id: "OC-2025-011",
          proveedor: "Accesorios para Calzado S.A.",
          fecha: "2024-03-03",
          producto: "Limpiadores Especializados",
          cantidad: 120,
          precioUnitario: 250,
          total: 30000,
          estado: "completada",
          prioridad: "baja",
          fechaLimite: "2024-03-10",
          notas: "Productos de limpieza",
          metodoEnvio: "Transportadora ABC",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Tarjeta corporativa",
            terminosPago: "Pagado"
          }
        },
        {
          id: "OC-2025-012",
          proveedor: "Calzado Infantil Happy Feet",
          fecha: "2024-03-02",
          producto: "Zapatos Infantiles Casual",
          cantidad: 50,
          precioUnitario: 950,
          total: 47500,
          estado: "en_transito",
          prioridad: "media",
          fechaLimite: "2024-03-12",
          notas: "Colección primavera",
          metodoEnvio: "Fedex",
          direccionEntrega: "Super Shoes - Tienda Principal, Plaza Comercial Reforma, Local 42B, CDMX",
          detalles: {
            metodoPago: "Crédito Corporativo",
            terminosPago: "45 días"
          }
        }
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

  // Handlers para las acciones
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
    setShowConfirmDialog(true);
  };

  const handleConfirmFromDetails = () => {
    setActionType('confirm');
    setShowConfirmDialog(true);
  };

  const handleRejectFromDetails = () => {
    setActionType('reject');
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'confirm') {
      const updatedCompras = compras.map(compra => 
        compra.id === selectedCompra.id 
          ? { ...compra, estado: 'en_proceso' } 
          : compra
      );
      setCompras(updatedCompras);
      alert('Orden aceptada exitosamente');
    } else if (actionType === 'reject') {
      const updatedCompras = compras.filter(compra => compra.id !== selectedCompra.id);
      setCompras(updatedCompras);
      alert('Orden rechazada exitosamente');
    }
    
    setShowConfirmDialog(false);
    setShowDetailsDialog(false);
    setSelectedCompra(null);
    setActionType(null);
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
          />
          
          {/* Tabla */}
          <ComprasTable 
            data={currentItems}
            itemsPerPage={itemsPerPage}
            onViewDetails={handleViewDetails}
            onConfirmCompra={handleConfirmCompra}
            onRejectCompra={handleRejectCompra}
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
        onReject={handleRejectFromDetails}
      />

      <ConfirmDialog 
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmAction}
        selectedCompra={selectedCompra}
        actionType={actionType}
      />
    </div>
  );
};

export default ComprasProveedor; 