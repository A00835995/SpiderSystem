import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  Icon,
  Title,
  Text
} from "@ui5/webcomponents-react";

export default function InventoryStats({
  inventoryStats,
  styles
}) {
  return (
    <Grid defaultSpan="XL3 L3 M6 S12" className={styles.statCard}>
      <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardHeader titleText="Total de Productos" avatar={<Icon name="inventory" />} />
        <div className={styles.statInfo}>
          <Title className={styles.statValue}>{inventoryStats.total}</Title>
          <Text className={styles.statLabel}>Productos en el inventario</Text>
        </div>
      </Card>

      <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardHeader titleText="Productos Disponibles" avatar={<Icon name="shipping-status" />} />
        <div className={styles.statInfo}>
          <Title className={styles.statValue}>{inventoryStats.disponibles}</Title>
          <Text className={styles.statLabel}>Productos en stock</Text>
        </div>
      </Card>

      <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardHeader titleText="Bajo Stock" avatar={<Icon name="warning" />} />
        <div className={styles.statInfo}>
          <Title className={styles.statValue} style={{ color: "var(--sapWarningColor)" }}>{inventoryStats.bajoStock}</Title>
          <Text className={styles.statLabel}>Productos con bajo stock</Text>
        </div>
      </Card>

      <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardHeader titleText="Agotados" avatar={<Icon name="alert" />} />
        <div className={styles.statInfo}>
          <Title className={styles.statValue} style={{ color: "var(--sapErrorColor)" }}>{inventoryStats.agotados}</Title>
          <Text className={styles.statLabel}>Productos sin stock</Text>
        </div>
      </Card>
    </Grid>
  );
}
