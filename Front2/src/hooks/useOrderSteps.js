import { useState } from 'react';

//Este hook se encarga de manejar los pasos de la orden
const useOrderSteps = (totalSteps = 5) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deliveryPoint, setDeliveryPoint] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  //Sumo 1 al currentStep para que le de paso al siguiente paso
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  //Resto 1 al currentStep para que le de paso al anterior paso
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProductQuantityChange = (productId, quantity) => {
    setSelectedProducts(prev => {
      //Busco el producto en el array de productos seleccionados
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        //Si el producto existe, y la cantidad es 0, lo elimino del array
        if (quantity === 0) {
          return prev.filter(p => p.productId !== productId);
        }
        return prev.map(p => p.productId === productId ? { ...p, quantity } : p);
      }
      return [...prev, { productId, quantity }];
    });
  };

  const handleConfirm = () => {
    const newOrder = {
      id: `OC-${new Date().getFullYear()}-${String(orderHistory.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString(),
      provider: selectedProvider,
      products: selectedProducts,
      deliveryPoint,
      paymentMethod,
      status: 'Pendiente'
    };

    setOrderHistory(prev => [newOrder, ...prev]);
    
    // Reset all states
    setCurrentStep(0);
    setSelectedProvider(null);
    setSelectedProducts([]);
    setDeliveryPoint(null);
    setPaymentMethod(null);
    setShowHistory(false);
  };

  return {
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
  };
};

export default useOrderSteps; 