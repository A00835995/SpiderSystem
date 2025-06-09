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
  FlexBoxAlignItems,
  Icon,
  Text
} from "@ui5/webcomponents-react";

export default function PredictiveProductDetail({ 
  product
}) {
  // Determinar si necesita reorden basado en el déficit
  const necesitaReorden = (product.deficitEstimado || 0) > 0;
  
  // Generar recomendación basada en el riesgo
  const getRecomendacion = (riesgo) => {
    switch (riesgo?.toUpperCase()) {
      case 'CRITICO':
        return 'Acción inmediata requerida. Realizar pedido urgente para evitar desabastecimiento total.';
      case 'ALTO':
        return 'Planificar reorden en los próximos días. Monitorear de cerca las ventas.';
      case 'MEDIO':
        return 'Considerar reorden en las próximas semanas. Mantener seguimiento regular.';
      case 'BAJO':
        return 'Stock suficiente por ahora. Continuar con monitoreo rutinario.';
      default:
        return 'Revisar datos del producto para determinar acción apropiada.';
    }
  };

  // Función para obtener el estado de valor basado en el riesgo
  const getRiskValueState = (riesgo) => {
    switch (riesgo?.toUpperCase()) {
      case 'CRITICO':
        return ValueState.Error;
      case 'ALTO':
        return ValueState.Error;
      case 'MEDIO':
        return ValueState.Warning;
      case 'BAJO':
        return ValueState.Success;
      default:
        return ValueState.Neutral;
    }
  };

  // Función para obtener el icono basado en el riesgo
  const getRiskIcon = (riesgo) => {
    switch (riesgo?.toUpperCase()) {
      case 'CRITICO':
        return "alert";
      case 'ALTO':
        return "warning";
      case 'MEDIO':
        return "notification-2";
      case 'BAJO':
        return "accept";
      default:
        return "question-mark";
    }
  };

  return (
    <>      
      <Card style={{ marginBottom: "1rem" }}>
        <div style={{ padding: "1rem" }}>
          <Grid defaultSpan="XL6 L6 M12 S12">
            <div>
              <Title level="H4" style={{ marginBottom: "1rem" }}>Métricas del Producto</Title>
              <List>
                <StandardListItem 
                  infoState={ValueState.Information}
                  icon="inventory"
                >
                  Existencia Actual: {product.existenciaActual || 0} unidades
                </StandardListItem>
                <StandardListItem 
                  infoState={ValueState.Success}
                  icon="trend-up"
                >
                  Predicción de Demanda en el siguiente mes: {product.prediccion || 0} unidades
                </StandardListItem>
                <StandardListItem 
                  infoState={(product.deficitEstimado || 0) > 0 ? ValueState.Error : ValueState.Success}
                  icon={(product.deficitEstimado || 0) > 0 ? "alert" : "accept"}
                >
                  Déficit Estimado en el siguiente mes: {product.deficitEstimado || 0} unidades
                </StandardListItem>
                <StandardListItem 
                  infoState={getRiskValueState(product.riesgo)}
                  icon={getRiskIcon(product.riesgo)}
                >
                  Nivel de Riesgo: {product.riesgo || 'N/A'}
                </StandardListItem>
                {product.ventaPromedioMensual && (
                  <StandardListItem 
                    infoState={ValueState.Neutral}
                    icon="chart-axis"
                  >
                    Venta Promedio Mensual: {parseFloat(product.ventaPromedioMensual).toFixed(2)} unidades/mes
                  </StandardListItem>
                )}
                {product.diasCobertura !== undefined && (
                  <StandardListItem 
                    infoState={parseFloat(product.diasCobertura || 0) < 30 ? ValueState.Warning : ValueState.Success}
                    icon="time-overtime"
                  >
                    Días de Cobertura: {Math.round(parseFloat(product.diasCobertura || 0))} días
                  </StandardListItem>
                )}
                {product.diasPromEntreOrdenes && (
                  <StandardListItem 
                    infoState={ValueState.Neutral}
                    icon="time-account"
                  >
                    Días Promedio Entre Órdenes: {parseFloat(product.diasPromEntreOrdenes).toFixed(1)} días
                  </StandardListItem>
                )}
              </List>
            </div>
            
            <div>
              <Title level="H4" style={{ marginBottom: "1rem" }}>Estado del Producto</Title>
              <List>
                <StandardListItem 
                  infoState={necesitaReorden ? ValueState.Warning : ValueState.Success}
                  icon={necesitaReorden ? "cart-3" : "accept"}
                >
                  Necesita Reorden: {necesitaReorden ? "Sí" : "No"}
                </StandardListItem>
                {product.totalOrdenes && (
                  <StandardListItem 
                    infoState={ValueState.Neutral}
                    icon="sales-order"
                  >
                    Total de Órdenes: {product.totalOrdenes}
                  </StandardListItem>
                )}
                {product.prioridadReorden && (
                  <StandardListItem 
                    infoState={product.prioridadReorden <= 2 ? ValueState.Error : 
                              product.prioridadReorden <= 5 ? ValueState.Warning : ValueState.Success}
                    icon="priority-1"
                  >
                    Prioridad de Reorden: {product.prioridadReorden}
                  </StandardListItem>
                )}
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
          <div style={{ marginBottom: "1rem" }}>
            <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ marginBottom: "0.5rem" }}>
              <Icon name={getRiskIcon(product.riesgo)} style={{ marginRight: "0.5rem" }} />
              <Text style={{ fontWeight: "bold" }}>
                Recomendación para riesgo {product.riesgo}:
              </Text>
            </FlexBox>
            <Text style={{ marginBottom: "0.5rem" }}>
              {product.recomendacion || getRecomendacion(product.riesgo)}
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
} 