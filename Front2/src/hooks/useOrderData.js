import { useState } from 'react';

class OrderItem {
    constructor(artiId, artiDesc, artiQuantity, artiPrice) {
        this.ItemId = artiId;
        this.ItemDesc = artiDesc;
        this.ItemQuantity = artiQuantity;
        this.ItemPrice = artiPrice;
    }

    updateQuantity(quantity) {
        this.ItemQuantity = Math.max(0, quantity);
    }

    getSubtotal() {
        return this.ItemPrice * this.ItemQuantity;
    }

    getTax() {
        return this.getSubtotal() * 0.16;
    }
}

class Order {
    constructor() {
        this.idOrden = 0;
        this.idProv = 0;
        this.idPago = 0;
        this.fechaPedido = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        this.fechaEntrega = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Fecha actual + 5 días
        this.idOrdStat = 1; // 1 = Pendiente
        this.items = {};
    }

    toJSON() {
        return {
            idProv: this.idProv,
            idPago: this.idPago,
            fechaPedido: this.fechaPedido,
            fechaEntrega: this.fechaEntrega,
            items: Object.values(this.items).map(item => ({
                ItemId: item.ItemId,
                ItemQuantity: item.ItemQuantity,
                ItemPrice: item.ItemPrice
            }))
        };
    }
}

//Este hook se encarga de manejar los datos de la orden
function useOrderData() {
    const [order, setOrder] = useState(new Order());

    const addToCart = (artiId, artiDesc, artiQuantity, artiPrice) => {
        if (!artiId || artiQuantity <= 0) return;

        setOrder(prevOrder => {
            const newOrder = { ...prevOrder };
            const newItem = new OrderItem(artiId, artiDesc, artiQuantity, artiPrice);
            newOrder.items = { ...prevOrder.items, [artiId]: newItem };
            return newOrder;
        });
    };

    const updateItemQuantity = (artiId, quantity) => {
        if (!artiId || !order.items[artiId]) return;

        setOrder(prevOrder => {
            const newOrder = { ...prevOrder };
            newOrder.items = { ...prevOrder.items };
            
            if (quantity <= 0) {
                delete newOrder.items[artiId];
            } else {
                const item = prevOrder.items[artiId];
                newOrder.items[artiId] = new OrderItem(
                    item.ItemId,
                    item.ItemDesc,
                    quantity,
                    item.ItemPrice
                );
            }
            return newOrder;
        });
    };

    const removeItem = (artiId) => {
        if (!artiId || !order.items[artiId]) return;

        setOrder(prevOrder => {
            const newOrder = { ...prevOrder };
            newOrder.items = { ...prevOrder.items };
            delete newOrder.items[artiId];
            return newOrder;
        });
    };

    //Este método se encarga de actualizar el proveedor de la orden
    const setOrderProvider = (idProv) => {
        if (!idProv) return;
        
        const parsedId = parseInt(idProv);
        if (isNaN(parsedId)) {
            console.error('ID de proveedor inválido:', idProv);
            return;
        }

        setOrder(prevOrder => {
            const newOrder = { ...prevOrder, idProv: parsedId };
            return newOrder;
        });
    };

    const setOrderPaymentMethod = (idPago) => {
        if (!idPago) return;
        setOrder(prevOrder => ({ ...prevOrder, idPago }));
    };

    const setOrderDeliveryDate = (date) => {
        if (!date) return;
        const formattedDate = new Date(date).toISOString().split('T')[0];
        setOrder(prevOrder => ({
            ...prevOrder,
            fechaEntrega: formattedDate
        }));
    };

    const clearOrder = () => {
        setOrder(new Order());
    };

    // Calculamos los totales directamente aquí
    const getTotal = () => {
        return Object.values(order.items).reduce((total, item) => {
            return total + item.getSubtotal() + item.getTax();
        }, 0);
    };

    const getSubtotal = () => {
        return Object.values(order.items).reduce((total, item) => {
            return total + item.getSubtotal();
        }, 0);
    };

    const getTotalTax = () => {
        return Object.values(order.items).reduce((total, item) => {
            return total + item.getTax();
        }, 0);
    };

    const getItemCount = () => {
        return Object.values(order.items).reduce((count, item) => {
            return count + item.ItemQuantity;
        }, 0);
    };

    const isOrderValid = () => {
        return (
            order.idProv > 0 &&
            order.idPago > 0 &&
            order.fechaEntrega &&
            Object.keys(order.items).length > 0
        );
    };

    return {
        order,
        addToCart,
        updateItemQuantity,
        removeItem,
        setOrderProvider,
        setOrderPaymentMethod,
        setOrderDeliveryDate,
        clearOrder,
        isOrderValid,
        getTotal,
        getSubtotal,
        getTotalTax,
        getItemCount
    };
}

export { useOrderData, OrderItem, Order };