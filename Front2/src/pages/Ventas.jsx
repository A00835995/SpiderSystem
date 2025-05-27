import React, { useState, useEffect } from 'react';
import { Card, Title, MessageStrip } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// Importar componentes
import VentasHeader from '../components/Ventas/VentasHeader';
import SearchAndFilters from '../components/Ventas/SearchAndFilters';
import ProductGrid from '../components/Ventas/ProductGrid';
import ShoppingCart from '../components/Ventas/ShoppingCart';

const Ventas = () => {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Datos de productos simulados
  useEffect(() => {
    setTimeout(() => {
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
        },
        {
          id: 7,
          nombre: "Zapatos Escolares Niño",
          categoria: "infantiles",
          precio: 1200,
          stock: 22,
          descripcion: "Zapatos escolares resistentes y cómodos, perfectos para el uso diario escolar.",
          imagen: "/api/placeholder/300/200"
        },
        {
          id: 8,
          nombre: "Vans Old Skool",
          categoria: "casuales",
          precio: 2100,
          stock: 20,
          descripcion: "Zapatillas de skate clásicas con diseño atemporal y gran durabilidad.",
          imagen: "/api/placeholder/300/200"
        },
        {
          id: 9,
          nombre: "Mocasines de Cuero",
          categoria: "formales",
          precio: 3200,
          stock: 10,
          descripcion: "Mocasines elegantes de cuero italiano, perfectos para looks business casual.",
          imagen: "/api/placeholder/300/200"
        },
        {
          id: 10,
          nombre: "New Balance 574",
          categoria: "deportivos",
          precio: 2900,
          stock: 16,
          descripcion: "Zapatillas retro-running con excelente amortiguación y estilo vintage.",
          imagen: "/api/placeholder/300/200"
        },
        {
          id: 11,
          nombre: "Botas de Montaña",
          categoria: "botas",
          precio: 4800,
          stock: 6,
          descripcion: "Botas impermeables para senderismo y actividades al aire libre.",
          imagen: "/api/placeholder/300/200"
        },
        {
          id: 12,
          nombre: "Ballerinas Clásicas",
          categoria: "formales",
          precio: 1800,
          stock: 0,
          descripcion: "Zapatos planos elegantes y cómodos para uso diario y ocasiones especiales.",
          imagen: "/api/placeholder/300/200"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar productos
  const filteredProducts = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         producto.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'todas' || producto.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Mostrar notificación
  const showNotification = (message, type = 'Success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Manejar agregar al carrito
  const handleAddToCart = (producto) => {
    const existingItem = carrito.find(item => item.id === producto.id);

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

    setCarrito(carrito.map(item =>
      item.id === productId
        ? { ...item, cantidad: newQuantity }
        : item
    ));
  };

  // Remover del carrito
  const handleRemoveFromCart = (productId) => {
    const newCarrito = carrito.filter(item => item.id !== productId);
    setCarrito(newCarrito);
    
    // Cerrar carrito si queda vacío
    if (newCarrito.length === 0) {
      setIsCartOpen(false);
    }
    
    showNotification('Producto removido del carrito', 'Warning');
  };

  // Vaciar carrito
  const handleClearCart = () => {
    setCarrito([]);
    setIsCartOpen(false);
    showNotification('Carrito vaciado', 'Information');
  };

  // Proceder al checkout
  const handleCheckout = () => {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const itemCount = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    alert(`¡Gracias por tu compra!\n\nResumen:\n- ${itemCount} artículos\n- Total: $${total.toLocaleString()}\n\nProcediendo al pago...`);
    
    // Cerrar carrito inmediatamente para mejor UX
    setIsCartOpen(false);
    
    // Simular proceso de pago
    setTimeout(() => {
      setCarrito([]);
      showNotification('¡Compra realizada exitosamente!', 'Success');
    }, 1000);
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
        <Title level="H3">Cargando productos...</Title>
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

      {/* Header */}
      <VentasHeader />
      
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
            onCategoryChange={setSelectedCategory}
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