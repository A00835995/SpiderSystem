import React from 'react';
import {
  Title,
  Text,
  Button,
  Icon,
  Label,
  FlexBox,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  FlexBoxDirection,
  RadioButton,
  Card,
  Input,
  Select,
  Option,
  List,
  StandardListItem,
  Avatar,
  Table,
  TableColumn,
  TableRow,
  Bar,
  BarDesign,
  AnalyticalTable,
  Toast
} from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import Header from '../components/Compras/Header';
import ProgressSteps from '../components/Compras/ProgressSteps';
import OrderHistory from '../components/Compras/OrderHistory';
import ProviderStep from '../components/Compras/steps/ProviderStep';
import ProductsStep from '../components/Compras/steps/ProductsStep';
import DeliveryStep from '../components/Compras/steps/DeliveryStep';
import PaymentStep from '../components/Compras/steps/PaymentStep';
import SummaryStep from '../components/Compras/steps/SummaryStep';
import useComprasData from '../hooks/useComprasData';
import useOrderSteps from '../hooks/useOrderSteps';
import useOrderCalculations from '../hooks/useOrderCalculations';

// Importar imágenes
import ImagenZapatoDeportivo from '../Fotos/ImagenZapatoDeportivo.jpg';
import ImagenZapatoDeVestir from '../Fotos/ImagenZapatoDeVestir.jpg';
import ImagenBotas from '../Fotos/ImagenBotas.png';
import ImagenSandalias from '../Fotos/ImagenSandalias.jpg';

const Compras = () => {
  const { loading, error, providers, products, paymentMethods } = useComprasData();
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

  const { subtotal, tax, total, getProductById } = useOrderCalculations(selectedProducts, products);

  const deliveryPoints = [
    {
      id: 1,
      name: "Super Shoes - Tienda Principal",
      address: "Plaza Comercial Reforma, Local 42B, CDMX"
    }
  ];

  const steps = [
    {
      title: "Proveedor",
      content: (
        <ProviderStep
          providers={providers}
          selectedProvider={selectedProvider}
          onProviderSelect={setSelectedProvider}
          onNext={handleNext}
          onBack={handleBack}
        />
      )
    },
    {
      title: "Productos",
      content: (
        <ProductsStep
          products={products}
          selectedProducts={selectedProducts}
          onProductQuantityChange={handleProductQuantityChange}
          onNext={handleNext}
          onBack={handleBack}
        />
      )
    },
    {
      title: "Entrega",
      content: (
        <DeliveryStep
          deliveryPoints={deliveryPoints}
          selectedDeliveryPoint={deliveryPoint}
          onDeliveryPointSelect={setDeliveryPoint}
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
          onPaymentMethodSelect={setPaymentMethod}
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
          products={products}
          deliveryPoints={deliveryPoints}
          deliveryPoint={deliveryPoint}
          paymentMethods={paymentMethods}
          paymentMethod={paymentMethod}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onConfirm={handleConfirm}
          onBack={handleBack}
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

      {showHistory ? (
        <OrderHistory 
          orderHistory={orderHistory} 
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