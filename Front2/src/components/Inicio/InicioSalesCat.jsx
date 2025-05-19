import React, { useEffect, useState } from "react";
import { Card, CardHeader, FlexBox, Text, Icon } from "@ui5/webcomponents-react";
import { fetchVentasXCategoria } from "../../services/InicioService";
import { styles } from "../../Styles/InicioStyle"; 

export default function InicioSalesCat() {
  const [categories, setCategories] = useState([]);
  const customColors = ["#1976d2", "#388e3c", "#e64a19", "#fbc02d"];


  useEffect(() => {
    fetchVentasXCategoria().then(setCategories);
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
            <Text style={styles.categoryName}>{categoria.categoria}</Text>
            <Text style={styles.categoryValue}>
              ${categoria.total.toLocaleString()}
            </Text>
          </FlexBox>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${categoria.porcentaje}%`,
                backgroundColor: customColors[index % customColors.length]
              }}
            />
          </div>
          <Text style={styles.progressLabel}>{categoria.porcentaje}% del total</Text>
        </div>
      ))}
    </Card>
  );
}