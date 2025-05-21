import React from "react";
import {
  Card,
  CardHeader,
  Grid,
  Title,
  List,
  StandardListItem,
  ValueState,
  MessageStrip,
  FlexBox,
  FlexBoxDirection,
  FlexBoxAlignItems,
  Icon,
  Text
} from "@ui5/webcomponents-react";
import { LineChart, BarChart } from "@ui5/webcomponents-react-charts";

export default function PredictiveProductDetail({ 
  product, 
  chartType,
  getProductChartData,
  getTendenciaIcon,
  alertasPerdidas 
}) {
  return (
    <>
      <Card style={{ marginBottom: "1rem" }}>
        <CardHeader titleText={`Análisis Detallado: ${product.articulo}`} />
        <div style={{ padding: "1rem" }}>
          <Grid defaultSpan="XL6 L6 M12 S12">
            <div>
              <Title level="H4" style={{ marginBottom: "1rem" }}>Tendencia Histórica y Proyección</Title>
              <div style={{ height: "400px" }}>
                {chartType === "line" ? (
                  <LineChart 
                    dataset={getProductChartData(product)}
                    dimensions={[{ accessor: "mes", label: "Mes" }]}
                    measures={[
                      { accessor: "ventas", label: "Ventas" },
                      { accessor: "prediccion", label: "Predicción", type: "line" }
                    ]}
                    chartConfig={{
                      zoomingTool: true,
                      legendPosition: "bottom",
                      legendHorizontalAlign: "center"
                    }}
                  />
                ) : (
                  <BarChart 
                    dataset={getProductChartData(product)}
                    dimensions={[{ accessor: "mes" }]}
                    measures={[
                      { accessor: "ventas", label: "Ventas Reales" },
                      { accessor: "prediccion", label: "Predicción" }
                    ]}
                    chartConfig={{
                      zoomingTool: true,
                      legendPosition: "bottom",
                      legendHorizontalAlign: "center"
                    }}
                  />
                )}
              </div>
            </div>
            
            <div>
              <Title level="H4" style={{ marginBottom: "1rem" }}>Métricas del Producto</Title>
              <List>
                <StandardListItem 
                  info={`${product.ventas} unidades`} 
                  infoState={ValueState.Information}
                  icon="cart"
                >
                  Ventas Actuales (Mayo)
                </StandardListItem>
                <StandardListItem 
                  info={`${product.prediccion} unidades`} 
                  infoState={ValueState.Success}
                  icon="increase"
                >
                  Predicción (Junio)
                </StandardListItem>
                <StandardListItem 
                  info={`${Math.round((product.prediccion - product.ventas) / product.ventas * 100)}%`} 
                  infoState={ValueState.Success}
                  icon="trend-up"
                >
                  Crecimiento Proyectado
                </StandardListItem>
                <StandardListItem 
                  info={`${product.perdidas} unidades`} 
                  infoState={product.perdidas > 10 ? ValueState.Error : ValueState.Warning}
                  icon="alert"
                >
                  Pérdidas Potenciales
                </StandardListItem>
              </List>
            </div>
          </Grid>
        </div>
      </Card>
      
      <Card>
        <CardHeader 
          titleText="Recomendaciones" 
          avatar={<Icon name="learning-assistant" />}
        />
        <div style={{ padding: "1rem" }}>
          <MessageStrip
            design="Information"
            hideCloseButton
            icon="business-objects-experience"
            style={{ marginBottom: "1rem" }}
          >
            Recomendaciones basadas en análisis de tendencias y patrones de comportamiento
          </MessageStrip>
          
          {alertasPerdidas.filter(alerta => alerta.articulo === product.articulo).map((alerta, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: "0.5rem" }}>
                <Icon name={getTendenciaIcon(alerta.tendencia)} style={{ marginRight: "0.5rem" }} />
                <Text style={{ fontWeight: "bold" }}>
                  Tendencia: {alerta.tendencia}
                </Text>
              </FlexBox>
              <Text style={{ marginBottom: "0.5rem" }}>
                {alerta.recomendacion}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
} 