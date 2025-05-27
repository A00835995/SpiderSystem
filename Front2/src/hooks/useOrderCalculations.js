import { useMemo } from 'react';

//Este hook se encarga de calcular los datos de la orden
const useOrderCalculations = (selectedProducts, products) => {
  const getProductById = (productId) => {
    return products.find(p => p.id === productId);
  };

  const calculations = useMemo(() => {
    const subtotal = selectedProducts.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);

    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total
    };
  }, [selectedProducts, products]);

  return {
    ...calculations,
    getProductById
  };
};

export default useOrderCalculations; 