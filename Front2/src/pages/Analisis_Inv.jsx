import React, { useState, useEffect } from 'react';
import {
  FlexBox,
  FlexBoxDirection,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  IllustratedMessage,
  IllustrationMessageType
} from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { styles } from "../Styles/InicioStyle";
import InventoryHeader from "../components/AnalisisInv/InventoryHeader";
import InventoryFilters from "../components/AnalisisInv/InventoryFilters";
import InventoryKPIs from "../components/AnalisisInv/InventoryKPIs";
import InventoryDistribution from "../components/AnalisisInv/InventoryDistribution";
import InventoryStatus from "../components/AnalisisInv/InventoryStatus";
import InventoryMetrics from "../components/AnalisisInv/InventoryMetrics";

// Datos de ejemplo para diferentes períodos
const inventoryDataByPeriod = {
  mesActual: {
    totalProducts: 2450,
    lowStockProducts: 184,
    outOfStockProducts: 76,
    inventoryValue: 248750,
    rotationIndex: 4.2,
    avgDaysInStock: 28,
    stockAccuracy: 97.2,
    forecastAccuracy: 88.5,
    orderFulfillment: 93.8,
    carryCost: 12350,
    receiptProcessingTime: 1.8,
    trend: {
      value: 5.2,
      direction: 'up'
    }
  },
  mesPasado: {
    totalProducts: 2380,
    lowStockProducts: 165,
    outOfStockProducts: 82,
    inventoryValue: 235400,
    rotationIndex: 3.9,
    avgDaysInStock: 31,
    stockAccuracy: 96.8,
    forecastAccuracy: 87.2,
    orderFulfillment: 92.5,
    carryCost: 11980,
    receiptProcessingTime: 2.0,
    trend: {
      value: 3.8,
      direction: 'up'
    }
  }
};

// Datos para el gráfico de distribución por categoría
const categoryDistribution = [
  { name: "Calzado Deportivo", count: 845, percentage: 34.5, color: "#4caf50" },
  { name: "Calzado Casual", count: 680, percentage: 27.8, color: "#2196f3" },
  { name: "Calzado Formal", count: 520, percentage: 21.2, color: "#673ab7" },
  { name: "Calzado para Playa", count: 405, percentage: 16.5, color: "#ff9800" }
];

// Datos para la tabla de métricas por categoría
const categoryMetrics = [
  {
    category: "Calzado Deportivo",
    sales: 420,
    returnsRate: 4.2,
    turnoverRate: 4.8,
    profit: 32450,
    trend: 8.5
  },
  {
    category: "Calzado Casual",
    sales: 385,
    returnsRate: 3.8,
    turnoverRate: 4.2,
    profit: 28600,
    trend: 5.2
  },
  {
    category: "Calzado Formal",
    sales: 210,
    returnsRate: 2.5,
    turnoverRate: 3.5,
    profit: 24800,
    trend: -2.1
  },
  {
    category: "Calzado para Playa",
    sales: 320,
    returnsRate: 5.1,
    turnoverRate: 5.2,
    profit: 18900,
    trend: 12.4
  }
];

const Analisis_Inv = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("mesActual");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setTimeRange("mesActual");
  };

  const getCurrentInventoryData = () => {
    return inventoryDataByPeriod[timeRange];
  };

  const getFilteredCategoryDistribution = () => {
    if (selectedCategory === "all") {
      return categoryDistribution;
    }
    return categoryDistribution.filter(category => {
      const categoryKey = category.name.toLowerCase().replace("calzado ", "");
      return categoryKey.includes(selectedCategory.toLowerCase());
    });
  };

  const getFilteredCategoryMetrics = () => {
    if (selectedCategory === "all") {
      return categoryMetrics;
    }
    return categoryMetrics.filter(metric => {
      const categoryKey = metric.category.toLowerCase().replace("calzado ", "");
      return categoryKey.includes(selectedCategory.toLowerCase());
    });
  };

  const getTotalProducts = () => {
    if (selectedCategory === "all") {
      return getCurrentInventoryData().totalProducts;
    }
    const filteredCategories = getFilteredCategoryDistribution();
    return filteredCategories.reduce((total, category) => total + category.count, 0);
  };

  const getFilteredInventoryStatus = () => {
    const currentData = getCurrentInventoryData();
    const totalProducts = getTotalProducts();
    const ratio = totalProducts / currentData.totalProducts;

    return {
      inStock: Math.round((currentData.totalProducts - currentData.lowStockProducts - currentData.outOfStockProducts) * ratio),
      lowStock: Math.round(currentData.lowStockProducts * ratio),
      outOfStock: Math.round(currentData.outOfStockProducts * ratio)
    };
  };

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
          titleText="Cargando Análisis de Inventario"
          subtitleText="Por favor espere..."
        />
      </FlexBox>
    );
  }

  const kpiCards = [
    {
      title: "Valor Total del Inventario",
      value: `$${getCurrentInventoryData().inventoryValue.toLocaleString()}`,
      subtitle: "vs. período anterior",
      icon: "retail-store",
      state: getCurrentInventoryData().trend.direction === 'up' ? "Success" : "Error",
      trend: `${getCurrentInventoryData().trend.direction === 'up' ? '+' : '-'}${getCurrentInventoryData().trend.value}% vs período anterior`
    },
    {
      title: "Índice de Rotación",
      value: getCurrentInventoryData().rotationIndex.toString(),
      subtitle: "veces/mes",
      icon: "shipping-status",
      state: "Information",
      trend: "+0.3 vs mes anterior"
    },
    {
      title: "Días Promedio en Inventario",
      value: `${getCurrentInventoryData().avgDaysInStock}`,
      subtitle: "días",
      icon: "calendar",
      state: getCurrentInventoryData().avgDaysInStock < 30 ? "Success" : "Warning",
      trend: "-2.5 vs periodo anterior"
    },
    {
      title: "Productos Bajo Mínimos",
      value: getCurrentInventoryData().lowStockProducts.toString(),
      subtitle: "productos",
      icon: "alert",
      state: "Warning",
      trend: "-12 vs mes anterior"
    }
  ];

  const secondRowKPIs = [
    {
      title: "Precisión de Inventario",
      value: `${getCurrentInventoryData().stockAccuracy}%`,
      subtitle: "exactitud",
      icon: "checklist-item",
      state: "Success",
      trend: "+0.8% vs periodo anterior"
    },
    {
      title: "Precisión de Pronóstico",
      value: `${getCurrentInventoryData().forecastAccuracy}%`,
      subtitle: "exactitud",
      icon: "future",
      state: "Success",
      trend: "+2.3% vs periodo anterior"
    },
    {
      title: "Tasa de Cumplimiento",
      value: `${getCurrentInventoryData().orderFulfillment}%`,
      subtitle: "cumplimiento",
      icon: "complete",
      state: "Success",
      trend: "+1.5% vs periodo anterior"
    },
    {
      title: "Costo de Mantenimiento",
      value: `$${getCurrentInventoryData().carryCost.toLocaleString()}`,
      subtitle: "mensual",
      icon: "expense-report",
      state: "Error",
      trend: "+3.1% vs periodo anterior"
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
      <InventoryHeader />
      
      <InventoryFilters 
        selectedCategory={selectedCategory}
        timeRange={timeRange}
        onCategoryChange={setSelectedCategory}
        onTimeRangeChange={setTimeRange}
        onResetFilters={handleResetFilters}
      />

      <div style={styles.mainContent}>
        <InventoryKPIs kpiCards={kpiCards} />
        <InventoryKPIs kpiCards={secondRowKPIs} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem"
        }}>
          <InventoryDistribution 
            categoryDistribution={getFilteredCategoryDistribution()} 
          />
          <InventoryStatus 
            inventoryStatus={getFilteredInventoryStatus()} 
          />
        </div>

        <InventoryMetrics 
          categoryMetrics={getFilteredCategoryMetrics()} 
        />
      </div>
    </div>
  );
};

export default Analisis_Inv; 