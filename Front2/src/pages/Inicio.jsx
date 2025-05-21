import React from "react";
import { useInicio } from "../hooks/useInicio";
import InicioHeader from "../components/Inicio/InicioHeader";
import InicioKpiCards from "../components/Inicio/InicioKpiCards";
import InicioRecentOrders from "../components/Inicio/InicioRecentOrders";
import InicioSalesCat from "../components/Inicio/InicioSalesCat";
import InicioTopProducts from "../components/Inicio/InicioTopProducts";
import { FlexBox, FlexBoxDirection, FlexBoxAlignItems, FlexBoxJustifyContent, IllustratedMessage, IllustrationMessageType } from "@ui5/webcomponents-react";
import { styles } from "../Styles/InicioStyle";

// Importar los iconos necesarios
import "@ui5/webcomponents-icons/dist/cart.js";
import "@ui5/webcomponents-icons/dist/sales-order.js";
import "@ui5/webcomponents-icons/dist/product.js";
import "@ui5/webcomponents-icons/dist/trend-up.js";

const Inicio = () => {
  const { inicioData, loading, error } = useInicio();

  if (loading) {
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Construye los kpiCards usando los datos del hook
  const kpiCards = [
    {
      title: "Órdenes Pendientes",
      value: inicioData?.ordenesPendientes?.[0]?.ordenesPendientes ?? 0,
      subtitle: "Órdenes Pendientes",
      icon: "cart",
      state: "Warning"
    },
    {
      title: "Ventas del Mes",
      value: `$${inicioData?.ventasMes?.[0]?.total?.toLocaleString() ?? 0}`,
      subtitle: "Ventas del Mes",
      icon: "sales-order"
    },
    {
      title: "Productos en Inventario",
      value: inicioData?.productosInventario?.[0]?.total ?? 0,
      subtitle: "Productos en Inventario",
      icon: "product"
    },
    {
      title: "Crecimiento en Ventas",
      value: `${Number(inicioData?.ventasMesAnterior?.[0]?.porcentaje ?? 0).toFixed(2)}%`,
      subtitle: "vs Mes Anterior",
      icon: "trend-up"
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
      <InicioHeader />
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%"
      }}>
        <div style={styles.mainContent}>
          <InicioKpiCards cards={kpiCards} styles={styles} />
          <InicioRecentOrders orders={inicioData.ordenesRecientes} />
          <InicioSalesCat categories={inicioData.ventasXCategoria} />
          <InicioTopProducts products={inicioData.productosMasVendidosMesActual ?? []} />
        </div>
      </div>
    </div>
  );
};

export default Inicio; 