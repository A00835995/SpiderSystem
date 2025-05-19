import React, { useState, useEffect } from "react";
import InicioHeader from "../components/Inicio/InicioHeader";
import InicioKpiCards from "../components/Inicio/InicioKpiCards";
import InicioRecentOrders from "../components/Inicio/InicioRecentOrders";
import InicioSalesCat from "../components/Inicio/InicioSalesCat";
import { fetchInicioData, 
    fetchVentasMes, 
    fetchProductosInventario, 
    fetchVentasMesAnterior } 
    from "../services/InicioService";

import {
  FlexBox,
  FlexBoxDirection,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  Title,
  Text,
  Card,
  CardHeader,
  ObjectStatus,
  AnalyticalTable,
  IllustratedMessage,
  IllustrationMessageType,
  Icon
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { styles } from "../Styles/InicioStyle";

const Inicio = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const [kpiStats, setKpiStats] = useState({
    ordenesPendientes: 0,
    ventasMes: 0,
    productosInventario: 0,
    crecimiento: 0
  });
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
    async function loadStats() {
      setIsLoading(true);
      const [ordenes, ventas, inventario, crecimiento] = await Promise.all([
        fetchInicioData(),
        fetchVentasMes(),
        fetchProductosInventario(),
        fetchVentasMesAnterior()
      ]);
      console.log("ordenes", ordenes);
      console.log("ventas", ventas);
      console.log("inventario", inventario);
      console.log("crecimiento", crecimiento);
      setKpiStats({
        ordenesPendientes: ordenes[0]?.ordenesPendientes ?? 0,
        ventasMes: ventas[0]?.total ?? 0,
        productosInventario: inventario[0]?.total ?? 0,
        crecimiento: crecimiento[0]?.porcentaje ?? 0
      });      
    }
    loadStats();
    
  }, []);

  const kpiCards = [
    {
      title: "Órdenes Pendientes",
      value: kpiStats.ordenesPendientes,
      subtitle: "Órdenes Pendientes",
      icon: "cart",
      state: "Warning"
    },
    {
      title: "Ventas del Mes",
      value: `$${kpiStats.ventasMes?.toLocaleString()}`,
      subtitle: "Ventas del Mes",
      icon: "sales-order"
    },
    {
      title: "Productos en Inventario",
      value: kpiStats.productosInventario,
      subtitle: "Productos en Inventario",
      icon: "product"
    },
    {
      title: "Crecimiento en Ventas",
      value: `${Number(kpiStats.crecimiento).toFixed(2)}%`,
      subtitle: "vs Mes Anterior",
      icon: "trend-up"
    }
  ];

  if (isLoading) {
    return (
      <FlexBox
        direction={FlexBoxDirection.Column}
        justifyContent={FlexBoxJustifyContent.Center}
        alignItems={FlexBoxAlignItems.Center}
        style={{ height: "100%" }}
      >
        <IllustratedMessage
          name={IllustrationMessageType.SapLogo}
          titleText="Cargando Dashboard"
          subtitleText="Por favor espere..."
        />
      </FlexBox>
    );
  }

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
        <InicioHeader />
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%"
        }}>
        <div style={styles.mainContent}>
            <InicioKpiCards cards={kpiCards} styles={styles} />
            <InicioRecentOrders />
            <InicioSalesCat />
          <Title level="H4" style={styles.productsHeader}>Productos Más Vendidos</Title>
          <div style={styles.productsGrid}>
            {[
              {
                nombre: "Nike Air Max 2024",
                precio: "$2,499",
                vendidos: 145,
                stock: 80,
                estado: "Stock Alto",
                imagen: "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              },
              {
                nombre: "Adidas Ultraboost",
                precio: "$2,899",
                vendidos: 128,
                stock: 65,
                estado: "Stock Alto",
                imagen: "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              },
              {
                nombre: "Puma RS-X",
                precio: "$1,999",
                vendidos: 112,
                stock: 45,
                estado: "Stock Normal",
                imagen: "https://images.pexels.com/photos/267242/pexels-photo-267242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
            ].map((producto, index) => (
              <Card key={index} style={styles.productCard}>
                <div style={styles.productImageContainer}>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={styles.productImage}
                  />
                </div>
                <div style={styles.productInfo}>
                  <div style={styles.productHeader}>
                    <div>
                      <Text style={styles.productName}>{producto.nombre}</Text>
                      <Text style={styles.productPrice}>{producto.precio}</Text>
                    </div>
                  </div>
                  <div style={styles.productMetrics}>
                    <div style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Vendidos</Text>
                      <Text style={styles.metricValue}>{producto.vendidos} unidades</Text>
                    </div>
                    <div style={styles.metricRow}>
                      <Text style={styles.metricLabel}>Disponibles</Text>
                      <Text style={styles.metricValue}>{producto.stock} unidades</Text>
                    </div>
                    <div style={styles.stockIndicator}>
                      <div 
                        style={{
                          ...styles.stockDot,
                          backgroundColor: producto.estado === "Stock Alto" 
                            ? "var(--sapIndicationColor_1)"
                            : "var(--sapIndicationColor_2)"
                        }}
                      />
                      <Text style={styles.stockText}>{producto.estado}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio; 