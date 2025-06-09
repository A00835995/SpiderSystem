const { connectToHANA } = require('../Config/confDB');
require('dotenv').config();

async function limpiarVentasExcesivas() {
  console.log('🧹 INICIANDO LIMPIEZA DE VENTAS EXCESIVAS\n');
  
  const conn = await connectToHANA();
  
  try {
    // Analizar estado actual
    console.log('📊 Analizando estado actual...');
    await mostrarEstadisticasActuales(conn);
    
    // Limpiar junio 2024
    console.log('\n🗑️ Limpiando junio 2024...');
    await limpiarMes(conn, '2024-06', 300);
    
    // Limpiar julio 2024
    console.log('\n🗑️ Limpiando julio 2024...');
    await limpiarMes(conn, '2024-07', 300);
    
    // Mostrar resultado final
    console.log('\n📊 Estado después de la limpieza...');
    await mostrarEstadisticasActuales(conn);
    
    console.log('\n✅ LIMPIEZA COMPLETADA');
    console.log('🎯 Los datos ahora están equilibrados para análisis ML');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error.message);
  } finally {
    conn.disconnect();
  }
}

async function mostrarEstadisticasActuales(conn) {
  const stats = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT 
        SUBSTRING("FECMOVTO", 1, 7) as "mes",
        COUNT(*) as "total_ventas",
        SUM("VtaCant") as "total_unidades",
        AVG("VtaCant") as "promedio_unidades"
      FROM "DBADMIN"."VentaEnc" 
      WHERE "ELIMINADO" = 0
        AND SUBSTRING("FECMOVTO", 1, 7) IN ('2024-06', '2024-07', '2024-08', '2024-09')
      GROUP BY SUBSTRING("FECMOVTO", 1, 7)
      ORDER BY "mes"
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  console.log('📅 Ventas por mes (muestra):');
  stats.forEach(row => {
    console.log(`   ${row.mes}: ${row.total_ventas} ventas, ${row.total_unidades} unidades (promedio: ${parseFloat(row.promedio_unidades).toFixed(2)})`);
  });
}

async function limpiarMes(conn, mesTarget, ventasObjetivo) {
  // 1. Contar ventas actuales del mes
  const ventasActuales = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT COUNT(*) as "total"
      FROM "DBADMIN"."VentaEnc" 
      WHERE "ELIMINADO" = 0 
        AND SUBSTRING("FECMOVTO", 1, 7) = '${mesTarget}'
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });

  console.log(`📊 ${mesTarget}: ${ventasActuales} ventas actuales → objetivo: ${ventasObjetivo}`);

  if (ventasActuales <= ventasObjetivo) {
    console.log(`✅ ${mesTarget}: No necesita limpieza`);
    return;
  }

  const ventasAEliminar = ventasActuales - ventasObjetivo;
  console.log(`🎯 ${mesTarget}: Eliminando ${ventasAEliminar} ventas...`);

  // 2. Obtener IDs de ventas del mes (aleatorias)
  const ventasParaEliminar = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT ve."IdVenta", ve."ARTIID"
      FROM "DBADMIN"."VentaEnc" ve
      WHERE ve."ELIMINADO" = 0 
        AND SUBSTRING(ve."FECMOVTO", 1, 7) = '${mesTarget}'
      ORDER BY RAND()
      LIMIT ${ventasAEliminar}
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  console.log(`🔍 ${mesTarget}: Seleccionadas ${ventasParaEliminar.length} ventas para eliminar`);

  // 3. Eliminar ventas seleccionadas (marcar como eliminado)
  let eliminadas = 0;
  for (const venta of ventasParaEliminar) {
    try {
      // Marcar VentaEnc como eliminado
      await new Promise((resolve, reject) => {
        conn.exec(`
          UPDATE "DBADMIN"."VentaEnc" 
          SET "ELIMINADO" = 1 
          WHERE "IdVenta" = ${venta.IdVenta} AND "ARTIID" = ${venta.ARTIID}
        `, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Marcar VENTA como eliminado
      await new Promise((resolve, reject) => {
        conn.exec(`
          UPDATE "DBADMIN"."VENTA" 
          SET "ELIMINADO" = 1 
          WHERE "IdVenta" = ${venta.IdVenta}
        `, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      eliminadas++;

      if (eliminadas % 100 === 0) {
        console.log(`   📈 Progreso: ${eliminadas}/${ventasAEliminar} eliminadas`);
      }

    } catch (error) {
      console.error(`⚠️ Error eliminando venta ${venta.IdVenta}:`, error.message);
    }
  }

  console.log(`✅ ${mesTarget}: ${eliminadas} ventas eliminadas exitosamente`);

  // 4. Verificar resultado
  const ventasFinales = await new Promise((resolve, reject) => {
    conn.exec(`
      SELECT COUNT(*) as "total"
      FROM "DBADMIN"."VentaEnc" 
      WHERE "ELIMINADO" = 0 
        AND SUBSTRING("FECMOVTO", 1, 7) = '${mesTarget}'
    `, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });

  console.log(`📊 ${mesTarget}: Resultado final: ${ventasFinales} ventas`);
}

// Función para revertir cambios si es necesario
async function revertirLimpieza() {
  console.log('🔄 REVIRTIENDO LIMPIEZA...\n');
  
  const conn = await connectToHANA();
  
  try {
    // Restaurar todas las ventas marcadas como eliminadas hoy
    const resultado = await new Promise((resolve, reject) => {
      conn.exec(`
        UPDATE "DBADMIN"."VentaEnc" 
        SET "ELIMINADO" = 0 
        WHERE "ELIMINADO" = 1 
          AND SUBSTRING("FECMOVTO", 1, 7) IN ('2024-06', '2024-07')
      `, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    await new Promise((resolve, reject) => {
      conn.exec(`
        UPDATE "DBADMIN"."VENTA" 
        SET "ELIMINADO" = 0 
        WHERE "ELIMINADO" = 1 
          AND SUBSTRING("FECMOVTO", 1, 7) IN ('2024-06', '2024-07')
      `, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    console.log('✅ Limpieza revertida exitosamente');
    
  } catch (error) {
    console.error('❌ Error revirtiendo limpieza:', error.message);
  } finally {
    conn.disconnect();
  }
}

// Ejecutar limpieza si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--revertir')) {
    revertirLimpieza();
  } else {
    limpiarVentasExcesivas();
  }
}

module.exports = {
  limpiarVentasExcesivas,
  revertirLimpieza,
  limpiarMes,
  mostrarEstadisticasActuales
}; 