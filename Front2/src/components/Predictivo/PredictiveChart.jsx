import React from "react";
import { Card, CardHeader, Text, FlexBox, FlexBoxAlignItems, FlexBoxJustifyContent } from "@ui5/webcomponents-react";
import { LineChart, BarChart } from "@ui5/webcomponents-react-charts";

export default function PredictiveChart({ 
  chartType, 
  chartData, 
  selectedYear, 
  hasRealSalesData, 
  hasPredictionData 
}) {
  // Título dinámico basado en el año y tipo de datos
  const getChartTitle = () => {
    const typeText = chartType === "line" ? "Lineal" : "Comparativa";
    const dataInfo = [];
    
    if (hasRealSalesData) dataInfo.push("Datos Históricos");
    if (hasPredictionData) dataInfo.push("Predicciones ML");
    
    const dataText = dataInfo.length > 0 ? ` - ${dataInfo.join(" + ")}` : "";
    
    return `Tendencia de Ventas ${selectedYear} ${typeText}${dataText}`;
  };

  // Estadísticas rápidas
  const getQuickStats = () => {
    if (!chartData || chartData.length === 0) return null;

    const ventasReales = chartData.filter(d => d.ventas !== undefined && d.ventas !== null).map(d => d.ventas);
    const predicciones = chartData.filter(d => d.prediccion !== undefined && d.prediccion !== null).map(d => d.prediccion);

    const totalVentas = ventasReales.reduce((sum, val) => sum + val, 0);
    const totalPredicciones = predicciones.reduce((sum, val) => sum + val, 0);
    const promedioVentas = ventasReales.length > 0 ? Math.round(totalVentas / ventasReales.length) : 0;
    const promedioPredicciones = predicciones.length > 0 ? Math.round(totalPredicciones / predicciones.length) : 0;

    return {
      totalVentas,
      totalPredicciones,
      promedioVentas,
      promedioPredicciones,
      mesesConVentas: ventasReales.length,
      mesesConPredicciones: predicciones.length
    };
  };

  const stats = getQuickStats();

  if (!chartData || chartData.length === 0) {
    return (
      <Card style={{ marginBottom: "1rem" }}>
        <CardHeader titleText={`Tendencia de Ventas ${selectedYear}`} />
        <div style={{ height: "400px", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Text>📊 No hay datos disponibles para mostrar</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardHeader titleText={getChartTitle()} />
      
      {/* Estadísticas rápidas */}
      {stats && (
        <div style={{ 
          padding: "0.5rem 1rem", 
          backgroundColor: "var(--sapList_Background)",
          borderBottom: "1px solid var(--sapList_BorderColor)"
        }}>
          <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
            {hasRealSalesData && (
              <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "0.5rem" }}>
                <div style={{ 
                  width: "12px", 
                  height: "12px", 
                  backgroundColor: "#28a745", 
                  borderRadius: "50%" 
                }}></div>
                <Text style={{ fontSize: "0.875rem" }}>
                  Ventas: {stats.totalVentas} total | {stats.promedioVentas} promedio | {stats.mesesConVentas} meses
                </Text>
              </FlexBox>
            )}
            
            {hasPredictionData && (
              <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "0.5rem" }}>
                <div style={{ 
                  width: "12px", 
                  height: "12px", 
                  backgroundColor: "#007bff", 
                  borderRadius: "50%" 
                }}></div>
                <Text style={{ fontSize: "0.875rem" }}>
                  Predicciones: {stats.totalPredicciones} total | {stats.promedioPredicciones} promedio | {stats.mesesConPredicciones} meses
                </Text>
              </FlexBox>
            )}
          </FlexBox>
        </div>
      )}

      <div style={{ height: "400px", padding: "1rem" }}>
        {chartType === "line" ? (
          <LineChart 
            dataset={chartData}
            dimensions={[{ accessor: "mes" }]}
            measures={[
              { 
                accessor: "ventas", 
                label: "Ventas Reales",
                color: "#28a745",
                
              },
              { 
                accessor: "prediccion", 
                label: "Predicción",
                color: "#007bff",
              }
            ]}
            chartConfig={{
              legendPosition: "top",
              legendHorizontalAlign: "left",
              paddingTop: 50,
              zoomingTool: false,
              resizeDebounce: 250,
              connectNulls: false,
              tooltip: {
                trigger: 'axis',
               
              }
            }}
          />
        ) : (
          <BarChart 
            dataset={chartData}
            dimensions={[{ accessor: "mes" }]}
            measures={[
              { 
                accessor: "ventas", 
                label: "Ventas Reales",
                color: "#28a745",
                formatter: (value) => value !== undefined && value !== null ? `${value} unidades` : 'Sin datos'
              },
              { 
                accessor: "prediccion", 
                label: "Predicción",
                color: "#007bff",
                formatter: (value) => value !== undefined && value !== null ? `${value} unidades` : 'Sin datos'
              }
            ]}
            chartConfig={{
              legendPosition: "top",
              legendHorizontalAlign: "left",
              paddingTop: 50,
              zoomingTool: false,
              resizeDebounce: 250,
              tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                  if (!params || params.length === 0) return '';
                  
                  const month = params[0].name;
                  let tooltip = `<strong>${month}</strong><br/>`;
                  
                  params.forEach(param => {
                    const value = param.value;
                    const color = param.color;
                    const seriesName = param.seriesName;
                    
                    if (value !== undefined && value !== null) {
                      tooltip += `<span style="color: ${color}">●</span> ${seriesName}: ${value} unidades<br/>`;
                    }
                  });
                  
                  return tooltip;
                }
              }
            }}
          />
        )}
      </div>
    </Card>
  );
} 