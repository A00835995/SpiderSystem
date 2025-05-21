import React from "react";
import { Grid, Card, CardHeader, Title, Text, Icon } from "@ui5/webcomponents-react";

export default function PredictiveMetrics({ metricas }) {
  return (
    <Grid defaultSpan="XL3 L3 M6 S12" style={{ marginBottom: "1rem" }}>
      <Card>
        <CardHeader
          titleText="Precisión del Modelo"
          avatar={<Icon name="status-positive" />}
        />
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <Title style={{ fontSize: "2rem", color: "var(--sapPositiveColor)" }}>
            {metricas.precision}
          </Title>
          <Text>
            La precisión de nuestras predicciones en los últimos 3 meses
          </Text>
        </div>
      </Card>
      
      <Card>
        <CardHeader
          titleText="Tendencia de Ventas"
          avatar={<Icon name="increase" />}
        />
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <Title style={{ fontSize: "2rem", color: "var(--sapPositiveColor)" }}>
            {metricas.tendencia}
          </Title>
          <Text>
            Crecimiento proyectado para el próximo mes
          </Text>
        </div>
      </Card>
      
      <Card>
        <CardHeader
          titleText="Margen de Error"
          avatar={<Icon name="alert" />}
        />
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <Title style={{ fontSize: "2rem" }}>
            {metricas.margenError}
          </Title>
          <Text>
            Margen de error de nuestras predicciones
          </Text>
        </div>
      </Card>
      
      <Card>
        <CardHeader
          titleText="Nivel de Confianza"
          avatar={<Icon name="bullet-text" />}
        />
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <Title style={{ fontSize: "2rem", color: "var(--sapAccentColor4)" }}>
            {metricas.confianza}
          </Title>
          <Text>
            Intervalo de confianza del modelo predictivo
          </Text>
        </div>
      </Card>
    </Grid>
  );
} 