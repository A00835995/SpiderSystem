import React, { useState, useEffect } from 'react';
import { Card, Title, MessageStrip, BusyIndicator } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/api';

// Importar componentes
import VentasHeader from '../components/Ventas/VentasHeader';
import SearchAndFilters from '../components/Ventas/SearchAndFilters';
import ProductGrid from '../components/Ventas/ProductGrid';
import ShoppingCart from '../components/Ventas/ShoppingCart';
import OrderConfirmationDialog from '../components/Compras/OrderConfirmationDialog';

const Ventas = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationInfo, setConfirmationInfo] = useState({
    type: 'Success',
    title: '',
    message: '',
    ordenId: null
  });

  // Obtener productos disponibles desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_CONFIG.endpoints.ventas.articulosDisponibles);
        
        if (response.data && response.data.success) {
          // Transformar los datos recibidos al formato esperado por el componente
          const productosFormateados = response.data.data.map(articulo => ({
            id: articulo.id,
            nombre: articulo.nombre,
            categoria: "general", // Agregar categoría por defecto si no viene en la respuesta
            precio: articulo.precioVenta,
            precioConIva: articulo.precioConIva,
            stock: articulo.existencia,
            descripcion: `${articulo.nombre} - IVA: ${articulo.iva}%`,
            imagen: "/api/placeholder/300/200" // Imagen de placeholder
          }));
          
          setProductos(productosFormateados);
          setError(null);
        } else {
          throw new Error(response.data?.message || "Error al obtener productos");
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos. Por favor, intenta nuevamente.");
        // Cargar datos de muestra si falla la petición
        cargarDatosDeMuestra();
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Función para cargar datos de muestra en caso de error
  const cargarDatosDeMuestra = () => {
    setProductos([
      {
        id: 1,
        nombre: "Nike Air Max 270",
        categoria: "deportivos",
        precio: 3500,
        stock: 25,
        descripcion: "Zapatillas deportivas con tecnología Air Max para máxima comodidad y estilo urbano.",
        imagen: "/api/placeholder/300/200"
      },
      {
        id: 2,
        nombre: "Adidas Ultraboost 22",
        categoria: "deportivos",
        precio: 4200,
        stock: 18,
        descripcion: "Zapatillas de running con tecnología Boost para un retorno de energía excepcional.",
        imagen: "/api/placeholder/300/200"
      },
      {
        id: 3,
        nombre: "Zapatos Oxford Clásicos",
        categoria: "formales",
        precio: 2800,
        stock: 12,
        descripcion: "Zapatos formales de cuero genuino, perfectos para ocasiones especiales y oficina.",
        imagen: "/api/placeholder/300/200"
      },
      {
        id: 4,
        nombre: "Converse Chuck Taylor",
        categoria: "casuales",
        precio: 1800,
        stock: 30,
        descripcion: "Zapatillas casuales icónicas, perfectas para el día a día con estilo retro.",
        imagen: "/api/placeholder/300/200"
      },
      {
        id: 5,
        nombre: "Botas Dr. Martens 1460",
        categoria: "botas",
        precio: 5200,
        stock: 8,
        descripcion: "Botas de cuero resistentes con suela AirWair, ideales para cualquier clima.",
        imagen: "/api/placeholder/300/200"
      },
      {
        id: 6,
        nombre: "Sandalias Birkenstock Arizona",
        categoria: "sandalias",
        precio: 2200,
        stock: 15,
        descripcion: "Sandalias ergonómicas con plantilla de corcho natural para máximo confort.",
        imagen: "/api/placeholder/300/200"
      }
    ]);
  };

  // Filtrar productos (solo por búsqueda, sin filtro de categoría)
  const filteredProducts = productos.filter(producto => {
    return producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (producto.categoria && producto.categoria.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (producto.descripcion && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Función simple para manejar el cambio de categoría (no hace nada pero mantiene la interfaz)
  const handleCategoryChange = () => {
    // No hacemos nada, siempre mantenemos "todas" como categoría
    setSelectedCategory('todas');
  };

  // Mostrar notificación
  const showNotification = (message, type = 'Success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Manejar agregar al carrito
  const handleAddToCart = (producto) => {
    const existingItem = carrito.find(item => item.id === producto.id);
    const currentQuantity = existingItem ? existingItem.cantidad : 0;
    
    // Verificar si hay suficiente stock
    if (currentQuantity + 1 > producto.stock) {
      showNotification(`No hay suficiente stock de ${producto.nombre}. Disponible: ${producto.stock}`, 'Negative');
      return;
    }

    if (existingItem) {
      // Si ya existe, incrementar cantidad
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      // Si no existe, agregar nuevo item
      const newItem = {
        ...producto,
        cantidad: 1
      };
      setCarrito([...carrito, newItem]);
    }

    showNotification(`${producto.nombre} agregado al carrito`);
  };

  // Actualizar cantidad en carrito
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    // Encontrar el producto en el carrito
    const item = carrito.find(item => item.id === productId);
    
    // Verificar si hay suficiente stock para la nueva cantidad
    if (item && newQuantity > item.stock) {
      showNotification(`No hay suficiente stock de ${item.nombre}. Disponible: ${item.stock}`, 'Negative');
      return;
    }

    setCarrito(carrito.map(item =>
      item.id === productId
        ? { ...item, cantidad: newQuantity }
        : item
    ));
  };

  // Remover del carrito
  const handleRemoveFromCart = (productId) => {
    setCarrito(carrito.filter(item => item.id !== productId));
    showNotification('Producto removido del carrito', 'Warning');
  };

  // Vaciar carrito
  const handleClearCart = () => {
    setCarrito([]);
    showNotification('Carrito vaciado', 'Information');
  };

  // Cerrar el diálogo de confirmación
  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
  };

  // Proceder al checkout
  const handleCheckout = async () => {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const itemCount = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    // Generar JSON para la venta según el formato requerido por el stored procedure
    const fechaActual = new Date();
    
    const ventaJSON = {
      venta: {
        FECHAVta: fechaActual.toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
      },
      detalles: carrito.map(item => ({
        ARTIID: item.id,
        VtaCant: item.cantidad,
        VtaPRECIOCOMP: item.precio,
        VtaPRECIOIVA: item.precioConIva || item.precio * 1.16
      }))
    };
    
    // Mostrar el JSON en la consola para depuración
    console.log("DATOS DE VENTA A ENVIAR:");
    console.log(JSON.stringify(ventaJSON, null, 2));
    
    // Mostrar mensaje de procesamiento
    showNotification('Procesando tu compra...', 'Information');
    
    try {
      // Enviar el JSON al backend
      const response = await axiosInstance.post(
        API_CONFIG.endpoints.ventas.registrar, 
        ventaJSON
      );
      
      if (response.data && response.data.success) {
        // Si la venta se registró correctamente
        
        // Mostrar diálogo de confirmación
        setConfirmationInfo({
          type: 'Success',
          title: '¡Compra Exitosa!',
          message: `¡Gracias por tu compra! Has adquirido ${itemCount} artículos por un total de $${total.toLocaleString()}.`,
          ordenId: response.data.data.IdVenta
        });
        setShowConfirmationDialog(true);
        
        // Limpiar carrito y cerrar modal
        setCarrito([]);
        setIsCartOpen(false);
        showNotification('¡Compra realizada exitosamente!', 'Success');
      } else {
        // Si hubo un error en el servidor
        throw new Error(response.data?.message || 'Error al procesar la venta');
      }
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      
      // Mostrar diálogo de error
      setConfirmationInfo({
        type: 'Error',
        title: 'Error en la Compra',
        message: `No se pudo completar la compra. ${error.message}`,
        ordenId: null
      });
      setShowConfirmationDialog(true);
      
      showNotification(`Error: ${error.message}`, 'Negative');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '1.5rem',
        paddingTop: '6rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <BusyIndicator active size="Large" />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '1.5rem',
      paddingTop: '6rem',
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Notificación */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1001,
          maxWidth: '400px'
        }}>
          <MessageStrip
            design={notification.type}
            hideCloseButton={false}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </MessageStrip>
        </div>
      )}

      {/* Diálogo de confirmación */}
      <OrderConfirmationDialog
        open={showConfirmationDialog}
        onClose={handleCloseConfirmationDialog}
        type={confirmationInfo.type}
        title={confirmationInfo.title}
        message={confirmationInfo.message}
        ordenId={confirmationInfo.ordenId}
      />

      {/* Header */}
      <VentasHeader />
      
      {/* Mensaje de error */}
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
            <Title level="H4">Catálogo de Productos</Title>
          </div>
        }
      >
        <div style={{ padding: '1.5rem' }}>
          {/* Búsqueda y filtros */}
          <SearchAndFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Grid de productos */}
          <ProductGrid 
            productos={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </div>
      </Card>

      {/* Carrito de compras */}
      <ShoppingCart 
        carrito={carrito}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen(!isCartOpen)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Ventas; 