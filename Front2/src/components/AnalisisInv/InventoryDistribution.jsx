import React from "react";
import { Card, CardHeader, Text, Icon, FlexBox } from "@ui5/webcomponents-react";
import { styles } from "../../Styles/InicioStyle";

export default function InventoryDistribution({ categoryDistribution }) {
  return (
    <Card
      style={styles.categoryCard}
      header={
        <CardHeader
          titleText="Distribución por Categoría"
          subtitleText="Distribución actual del inventario"
          avatar={<Icon name="donut-chart" />}
        />
      }
    >
      {categoryDistribution.map((category, index) => (
        <div key={index} style={styles.categoryItem}>
          <FlexBox style={styles.categoryHeader}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryValue}>
              {category.count} productos
            </Text>
          </FlexBox>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${category.percentage}%`,
                backgroundColor: category.color
              }}
            />
          </div>
          <Text style={styles.progressLabel}>{category.percentage}% del total</Text>
        </div>
      ))}
    </Card>
  );
} 