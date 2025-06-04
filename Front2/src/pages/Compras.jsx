import React, { useState, useEffect } from 'react';

import "@ui5/webcomponents-icons/dist/AllIcons.js";

import Header from '../components/Compras/Header';
import ProgressSteps from '../components/Compras/ProgressSteps';
import OrderHistory from '../components/Compras/OrderHistory';
import ProviderStep from '../components/Compras/steps/ProviderStep';
import ProductsStep from '../components/Compras/steps/ProductsStep';
import DeliveryStep from '../components/Compras/steps/DeliveryStep';
import PaymentStep from '../components/Compras/steps/PaymentStep';
import SummaryStep from '../components/Compras/steps/SummaryStep';
import OrderConfirmationDialog from '../components/Compras/OrderConfirmationDialog';
import useComprasData from '../hooks/useComprasData';
import useOrderSteps from '../hooks/useOrderSteps';
import useOrderCalculations from '../hooks/useOrderCalculations';
import { useOrderData } from '../hooks/useOrderData';
import { createOrder, fetchArticulosPorProveedor } from '../services/comprasService';

// Importar imágenes
import ImagenZapatoDeportivo from '../Fotos/ImagenZapatoDeportivo.jpg';
import ImagenZapatoDeVestir from '../Fotos/ImagenZapatoDeVestir.jpg';
import ImagenBotas from '../Fotos/ImagenBotas.png';
import ImagenSandalias from '../Fotos/ImagenSandalias.jpg';

const Compras = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({ 
    type: 'Success', 
    title: '', 
    message: '',
    ordenId: null 
  });
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  
  //Este const  lo que hace es obtener los datos de las compras con la función useComprasData
  const { loading, error, providers, paymentMethods } = useComprasData();
  const {
    currentStep,
    selectedProvider,
    selectedProducts,
    deliveryPoint,
    paymentMethod,
    showHistory,
    orderHistory,
    setSelectedProvider,
    setDeliveryPoint,
    setPaymentMethod,
    setShowHistory,
    handleNext,
    handleBack,
    handleProductQuantityChange,
    handleConfirm
  } = useOrderSteps(5);

  const { subtotal, tax, total, getProductById } = useOrderCalculations(selectedProducts, productos);

  const {
    order,
    addToCart,
    removeItem,
    setOrderProvider,
    setOrderPaymentMethod,
    setOrderDeliveryDate,
    clearOrder,
  } = useOrderData();

  // Cargar productos cuando cambia el proveedor seleccionado
  useEffect(() => {
    const cargarProductosPorProveedor = async () => {
      if (selectedProvider) {
        setLoadingProductos(true);
        try {
          console.log("Cargando productos para el proveedor ID:", selectedProvider);
          const productosProveedor = await fetchArticulosPorProveedor(selectedProvider);
          console.log("Productos obtenidos:", productosProveedor);
          
          // Asignar imágenes a los productos
          const productosConImagen = productosProveedor.map((producto, index) => {
            let imagen;
            switch(index) {
              case 0:
                imagen = ImagenZapatoDeportivo;
                break;
              case 1:
                imagen = ImagenZapatoDeVestir;
                break;
              case 2:
                imagen = ImagenBotas;
                break;
              case 3:
                imagen = ImagenSandalias;
                break;
              default:
                imagen = ImagenZapatoDeportivo;
            }
            return { ...producto, image: imagen };
          });
          
          setProductos(productosConImagen);
          setLoadingProductos(false);
        } catch (error) {
          console.error("Error al cargar productos:", error);
          setProductos([]);
          setLoadingProductos(false);
        }
      } else {
        setProductos([]);
      }
    };

    cargarProductosPorProveedor();
  }, [selectedProvider]);

  // Limpiar productos seleccionados cuando cambia el proveedor
  useEffect(() => {
    if (selectedProvider && selectedProducts.length > 0) {
      // Limpiar productos seleccionados del paso anterior
      selectedProducts.forEach(product => {
        handleProductChange(product.productId, 0);
      });
    }
  }, [selectedProvider]);

  const deliveryPoints = [
    {
      id: 1,
      name: "Super Shoes - Tienda Principal",
      address: "Plaza Comercial Reforma, Local 42B, CDMX"
    }
  ];

  // Handle provider selection with order 
  //Este método se encarga de seleccionar el proveedor
  const handleProviderSelect = (providerId) => {
    console.log("Proveedor seleccionado ID:", providerId);
    setSelectedProvider(providerId); //guarda el id del proveedor en el estado
    setOrderProvider(providerId); //guarda el id del proveedor en el Json
  };

  // Handle product quantity changes with order data
  //Este método se encarga de cambiar la cantidad de productos
  const handleProductChange = (productId, quantity) => {
    handleProductQuantityChange(productId, quantity); //Actualiza la cantidad localmente
    const product = getProductById(productId);//Obtiene el producto por su id
    if (product) {
      if (quantity === 0) {
        removeItem(productId);
      } else {
        addToCart(
          productId,
          product.name,
          quantity,
          product.price,
          16 // Default tax rate
        );
      }
    }
  };

  // Handle payment method selection with order data
  const handlePaymentSelect = (paymentId) => {
    setPaymentMethod(paymentId);
    setOrderPaymentMethod(paymentId);
  };

  // Handle delivery point selection with order data
  const handleDeliverySelect = (point) => {
    setDeliveryPoint(point);
    setOrderDeliveryDate(new Date().toISOString()); // You might want to add a date picker in the UI
  };

  // El método createOrder ahora está importado directamente desde el servicio

  // Handle final confirmation
  const handleFinalConfirm = async () => {
    try {
      // Preparar los datos de la orden
      const fechaPedido = new Date().toISOString().split('T')[0];
      const fechaEntrega = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const orderData = {
        idProv: order.idProv,
        idPago: order.idPago,
        fechaPedido: fechaPedido,
        fechaEntrega: fechaEntrega,
        items: Object.values(order.items).map(item => ({
          ItemId: item.ItemId,
          ItemQuantity: item.ItemQuantity,
          ItemPrice: item.ItemPrice
        }))
      };

      // Log del JSON que se enviará al backend
      console.log('JSON a enviar al backend:', JSON.stringify(orderData, null, 2));

      // Llamar al servicio de creación de orden que usa axiosInstance con JWT
      const result = await createOrder(orderData);

      // Mostrar diálogo de éxito
      setDialogInfo({
        type: 'Success',
        title: '¡Orden Creada!',
        message: 'Su orden ha sido creada exitosamente.',
        ordenId: result.ordenId
      });
      setShowDialog(true);

      // Limpiar el carrito y avanzar
      handleConfirm();
      clearOrder();
    } catch (error) {
      // Mostrar diálogo de error
      setDialogInfo({
        type: 'Error',
        title: 'Error',
        message: error.message || 'Error al crear la orden',
        ordenId: null
      });
      setShowDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const steps = [
    {
      title: "Proveedor",
      content: (
        //Este componente se encarga de mostrar el paso de proveedor
        <ProviderStep
          //providers es el array de proveedores, el {providers} viene de useComprasData
          providers={providers}
          //SelectedProvider es el proveedor seleccionado, el {selectedProvider} viene de useOrderSteps
          selectedProvider={selectedProvider}
          onProviderSelect={handleProviderSelect}
          onNext={handleNext}
          onBack={handleBack}
        />
      )
    },
    {
      title: "Productos",
      content: (
        <ProductsStep
          products={productos}
          selectedProducts={selectedProducts}
          onProductQuantityChange={handleProductChange}
          onNext={handleNext}
          onBack={handleBack}
          loading={loadingProductos}
        />
      )
    },
    {
      title: "Entrega",
      content: (
        <DeliveryStep
          deliveryPoints={deliveryPoints}
          selectedDeliveryPoint={deliveryPoint}
          onDeliveryPointSelect={handleDeliverySelect}
          onNext={handleNext}
          onBack={handleBack}
        />
      )
    },
    {
      title: "Pago",
      content: (
        <PaymentStep
          paymentMethods={paymentMethods}
          selectedPaymentMethod={paymentMethod}
          onPaymentMethodSelect={handlePaymentSelect}
          onNext={handleNext}
          onBack={handleBack}
        />
      )
    },
    {
      title: "Resumen",
      content: (
        <SummaryStep
          providers={providers}
          selectedProvider={selectedProvider}
          selectedProducts={selectedProducts}
          products={productos}
          deliveryPoints={deliveryPoints}
          deliveryPoint={deliveryPoint}
          paymentMethods={paymentMethods}
          paymentMethod={paymentMethod}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onConfirm={handleFinalConfirm}
          onBack={handleBack}
          orderData={order}
        />
      )
    }
  ];

  return (
    <div style={{ 
      width: "100%",
      minHeight: "100%",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      paddingTop: "2rem"
    }}>
      <Header onShowHistory={() => setShowHistory(true)} />

      <OrderConfirmationDialog
        open={showDialog}
        onClose={handleCloseDialog}
        type={dialogInfo.type}
        title={dialogInfo.title}
        message={dialogInfo.message}
        ordenId={dialogInfo.ordenId}
      />

      {showHistory ? (
        <OrderHistory 
          onClose={() => setShowHistory(false)} 
        />
      ) : (
        <>
          <ProgressSteps steps={steps} currentStep={currentStep} />
          
          <div style={{
            flex: 1,
            backgroundColor: 'var(--sapList_Background)',
            margin: '0 2rem 2rem',
            borderRadius: '0.5rem',
            boxShadow: 'var(--sapContent_Shadow0)',
            overflow: 'hidden'
          }}>
            {steps[currentStep].content}
          </div>
        </>
      )}
    </div>
  );
};

export default Compras; 