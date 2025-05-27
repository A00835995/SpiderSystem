import React, { useState, useEffect } from "react";
import {
  Text,
  FlexBox,
  FlexBoxDirection,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  FlexBoxWrap,
  SegmentedButton,
  SegmentedButtonItem,
  ValueState,
  Button,
  BusyIndicator
} from "@ui5/webcomponents-react";

import PredictiveHeader from "../components/Predictivo/PredictiveHeader";
import PredictiveMetrics from "../components/Predictivo/PredictiveMetrics";
import PredictiveChart from "../components/Predictivo/PredictiveChart";
import PredictiveProductList from "../components/Predictivo/PredictiveProductList";
import PredictiveProductDetail from "../components/Predictivo/PredictiveProductDetail";

// Importar íconos necesarios
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// Datos históricos y predicciones
const dataset = [
  {
    articulo: 'Nike Air Max 270', 
    ventas: 145, 
    prediccion: 160,
    historico: [120, 135, 145, 150, 145],
    perdidas: 15,
    meses: ["Ene", "Feb", "Mar", "Abr", "May"]
  },
  { 
    articulo: 'Adidas Ultraboost', 
    ventas: 132, 
    prediccion: 140,
    historico: [110, 125, 132, 138, 132],
    perdidas: 8,
    meses: ["Ene", "Feb", "Mar", "Abr", "May"]
  },
  { 
    articulo: 'Nike Air Force 1', 
    ventas: 168, 
    prediccion: 175,
    historico: [150, 160, 168, 172, 168],
    perdidas: 7,
    meses: ["Ene", "Feb", "Mar", "Abr", "May"]
  },
  { 
    articulo: 'Puma RS-X', 
    ventas: 89, 
    prediccion: 95,
    historico: [80, 85, 89, 92, 89],
    perdidas: 6,
    meses: ["Ene", "Feb", "Mar", "Abr", "May"]
  },
  { 
    articulo: 'New Balance 574', 
    ventas: 110, 
    prediccion: 120,
    historico: [95, 105, 110, 115, 110],
    perdidas: 10,
    meses: ["Ene", "Feb", "Mar", "Abr", "May"]
  },
  { 
    articulo: 'Vans Old Skool', 
    ventas: 95, 
    prediccion: 100,
    historico: [85, 90, 95, 98, 95],
    perdidas: 5,
    meses: ["Ene", "Feb", "Mar", "Abr", "May"]
  }
];

// Transformar datos para la visualización
const transformDataForCharts = () => {
  const lineChartData = [];
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
  
  // Para cada mes
  for (let i = 0; i < meses.length; i++) {
    const ventasMes = i < 5 ? dataset.reduce((sum, product) => sum + product.historico[i], 0) : null;
    const prediccionMes = i === 5 ? dataset.reduce((sum, product) => sum + product.prediccion, 0) : 
                         i === 4 ? ventasMes * 1.05 : // Predicción para Mayo
                         i === 3 ? ventasMes * 1.1 : // Predicción para Abril
                         null;
    
    lineChartData.push({
      mes: meses[i],
      ventas: ventasMes,
      prediccion: prediccionMes
    });
  }
  
  return lineChartData;
};

// Datos para gráficos de barras de productos individuales
const getProductChartData = (product) => {
  const result = [];
  
  for (let i = 0; i < product.meses.length; i++) {
    result.push({
      mes: product.meses[i],
      ventas: product.historico[i]
    });
  }
  
  // Añadir predicción
  result.push({
    mes: "Jun",
    prediccion: product.prediccion
  });
  
  return result;
};

// Datos de métricas
const metricas = {
  precision: '95%',
  tendencia: '+15%',
  margenError: '±3%',
  confianza: '92%'
};

// Alertas de pérdidas potenciales
const alertasPerdidas = [
  {
    articulo: 'Nike Air Max 270',
    perdida: 15,
    tendencia: 'Decreciente',
    recomendacion: 'Realizar pedido urgente de 30 unidades para cubrir la demanda actual. Las ventas muestran que este modelo tiene alta rotación y el stock está por debajo del mínimo requerido.'
  },
  {
    articulo: 'Adidas Ultraboost',
    perdida: 8,
    tendencia: 'Estable',
    recomendacion: 'Programar pedido de 20 unidades para la próxima semana. El nivel de inventario actual permite mantener las ventas por 2 semanas más.'
  },
  {
    articulo: 'Nike Air Force 1',
    perdida: 7,
    tendencia: 'Creciente',
    recomendacion: 'Solicitar 25 unidades adicionales. La tendencia de ventas está aumentando y se proyecta un incremento del 15% en la demanda del próximo mes.'
  }
];

export default function Predictivo() {

  const [chartType, setChartType] = useState("line");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predicciones, setPredicciones] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [metricas, setMetricas] = useState({
    precision: 92,
    tendencia: 15,
    margenError: 8,
    nivelConfianza: 95
  });
  const [productos, setProductos] = useState(dataset);
  const [alertas, setAlertas] = useState(alertasPerdidas);
  
  // Inicializar datos de gráficos
  useEffect(() => {
    setChartData(transformDataForCharts());
    setLoading(true);

    // Simulación de carga de datos
    setTimeout(() => {
      setPredicciones([
        {
          id: 1,
          producto: 'Producto A',
          demandaActual: 100,
          demandaPredicha: 120,
          tendencia: 'Aumento',
          confianza: 85
        },
        {
          id: 2,
          producto: 'Producto B',
          demandaActual: 150,
          demandaPredicha: 130,
          tendencia: 'Disminución',
          confianza: 78
        }
      ]);

      setTendencias([
        { mes: 'Enero', valor: 100 },
        { mes: 'Febrero', valor: 120 },
        { mes: 'Marzo', valor: 110 },
        { mes: 'Abril', valor: 130 },
        { mes: 'Mayo', valor: 125 }
      ]);

      setLoading(false);
    }, 1000);

    // Simulación de carga de datos adicional
    setTimeout(() => {
      setProductos(dataset);
      setAlertas(alertasPerdidas);
    }, 1500);
  }, []);
  
  // Función para cambiar el tipo de gráfico
  const handleChartTypeChange = (event) => {
    setChartType(event.detail.selectedItem.getAttribute("data-key"));
  };
  
  // Función para seleccionar un producto para análisis detallado
  const handleProductSelect = (product) => {
    setIsLoading(true);
    
    // Simular carga de datos
    setTimeout(() => {
      setSelectedProduct(product);
      setIsLoading(false);
    }, 1000);
  };
  
  // Función para volver a la vista general
  const handleBackToOverview = () => {
    setSelectedProduct(null);
  };
  
  // Obtener el estado de valor basado en la tendencia
  const getTendenciaValueState = (tendencia) => {
    switch (tendencia) {
      case 'Creciente':
        return ValueState.Success;
      case 'Decreciente':
        return ValueState.Error;
      case 'Estable':
      default:
        return ValueState.Neutral;
    }
  };
  
  // Obtener icono basado en la tendencia
  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'Creciente':
        return "trend-up";
      case 'Decreciente':
        return "trend-down";
      case 'Estable':
      default:
        return "pending";
    }
  };
  
  const getTendenciaColor = (tendencia) => {
    return tendencia === 'Aumento' ? ValueState.Success : ValueState.Error;
  };
  
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
      <PredictiveHeader />
      
      <div style={{
        padding: "0.5rem 1rem",
        backgroundColor: "var(--sapList_Background)",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "var(--sapContent_Shadow0)",
        margin: "0.5rem 0"
      }}>
        <FlexBox 
          justifyContent={FlexBoxJustifyContent.SpaceBetween}
          alignItems={FlexBoxAlignItems.Center}
          wrap={FlexBoxWrap.Wrap}
        >
          <SegmentedButton
            onSelectionChange={handleChartTypeChange}
          >
            <SegmentedButtonItem data-key="line" icon="line-chart" selected={chartType === "line"}>
              Tendencia
            </SegmentedButtonItem>
            <SegmentedButtonItem data-key="bar" icon="horizontal-bar-chart" selected={chartType === "bar"}>
              Comparativa
            </SegmentedButtonItem>
          </SegmentedButton>
          
          {selectedProduct && (
            <Button onClick={handleBackToOverview} icon="nav-back">
              Volver al Resumen
            </Button>
          )}
        </FlexBox>
      </div>

      <div style={{ padding: "1rem" }}>
        {/* Métricas de rendimiento del modelo */}
        {!selectedProduct && (
          <PredictiveMetrics metricas={metricas} />
        )}
        
        {/* Principal chart or product detail */}
        {isLoading ? (
          <FlexBox 
            direction={FlexBoxDirection.Column}
            justifyContent={FlexBoxJustifyContent.Center}
            alignItems={FlexBoxAlignItems.Center}
            style={{ height: "400px" }}
          >
            <BusyIndicator size="Large" />
            <Text style={{ marginTop: "1rem" }}>Analizando datos...</Text>
          </FlexBox>
        ) : selectedProduct ? (
          <PredictiveProductDetail 
            product={selectedProduct}
            chartType={chartType}
            getProductChartData={getProductChartData}
            getTendenciaIcon={getTendenciaIcon}
            alertasPerdidas={alertas}
          />
        ) : (
          <>
            <PredictiveChart 
              chartType={chartType}
              chartData={chartData}
            />
            
            <PredictiveProductList 
              products={productos}
              onProductSelect={handleProductSelect}
            />
          </>
        )}
      </div>
    </div>
  );
} 