const { connectToHANA } = require('../Config/confDB');
const fs = require('fs');
require('dotenv').config();

// Importar los generadores
const { generarVentasML } = require('./insertVentas');
const { generarOrdenesML } = require('./insertOrdenes');

async function obtenerEstadisticasActuales() {
  const conn = await connectToHANA();
  const stats = {};

  // Estadísticas de artículos
  const articulos = await new Promise((resolve, reject) => {
    conn.exec(`SELECT COUNT(*) as total FROM "DBADMIN"."ARTICULO" WHERE "ELIMINADO" = 0`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });

  // Estadísticas de proveedores únicos
  const proveedores = await new Promise((resolve, reject) => {
    conn.exec(`SELECT COUNT(DISTINCT "IDPROV") as total FROM "DBADMIN"."ARTICULO" WHERE "ELIMINADO" = 0`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });

  // Estadísticas de ventas existentes
  const ventas = await new Promise((resolve, reject) => {
    conn.exec(`SELECT COUNT(*) as total FROM "DBADMIN"."VENTA" WHERE "ELIMINADO" = 0`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });

  // Estadísticas de órdenes existentes
  const ordenes = await new Promise((resolve, reject) => {
    conn.exec(`SELECT COUNT(*) as total FROM "DBADMIN"."ORDEN" WHERE "ELIMINADO" = 0`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });

  conn.disconnect();
  
  return {
    articulos,
    proveedores,
    ventas,
    ordenes
  };
}

async function generarReporteML() {
  console.log('📊 GENERANDO REPORTE PARA MACHINE LEARNING\n');
  
  const conn = await connectToHANA();
  const reporte = [];

  // 1. Análisis temporal de ventas
  console.log('📈 Analizando patrones temporales de ventas...');
  const ventasPorMes = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        SUBSTRING("FECMOVTO", 1, 7) as "mes",
        COUNT(*) as "total_ventas",
        SUM("VtaCant") as "total_cantidad",
        AVG("VtaCant") as "promedio_cantidad"
      FROM "DBADMIN"."VentaEnc" 
      WHERE "ELIMINADO" = 0
      GROUP BY SUBSTRING("FECMOVTO", 1, 7)
      ORDER BY "mes" DESC
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  reporte.push('📅 VENTAS POR MES:');
  ventasPorMes.forEach(row => {
    reporte.push(`${row.mes}: ${row.total_ventas} ventas, ${row.total_cantidad} unidades (promedio: ${parseFloat(row.promedio_cantidad).toFixed(2)})`);
  });

  // 2. Análisis de productos por demanda
  console.log('🔥 Analizando productos por demanda...');
  const productosPorDemanda = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        v."ARTIID",
        COUNT(*) as "frecuencia_ventas",
        SUM(v."VtaCant") as "total_vendido",
        AVG(v."VtaCant") as "promedio_por_venta",
        MAX(v."FECMOVTO") as "ultima_venta"
      FROM "DBADMIN"."VentaEnc" v
      WHERE v."ELIMINADO" = 0 
        AND EXISTS (SELECT 1 FROM "DBADMIN"."ARTICULO" a WHERE a."ARTIID" = v."ARTIID" AND a."ELIMINADO" = 0)
      GROUP BY v."ARTIID"
      ORDER BY "total_vendido" DESC
      LIMIT 20
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  reporte.push('\n🔥 TOP 20 PRODUCTOS POR DEMANDA:');
  productosPorDemanda.forEach((row, index) => {
    const categoria = row.total_vendido > 100 ? '🔴 ALTA' : 
                     row.total_vendido > 50 ? '🟡 MEDIA' : '🟢 BAJA';
    reporte.push(`${index + 1}. ID:${row.ARTIID} - ${categoria}`);
    reporte.push(`   └ Vendido: ${row.total_vendido} unidades en ${row.frecuencia_ventas} ventas (Promedio: ${parseFloat(row.promedio_por_venta).toFixed(2)})`);
  });

  // 3. Análisis de órdenes por proveedor
  console.log('🏢 Analizando órdenes por proveedor...');
  const ordenesPorProveedor = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        o."IDPROV",
        COUNT(DISTINCT o."IDORDEN") as "total_ordenes",
        COUNT(*) as "total_articulos_pedidos",
        SUM(oa."ORDARTCANT") as "total_cantidad_ordenada",
        AVG(oa."ORDARTCANT") as "promedio_cantidad_por_articulo",
        COUNT(DISTINCT oa."ARTIID") as "productos_diferentes",
        ROUND(COUNT(*) / COUNT(DISTINCT o."IDORDEN"), 2) as "promedio_articulos_por_orden"
      FROM "DBADMIN"."ORDEN" o
      JOIN "DBADMIN"."ORDENART" oa ON o."IDORDEN" = oa."IDORDEN"
      WHERE o."ELIMINADO" = 0 AND oa."ELIMINADO" = 0
      GROUP BY o."IDPROV"
      ORDER BY "total_ordenes" DESC
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  reporte.push('\n🏢 ÓRDENES POR PROVEEDOR:');
  ordenesPorProveedor.forEach(row => {
    reporte.push(`Proveedor ${row.IDPROV}:`);
    reporte.push(`   └ ${row.total_ordenes} órdenes con ${row.total_articulos_pedidos} artículos (${row.promedio_articulos_por_orden} artículos/orden)`);
    reporte.push(`   └ ${row.total_cantidad_ordenada} unidades totales, ${row.productos_diferentes} productos diferentes`);
    reporte.push(`   └ Promedio: ${parseFloat(row.promedio_cantidad_por_articulo).toFixed(2)} unidades por artículo`);
  });

  // 4. Análisis de estacionalidad (por día de la semana)
  console.log('📊 Analizando patrones de estacionalidad...');
  const ventasPorDiaSemana = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        WEEKDAY("FECMOVTO") as "dia_semana",
        COUNT(*) as "total_ventas",
        AVG("VtaCant") as "promedio_cantidad"
      FROM "DBADMIN"."VentaEnc"
      WHERE "ELIMINADO" = 0
      GROUP BY WEEKDAY("FECMOVTO")
      ORDER BY "dia_semana"
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  reporte.push('\n📅 PATRONES POR DÍA DE LA SEMANA:');
  ventasPorDiaSemana.forEach(row => {
    const dia = diasSemana[row.dia_semana] || `Día ${row.dia_semana}`;
    reporte.push(`${dia}: ${row.total_ventas} ventas (promedio: ${parseFloat(row.promedio_cantidad).toFixed(2)} unidades)`);
  });

  // 5. Productos con potencial agotamiento
  console.log('⚠️ Identificando productos con riesgo de agotamiento...');
  const productosRiesgo = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        v."ARTIID",
        SUM(v."VtaCant") as "total_vendido",
        COUNT(*) as "frecuencia_ventas",
        DAYS_BETWEEN(MAX(o."FECMOVTO"), CURRENT_TIMESTAMP) as "dias_desde_ultima_orden",
        SUM(oa."ORDARTCANT") as "total_ordenado"
      FROM "DBADMIN"."VentaEnc" v
      LEFT JOIN "DBADMIN"."ORDENART" oa ON v."ARTIID" = oa."ARTIID"
      LEFT JOIN "DBADMIN"."ORDEN" o ON oa."IDORDEN" = o."IDORDEN"
      WHERE v."ELIMINADO" = 0 
        AND EXISTS (SELECT 1 FROM "DBADMIN"."ARTICULO" a WHERE a."ARTIID" = v."ARTIID" AND a."ELIMINADO" = 0)
        AND v."FECMOVTO" >= ADD_MONTHS(CURRENT_TIMESTAMP, -1)
      GROUP BY v."ARTIID"
      HAVING SUM(v."VtaCant") > 10 AND (DAYS_BETWEEN(MAX(o."FECMOVTO"), CURRENT_TIMESTAMP) > 30 OR MAX(o."FECMOVTO") IS NULL)
      ORDER BY "total_vendido" DESC
      LIMIT 10
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  reporte.push('\n⚠️ PRODUCTOS CON RIESGO DE AGOTAMIENTO (último mes):');
  if (productosRiesgo.length > 0) {
    productosRiesgo.forEach(row => {
      reporte.push(`ID:${row.ARTIID}`);
      reporte.push(`   └ Vendido: ${row.total_vendido} unidades, Última orden hace ${row.dias_desde_ultima_orden || 'N/A'} días`);
    });
  } else {
    reporte.push('✅ No se detectaron productos con riesgo inmediato');
  }

  conn.disconnect();

  // Guardar reporte
  const fecha = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  const nombreArchivo = `reporte_ml_${fecha}.txt`;
  fs.writeFileSync(nombreArchivo, reporte.join('\n'), 'utf8');
  
  console.log(`\n📄 Reporte guardado como: ${nombreArchivo}`);
  console.log('\n📊 RESUMEN DEL REPORTE:');
  console.log(`- Meses analizados: ${ventasPorMes.length}`);
  console.log(`- Productos únicos vendidos: ${productosPorDemanda.length}`);
  console.log(`- Proveedores activos: ${ordenesPorProveedor.length}`);
  console.log(`- Productos en riesgo: ${productosRiesgo.length}`);

  return reporte;
}

async function main() {
  console.log('🚀 INICIANDO GENERACIÓN DE DATOS PARA MACHINE LEARNING\n');

  try {
    // Mostrar estado actual
    console.log('📋 Estado actual de la base de datos:');
    const statsInicial = await obtenerEstadisticasActuales();
    console.log(`   Artículos: ${statsInicial.articulos}`);
    console.log(`   Proveedores: ${statsInicial.proveedores}`);
    console.log(`   Ventas existentes: ${statsInicial.ventas}`);
    console.log(`   Órdenes existentes: ${statsInicial.ordenes}\n`);

    // Verificar si hay suficientes artículos
    if (statsInicial.articulos < 20) {
      console.log('⚠️ ADVERTENCIA: Se recomienda tener al menos 20 artículos para generar datos ML significativos');
      console.log('   Considera ejecutar primero el generador de artículos\n');
    }

    // Generar datos de ML
    console.log('🔄 Generando datos optimizados para Machine Learning...\n');
    
    // Generar órdenes primero (representa el abastecimiento)
    console.log('📥 1. Generando órdenes de compra...');
    await generarOrdenesML(800);  // PRUEBA: 5 órdenes (PRODUCCIÓN: 800)
    
    // Generar ventas después (representa la demanda)
    console.log('📈 2. Generando ventas...');
    await generarVentasML(3000); // PRUEBA: 50 ventas (PRODUCCIÓN: 3000)

    // Mostrar estadísticas finales
    console.log('\n📊 Estado final de la base de datos:');
    const statsFinal = await obtenerEstadisticasActuales();
    console.log(`   Artículos: ${statsFinal.articulos}`);
    console.log(`   Proveedores: ${statsFinal.proveedores}`);
    console.log(`   Ventas: ${statsFinal.ventas} (+${statsFinal.ventas - statsInicial.ventas})`);
    console.log(`   Órdenes: ${statsFinal.ordenes} (+${statsFinal.ordenes - statsInicial.ordenes})\n`);

    // Generar reporte de análisis
    console.log('📑 Generando reporte de análisis para ML...');
    await generarReporteML();

    console.log('\n✅ PROCESO COMPLETADO');
    console.log('🎯 Los datos están listos para ser utilizados en modelos de Machine Learning');
    console.log('\n📋 Archivos generados:');
    console.log('   - inserts_ordenes_ml.sql (comandos SQL de órdenes)');
    console.log('   - inserts_ventas_ml.sql (comandos SQL de ventas)');
    console.log('   - reporte_ml_[fecha].txt (análisis estadístico)');

  } catch (error) {
    console.error('❌ Error durante la generación:', error.message);
    process.exit(1);
  }
}

// Verificar si se ejecuta directamente
if (require.main === module) {
  main();
}

module.exports = {
  obtenerEstadisticasActuales,
  generarReporteML,
  main
}; 