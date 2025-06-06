const { connectToHANA } = require('../Config/confDB');
const fs = require('fs');
require('dotenv').config();

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
        SUBSTRING("FECMOVTO", 1, 7) as mes,
        COUNT(*) as total_ventas,
        SUM("VtaCant") as total_cantidad,
        AVG("VtaCant") as promedio_cantidad
      FROM "DBADMIN"."VentaEnc" 
      WHERE "ELIMINADO" = 0
      GROUP BY SUBSTRING("FECMOVTO", 1, 7)
      ORDER BY mes DESC
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
        COUNT(*) as frecuencia_ventas,
        SUM(v."VtaCant") as total_vendido,
        AVG(v."VtaCant") as promedio_por_venta,
        MAX(v."FECMOVTO") as ultima_venta
      FROM "DBADMIN"."VentaEnc" v
      WHERE v."ELIMINADO" = 0 
        AND EXISTS (SELECT 1 FROM "DBADMIN"."ARTICULO" a WHERE a."ARTIID" = v."ARTIID" AND a."ELIMINADO" = 0)
      GROUP BY v."ARTIID"
      ORDER BY total_vendido DESC
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
        COUNT(*) as total_ordenes,
        SUM(oa."ORDARTCANT") as total_cantidad_ordenada,
        AVG(oa."ORDARTCANT") as promedio_cantidad,
        COUNT(DISTINCT oa."ARTIID") as productos_diferentes
      FROM "DBADMIN"."ORDEN" o
      JOIN "DBADMIN"."ORDENART" oa ON o."IDORDEN" = oa."IDORDEN"
      WHERE o."ELIMINADO" = 0 AND oa."ELIMINADO" = 0
      GROUP BY o."IDPROV"
      ORDER BY total_ordenes DESC
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  reporte.push('\n🏢 ÓRDENES POR PROVEEDOR:');
  ordenesPorProveedor.forEach(row => {
    reporte.push(`Proveedor ${row.IDPROV}: ${row.total_ordenes} órdenes, ${row.total_cantidad_ordenada} unidades, ${row.productos_diferentes} productos diferentes`);
  });

  // 4. Análisis de estacionalidad (por día de la semana)
  console.log('📊 Analizando patrones de estacionalidad...');
  const ventasPorDiaSemana = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        DAYOFWEEK("FECMOVTO") as dia_semana,
        COUNT(*) as total_ventas,
        AVG("VtaCant") as promedio_cantidad
      FROM "DBADMIN"."VentaEnc"
      WHERE "ELIMINADO" = 0
      GROUP BY DAYOFWEEK("FECMOVTO")
      ORDER BY dia_semana
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  reporte.push('\n📅 PATRONES POR DÍA DE LA SEMANA:');
  ventasPorDiaSemana.forEach(row => {
    const dia = diasSemana[row.dia_semana - 1] || `Día ${row.dia_semana}`;
    reporte.push(`${dia}: ${row.total_ventas} ventas (promedio: ${parseFloat(row.promedio_cantidad).toFixed(2)} unidades)`);
  });

  // 5. Productos con potencial agotamiento
  console.log('⚠️ Identificando productos con riesgo de agotamiento...');
  const productosRiesgo = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        v."ARTIID",
        SUM(v."VtaCant") as total_vendido,
        COUNT(*) as frecuencia_ventas,
        DATEDIFF(DAY, MAX(o."FECMOVTO"), CURRENT_TIMESTAMP) as dias_desde_ultima_orden,
        SUM(oa."ORDARTCANT") as total_ordenado
      FROM "DBADMIN"."VentaEnc" v
      LEFT JOIN "DBADMIN"."ORDENART" oa ON v."ARTIID" = oa."ARTIID"
      LEFT JOIN "DBADMIN"."ORDEN" o ON oa."IDORDEN" = o."IDORDEN"
      WHERE v."ELIMINADO" = 0 
        AND EXISTS (SELECT 1 FROM "DBADMIN"."ARTICULO" a WHERE a."ARTIID" = v."ARTIID" AND a."ELIMINADO" = 0)
        AND v."FECMOVTO" >= DATEADD(MONTH, -1, CURRENT_TIMESTAMP)
      GROUP BY v."ARTIID"
      HAVING SUM(v."VtaCant") > 10 AND (dias_desde_ultima_orden > 30 OR dias_desde_ultima_orden IS NULL)
      ORDER BY total_vendido DESC
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
  console.log('📊 GENERANDO SOLO REPORTE ML (sin crear nuevos datos)\n');

  try {
    // Mostrar estado actual
    console.log('📋 Estado actual de la base de datos:');
    const stats = await obtenerEstadisticasActuales();
    console.log(`   Artículos: ${stats.articulos}`);
    console.log(`   Proveedores: ${stats.proveedores}`);
    console.log(`   Ventas existentes: ${stats.ventas}`);
    console.log(`   Órdenes existentes: ${stats.ordenes}\n`);

    // Verificar si hay datos suficientes
    if (stats.ventas < 100) {
      console.log('⚠️ ADVERTENCIA: Pocos datos para análisis ML significativo');
      console.log('   Considera ejecutar primero los generadores de datos\n');
    }

    // Generar solo reporte de análisis
    console.log('📑 Generando reporte de análisis ML...');
    await generarReporteML();

    console.log('\n✅ REPORTE COMPLETADO');
    console.log('📄 Archivo generado: reporte_ml_[fecha].txt');

  } catch (error) {
    console.error('❌ Error durante la generación del reporte:', error.message);
    process.exit(1);
  }
}

// Ejecutar directamente
if (require.main === module) {
  main();
}

module.exports = {
  obtenerEstadisticasActuales,
  generarReporteML,
  main
}; 