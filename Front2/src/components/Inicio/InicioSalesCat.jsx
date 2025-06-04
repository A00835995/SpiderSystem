import React, { useEffect, useState } from "react";
import { Card, CardHeader, FlexBox, Text, Icon } from "@ui5/webcomponents-react";
import { fetchVentasXCategoria } from "../../services/InicioService";
import { styles } from "../../Styles/InicioStyle"; 
import "@ui5/webcomponents-icons/dist/pie-chart.js";

export default function InicioSalesCat() {
  const [categories, setCategories] = useState([]);
  const customColors = ["#1976d2", "#388e3c", "#e64a19", "#fbc02d"];

  useEffect(() => {
    fetchVentasXCategoria().then(setCategories).catch(console.error);
  }, []);

  return (
    <Card style={styles.categoryCard}>
      <CardHeader
        titleText="Ventas por Categoría"
        subtitleText="Distribución actual"
        avatar={<Icon name="pie-chart" />}
      />
      {categories.map((categoria, index) => (
        <div key={index} style={styles.categoryItem}>
          <FlexBox style={styles.categoryHeader}>
            <Text style={styles.categoryName}>{categoria.categoria || 'Sin categoría'}</Text>
            <Text style={styles.categoryValue}>
              ${(categoria.total || 0).toLocaleString()}
            </Text>
          </FlexBox>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${categoria.porcentaje || 0}%`,
                backgroundColor: customColors[index % customColors.length]
              }}
            />
          </div>
          <Text style={styles.progressLabel}>{categoria.porcentaje || 0}% del total</Text>
        </div>
      ))}
    </Card>
  );
}