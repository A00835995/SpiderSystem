# Generación de Datos para Machine Learning

## 📊 Descripción General

Estos scripts han sido optimizados para generar datos realistas que son útiles para entrenar modelos de Machine Learning en predicción de demanda y gestión de inventarios.

## 🚀 Scripts Disponibles

### 1. `insertVentas.js` - Generador de Ventas ML
- **Objetivo**: Generar 3,000 ventas con patrones realistas
- **Características**:
  - Fechas progresivas (último año)
  - Clasificación automática de productos por demanda (Alta/Media/Baja)
  - Patrones estacionales (menos ventas fines de semana, más viernes)
  - Cantidades variables según tipo de demanda

### 2. `insertOrdenes.js` - Generador de Órdenes ML
- **Objetivo**: Generar 800 órdenes de compra sistemáticas
- **Características**:
  - Fechas cada 1-2 semanas (horario laboral)
  - Agrupación por proveedor
  - Cantidades basadas en demanda simulada
  - Patrones de reabastecimiento realistas

### 3. `generarDatosML.js` - Coordinador y Análisis
- **Objetivo**: Ejecutar todo el proceso y generar reportes
- **Características**:
  - Estadísticas antes y después
  - Reporte completo de análisis ML
  - Identificación de productos de riesgo

## 📋 Cómo Usar

### Ejecución Individual

```bash
# Solo generar ventas
node Back/Faker/insertVentas.js

# Solo generar órdenes
node Back/Faker/insertOrdenes.js

# Generar reporte de análisis
node Back/Faker/generarDatosML.js
```

### Ejecución Completa Recomendada

```bash
# 1. Primero generar órdenes (abastecimiento)
node Back/Faker/insertOrdenes.js

# 2. Luego generar ventas (demanda)
node Back/Faker/insertVentas.js

# 3. Finalmente generar reporte
node Back/Faker/generarDatosML.js
```

## 📊 Datos Generados

### Distribución de Demanda
- **Alta Demanda (20%)**: 3-8 ventas diarias, 2-10 unidades por venta
- **Media Demanda (50%)**: 1-4 ventas diarias, 1-5 unidades por venta  
- **Baja Demanda (30%)**: 0-2 ventas diarias, 1-3 unidades por venta

### Patrones Temporales
- **Ventas**: Todos los días con variación semanal
- **Órdenes**: Cada 1-2 semanas, solo días laborales
- **Estacionalidad**: Menos actividad fines de semana

### Cantidades de Reabastecimiento
- **Alta Demanda**: 50-200 unidades por orden
- **Media Demanda**: 20-80 unidades por orden
- **Baja Demanda**: 5-30 unidades por orden

## 📁 Archivos Generados

- `inserts_ventas_ml.sql` - Comandos SQL para insertar ventas
- `inserts_ordenes_ml.sql` - Comandos SQL para insertar órdenes
- `reporte_ml_[fecha].txt` - Análisis estadístico completo

## 📈 Qué Analizar para ML

### 1. Patrones Temporales
- Ventas por mes/semana/día
- Estacionalidad por día de la semana
- Tendencias a largo plazo

### 2. Comportamiento por Producto
- Productos de alta/media/baja rotación
- Frecuencia de reabastecimiento
- Correlación entre órdenes y ventas

### 3. Indicadores de Riesgo
- Productos con ventas altas pero sin órdenes recientes
- Variabilidad en la demanda
- Tiempo entre órdenes y ventas

### 4. Métricas Clave para ML
- **Demanda promedio**: Unidades vendidas por período
- **Variabilidad**: Desviación estándar de las ventas
- **Ciclo de reposición**: Días entre órdenes
- **Cobertura**: Relación entre stock y demanda

## 🎯 Modelos ML Sugeridos

### 1. Predicción de Demanda
- **Variables**: Mes, día semana, producto, historial ventas
- **Objetivo**: Predecir ventas próximos 30 días
- **Modelos**: Time Series, Random Forest, LSTM

### 2. Optimización de Inventario
- **Variables**: Demanda, lead time, costos, estacionalidad
- **Objetivo**: Determinar cuándo y cuánto ordenar
- **Modelos**: Reinforcement Learning, Optimization

### 3. Detección de Anomalías
- **Variables**: Patrones de venta, frecuencia órdenes
- **Objetivo**: Identificar productos con comportamiento atípico
- **Modelos**: Isolation Forest, Autoencoders

## ⚠️ Consideraciones Importantes

1. **Datos Base**: Asegúrate de tener al menos 20 artículos en la base
2. **Proveedores**: Verifica que los artículos tengan proveedores asignados
3. **Fechas**: Los datos cubren los últimos 12 meses para ventas, 5 meses para órdenes
4. **Realismo**: Los patrones simulan comportamiento real pero son artificiales

## 🔧 Personalización

Puedes ajustar los parámetros en cada script:

```javascript
// En insertVentas.js
generarVentasML(3000); // Cambiar número de ventas objetivo

// En insertOrdenes.js  
generarOrdenesML(800); // Cambiar número de órdenes objetivo

// Proporciones de demanda en classifyArticlesByDemand()
altaDemanda: shuffled.slice(0, Math.floor(total * 0.2)), // 20%
```

## 📞 Soporte

Si encuentras errores o necesitas personalizar los patrones, revisa:
1. Conexión a la base de datos en `confDB.js`
2. Estructura de tablas (VENTA, VentaEnc, ORDEN, ORDENART, etc.)
3. Variables de entorno en `.env` 