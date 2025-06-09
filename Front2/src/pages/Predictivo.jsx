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
  BusyIndicator,
  Select,
  Option
} from "@ui5/webcomponents-react";
import { useUI5Theme } from "../components/UI5ThemeProvider";
import PredictiveHeader from "../components/Predictivo/PredictiveHeader";
import PredictiveChart from "../components/Predictivo/PredictiveChart";
import PredictiveProductList from "../components/Predictivo/PredictiveProductList";
import PredictiveProductDetail from "../components/Predictivo/PredictiveProductDetail";
import { usePredictivo } from "../hooks/usePredictivo";

// Importar íconos necesarios
import "@ui5/webcomponents-icons/dist/AllIcons.js";

export default function Predictivo() {
  const { isDarkMode } = useUI5Theme();
  const [chartType, setChartType] = useState("line");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Usar el hook personalizado para datos predictivos reales
  const {
    tendenciaData,
    riesgoStockData,
    chartData: realChartData,
    statistics,
    loading,
    loadingRiesgoStock,
    error,
    errorRiesgoStock,
    selectedYear,
    selectedPeriod,
    availableYears,
    changeYear,
    refresh,
    refreshRiesgoStock,
    loadRiesgoStock,
    hasData,
    hasRealSalesData,
    hasPredictionData,
    hasRiskData
  } = usePredictivo(2025);

  // Debug del estado actual (después de declarar el hook)
  console.log('🔍 DEBUG - Estado actual del componente Predictivo:');
  console.log('  - selectedProduct:', selectedProduct);
  console.log('  - isLoading:', isLoading);
  console.log('  - loading:', loading);
  console.log('  - loadingRiesgoStock:', loadingRiesgoStock);
  
  // Usar datos reales del API de riesgo de stock en lugar de datos mock
  const productos = React.useMemo(() => {
    console.log('🔍 DEBUG - riesgoStockData completo:', riesgoStockData);
    
    if (!riesgoStockData || !riesgoStockData.data || !riesgoStockData.data.productos) {
      console.log('❌ DEBUG - No hay datos de riesgo de stock');
      return [];
    }
    
    console.log('📊 DEBUG - Productos del API:', riesgoStockData.data.productos);
    console.log('📊 DEBUG - Cantidad de productos:', riesgoStockData.data.productos.length);
    
    // Transformar datos del API al formato esperado por los componentes
    const productosTransformados = riesgoStockData.data.productos.map(producto => {
      console.log('🔄 DEBUG - Transformando producto:', producto);
      
      return {
        // Mantener compatibilidad con el formato anterior
        articulo: producto.artNombre,
        ventas: producto.existenciaActual,
        prediccion: producto.prediccion,
        perdidas: producto.deficitEstimado,
        
        // Agregar todos los datos nuevos del API
        ...producto
      };
    });
    
    console.log('✅ DEBUG - Productos transformados:', productosTransformados);
    return productosTransformados;
  }, [riesgoStockData]);

  // Cargar datos de riesgo de stock al inicializar
  React.useEffect(() => {
    console.log('🚀 DEBUG - useEffect para cargar riesgo de stock');
    console.log('📅 DEBUG - selectedPeriod:', selectedPeriod);
    console.log('🔧 DEBUG - loadRiesgoStock function:', typeof loadRiesgoStock);
    
    if (selectedPeriod) {
      console.log('✅ DEBUG - Cargando riesgo de stock para período:', selectedPeriod);
      loadRiesgoStock(selectedPeriod);
    } else {
      console.log('❌ DEBUG - No hay selectedPeriod definido');
    }
  }, [selectedPeriod, loadRiesgoStock]);
  
  // Debug de estados
  React.useEffect(() => {
    console.log('📊 DEBUG - Estados actuales:');
    console.log('  - loading:', loading);
    console.log('  - loadingRiesgoStock:', loadingRiesgoStock);
    console.log('  - error:', error);
    console.log('  - errorRiesgoStock:', errorRiesgoStock);
    console.log('  - hasData:', hasData);
    console.log('  - hasRiskData:', hasRiskData);
    console.log('  - productos.length:', productos.length);
  }, [loading, loadingRiesgoStock, error, errorRiesgoStock, hasData, hasRiskData, productos]);
  
  // Transformar datos reales del API al formato esperado por el gráfico
  const chartData = React.useMemo(() => {
    if (!tendenciaData || !tendenciaData.data || !tendenciaData.data.meses) {
      return [];
    }

    // 🔍 LOG: Mostrar datos exactos del backend
    console.log('📊 Datos exactos del backend:', tendenciaData.data.meses);

    return tendenciaData.data.meses.map(mes => {
      // 🔍 LOG: Mostrar cada mes individual
      console.log(`Mes ${mes.nombreMes}:`, {
        ventasReales: mes.ventasReales,
        prediccion: mes.prediccion,
        tieneVentasReales: mes.tieneVentasReales,
        tienePrediccion: mes.tienePrediccion
      });

      return {
        mes: mes.nombreMes,
        // Solo mostrar ventas si tieneVentasReales es true, sino undefined para no dibujar punto
        ventas: mes.tieneVentasReales ? mes.ventasReales : undefined,
        // Solo mostrar predicción si tienePrediccion es true, sino undefined para no dibujar punto
        prediccion: mes.tienePrediccion ? mes.prediccion : undefined
      };
    });
  }, [tendenciaData]);
  
  // Función para cambiar el tipo de gráfico
  const handleChartTypeChange = (event) => {
    setChartType(event.detail.selectedItem.getAttribute("data-key"));
  };
  
  // Función para cambiar el año
  const handleYearChange = (event) => {
    const newYear = parseInt(event.detail.selectedOption.getAttribute("data-year"));
    changeYear(newYear);
  };
  

  
  // Función para seleccionar un producto para análisis detallado
  const handleProductSelect = (product) => {
    console.log('🔍 DEBUG - handleProductSelect llamado con producto:', product);
    setIsLoading(true);
    
    // Simular carga de datos
    setTimeout(() => {
      console.log('🔍 DEBUG - Estableciendo selectedProduct:', product);
      setSelectedProduct(product);
      setIsLoading(false);
      console.log('🔍 DEBUG - selectedProduct establecido, isLoading:', false);
    }, 1000);
  };
  
  // Función para volver a la vista general
  const handleBackToOverview = () => {
    setSelectedProduct(null);
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
          style={{ width: "100%" }}
        >
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "1rem" }}>
            {selectedProduct ? (
              <Text style={{ 
                fontSize: "1.125rem", 
                fontWeight: "600",
                color: "var(--sapTextColor)"
              }}>
                Análisis Detallado: {selectedProduct.artNombre || selectedProduct.articulo}
              </Text>
            ) : (
              <>
                <SegmentedButton onSelectionChange={handleChartTypeChange}>
            <SegmentedButtonItem data-key="line" icon="line-chart" selected={chartType === "line"}>
              Tendencia
            </SegmentedButtonItem>
            <SegmentedButtonItem data-key="bar" icon="horizontal-bar-chart" selected={chartType === "bar"}>
              Comparativa
            </SegmentedButtonItem>
          </SegmentedButton>
                
                <Select 
                  onChange={handleYearChange}
                  style={{ minWidth: "120px" }}
                >
                  {availableYears.map(year => (
                    <Option 
                      key={year} 
                      data-year={year}
                      selected={year === selectedYear}
                    >
                      {year}
                    </Option>
                  ))}
                </Select>
              </>
            )}
          </FlexBox>
          
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "0.5rem" }}>
            {!selectedProduct && (
              <>
                <Button 
                  onClick={() => {
                    refresh();
                    refreshRiesgoStock();
                  }} 
                  icon="refresh" 
                  disabled={loading || loadingRiesgoStock}
                >
                  Actualizar Datos
                </Button>
              </>
            )}
          
          {selectedProduct && (
            <Button onClick={handleBackToOverview} icon="nav-back">
              Volver al Resumen
            </Button>
          )}
          </FlexBox>
        </FlexBox>
      </div>

      <div style={{ padding: "1rem" }}>
        {/* Mostrar errores si existen */}
        {error && (
          <div style={{
            padding: "1rem",
            backgroundColor: "var(--sapErrorBackground)",
            color: "var(--sapErrorColor)",
            borderRadius: "0.5rem",
            marginBottom: "1rem"
          }}>
            <Text>❌ Error en Tendencias: {error}</Text>
            <Button onClick={refresh} style={{ marginTop: "0.5rem" }}>
              Reintentar Tendencias
            </Button>
          </div>
        )}

        {errorRiesgoStock && (
          <div style={{
            padding: "1rem",
            backgroundColor: "var(--sapErrorBackground)",
            color: "var(--sapErrorColor)",
            borderRadius: "0.5rem",
            marginBottom: "1rem"
          }}>
            <Text>❌ Error en Riesgo de Stock: {errorRiesgoStock}</Text>
            <Button onClick={refreshRiesgoStock} style={{ marginTop: "0.5rem" }}>
              Reintentar Riesgo de Stock
            </Button>
          </div>
        )}
        
        {/* Principal chart or product detail */}
        {loading || isLoading || loadingRiesgoStock ? (
          <FlexBox 
            direction={FlexBoxDirection.Column}
            justifyContent={FlexBoxJustifyContent.Center}
            alignItems={FlexBoxAlignItems.Center}
            style={{ height: "400px" }}
          >
            <BusyIndicator size="Large" />
            <Text style={{ marginTop: "1rem" }}>
              {loading ? "Cargando datos de tendencia..." : 
               loadingRiesgoStock ? "Cargando análisis de riesgo de stock..." :
               "Analizando datos..."}
            </Text>
          </FlexBox>
        ) : selectedProduct ? (
          <>
            {console.log('🔍 DEBUG - Mostrando PredictiveProductDetail con producto:', selectedProduct)}
          <PredictiveProductDetail 
            product={selectedProduct}
          />
          </>
        ) : hasData || hasRiskData ? (
          <>
            {hasData && (
            <PredictiveChart 
              chartType={chartType}
              chartData={chartData}
                selectedYear={selectedYear}
                hasRealSalesData={hasRealSalesData}
                hasPredictionData={hasPredictionData}
            />
            )}
            
            {hasRiskData && (
            <PredictiveProductList 
              products={productos}
              onProductSelect={handleProductSelect}
            />
            )}
          </>
        ) : (
          <FlexBox 
            direction={FlexBoxDirection.Column}
            justifyContent={FlexBoxJustifyContent.Center}
            alignItems={FlexBoxAlignItems.Center}
            style={{ height: "400px" }}
          >
            <Text>📊 No hay datos disponibles</Text>
            <Text style={{ marginTop: "0.5rem", color: "var(--sapNeutralTextColor)" }}>
              Selecciona un año diferente para ver las tendencias de ventas
            </Text>
          </FlexBox>
        )}
      </div>
    </div>
  );
} 