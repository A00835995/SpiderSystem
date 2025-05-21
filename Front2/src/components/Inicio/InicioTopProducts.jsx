import React from "react";
import { Card, Title, Text } from "@ui5/webcomponents-react";
import { styles } from "../../Styles/InicioStyle"; // Ajusta la ruta si es necesario

export default function InicioTopProducts({ products }) {
  return (
    <>
      <Title level="H2" style={styles.productsHeader}>Productos Más Vendidos del Mes</Title>
      <div style={styles.productsGrid}>
        {products.map((producto, index) => (
          <Card key={index} style={styles.productCard}>
            <div style={styles.productImageContainer}>
              <img
                src={producto.imagen || "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                alt={producto.nombre}
                style={styles.productImage}
              />
            </div>
            <div style={styles.productInfo}>
              <div style={styles.productHeader}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <Text style={styles.productName}>{producto.nombre}</Text>
                  <Text style={styles.productPrice}>${producto.precio}</Text>
                </div>
              </div>
              <div style={styles.productMetrics}>
                <div style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Vendidos</Text>
                  <Text style={styles.metricValue}>{producto.total} unidades</Text>
                </div>
                <div style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Disponibles</Text>
                  <Text style={styles.metricValue}>{producto.existencia} unidades</Text>
                </div>
                <div style={styles.stockIndicator}>
                  <div 
                    style={{
                      ...styles.stockDot,
                      backgroundColor: producto.estado === "Disponible" ? "var(--sapIndicationColor_4)"
                      : producto.estado === "Bajo stock" ? "var(--sapIndicationColor_3)"
                      : "var(--sapIndicationColor_1)"
                    }}
                  />
                  <Text style={styles.stockText}>{producto.estado}</Text>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}