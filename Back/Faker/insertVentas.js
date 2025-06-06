const { connectToHANA } = require('../Config/confDB');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
require('dotenv').config();

// Generar fechas sistemáticas para simular patrones reales
function getProgressiveDates(startMonthsAgo = 12, totalDays = 365) {
  const dates = [];
  const today = new Date();
  
  // Empezar desde hace X meses
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - startMonthsAgo);
  startDate.setHours(0, 0, 0, 0); // Limpiar tiempo
  
  for (let i = 0; i < totalDays; i++) {
    // Crear nueva fecha para cada día
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Formato YYYY-MM-DD HH:MM:SS para SAP HANA
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day} 00:00:00`;
    dates.push(formattedDate);
  }
  
  return dates;
}

// Clasificar artículos por demanda para ML
function classifyArticlesByDemand(articulos) {
  const shuffled = faker.helpers.shuffle([...articulos]);
  const total = articulos.length;
  
  return {
    altaDemanda: shuffled.slice(0, Math.floor(total * 0.2)), // 20% alta demanda
    mediaDemanda: shuffled.slice(Math.floor(total * 0.2), Math.floor(total * 0.7)), // 50% media
    bajaDemanda: shuffled.slice(Math.floor(total * 0.7)) // 30% baja demanda
  };
}

// Generar patrones de venta realistas
function getVentasPorDia(demandaType, dayOfWeek, isWeekend) {
  let baseVentas;
  
  // Ajustar según tipo de demanda
  switch(demandaType) {
    case 'alta':
      baseVentas = faker.number.int({ min: 3, max: 8 });
      break;
    case 'media':
      baseVentas = faker.number.int({ min: 1, max: 4 });
      break;
    case 'baja':
      baseVentas = faker.number.int({ min: 0, max: 2 });
      break;
    default:
      baseVentas = 1;
  }
  
  // Reducir ventas en fin de semana para algunos productos
  if (isWeekend && Math.random() < 0.3) {
    baseVentas = Math.floor(baseVentas * 0.6);
  }
  
  // Aumentar ventas en viernes (patrón común)
  if (dayOfWeek === 5 && Math.random() < 0.4) {
    baseVentas = Math.floor(baseVentas * 1.3);
  }
  
  return Math.max(0, baseVentas);
}

async function generarVentasML(targetVentas = 3000) {
  const conn = await connectToHANA();
  const fileContent = {
    content: '-- Inserción de ventas para Machine Learning\n-- Fecha: ' + new Date().toISOString() + '\n'
  };
  fileContent.content += '-- Total objetivo: ' + targetVentas + ' ventas\n\n';

  // Obtener artículos existentes
  const articulos = await new Promise((resolve, reject) => {
    conn.exec(`SELECT "ARTIID", "ARTPRECIOCOMPRA", "ARTPRECIOVENTA" FROM "DBADMIN"."ARTICULO" WHERE "ELIMINADO" = 0`, (err, rows) => {
      if (err) return reject(err instanceof Error ? err : new Error(String(err)));
      resolve(rows);
    });
  });

  if (articulos.length === 0) {
    console.error('❌ No hay artículos disponibles.');
    conn.disconnect();
    return;
  }

  console.log(`📦 Artículos disponibles: ${articulos.length}`);
  
  // Clasificar artículos por demanda
  const { altaDemanda, mediaDemanda, bajaDemanda } = classifyArticlesByDemand(articulos);
  console.log(`📊 Distribución: Alta (${altaDemanda.length}), Media (${mediaDemanda.length}), Baja (${bajaDemanda.length})`);

  // Generar fechas progresivas (último año)
  const fechasDisponibles = getProgressiveDates(12, 365);
  let ventasGeneradas = 0;
  let ventasPorMes = {};

    const idVenta = await new Promise((resolve, reject) => {
      conn.exec(insertVentaSQL, (err) => {
        if (err) return reject(err instanceof Error ? err : new Error(String(err)));

        // Obtener el último IdVenta generado
        conn.exec(`SELECT MAX("IdVenta") AS "IdVenta" FROM "DBADMIN"."VENTA"`, (err2, rows) => {
          if (err2) return reject(err2 instanceof Error ? err2 : new Error(String(err2)));
          resolve(rows[0].IdVenta);
        });
      });
    });

    // Elegir de 1 a 10 artículos para la venta
    const numArticulos = faker.number.int({ min: 1, max: 5 });
    const articulosSeleccionados = faker.helpers.shuffle(articulos).slice(0, numArticulos);

    for (const art of articulosSeleccionados) {
      const cantidad = faker.number.int({ min: 1, max: 5 }); // Cantidades menores para ventas
      
      for (let v = 0; v < ventasHoy && ventasGeneradas < targetVentas; v++) {
        await generarVentaIndividual(conn, art, fecha, fileContent, 'alta');
        ventasGeneradas++;
        ventasPorMes[mesKey]++;
      }
      
      const precioCompra = parseFloat(art.ARTPRECIOCOMPRA);
      const precioIVA = +(precioVenta * 1.16).toFixed(2);

      const insertVentaEnc = `
        INSERT INTO "DBADMIN"."VentaEnc" 
        ("IdVenta", "ARTIID", "VtaCant", "VtaPRECIOCOMP", "VtaPRECIOIVA", "ELIMINADO", "FECMOVTO")
        VALUES (${idVenta}, ${art.ARTIID}, ${cantidad}, ${precioCompra.toFixed(2)}, ${precioIVA}, 0, '${fecMovto}');
      `;

      await new Promise((resolve, reject) => {
        conn.exec(insertVentaEnc, (err) => {
          if (err) return reject(err instanceof Error ? err : new Error(String(err)));
          resolve();
        });
      });
    }

    // Procesar artículos de media demanda
    for (const art of mediaDemanda) {
      if (Math.random() < 0.7) { // 70% probabilidad de venta diaria
        const ventasHoy = getVentasPorDia('media', dayOfWeek, isWeekend);
        
        for (let v = 0; v < ventasHoy && ventasGeneradas < targetVentas; v++) {
          await generarVentaIndividual(conn, art, fecha, fileContent, 'media');
          ventasGeneradas++;
          ventasPorMes[mesKey]++;
        }
      }
    }

    // Procesar artículos de baja demanda
    for (const art of bajaDemanda) {
      if (Math.random() < 0.3) { // 30% probabilidad de venta diaria
        const ventasHoy = getVentasPorDia('baja', dayOfWeek, isWeekend);
        
        for (let v = 0; v < ventasHoy && ventasGeneradas < targetVentas; v++) {
          await generarVentaIndividual(conn, art, fecha, fileContent, 'baja');
          ventasGeneradas++;
          ventasPorMes[mesKey]++;
        }
      }
    }

    if (ventasGeneradas % 100 === 0) {
      console.log(`📈 Progreso: ${ventasGeneradas}/${targetVentas} ventas generadas`);
    }
  }

  // Guardar archivo SQL
  fs.writeFileSync('inserts_ventas_ml.sql', fileContent.content, 'utf8');
  
  // Mostrar estadísticas
  console.log('\n📊 ESTADÍSTICAS GENERADAS:');
  console.log(`✅ Total de ventas: ${ventasGeneradas}`);
  console.log('\n📅 Ventas por mes:');
  Object.entries(ventasPorMes).forEach(([mes, cantidad]) => {
    console.log(`   ${mes}: ${cantidad} ventas`);
  });
  
  console.log('📝 Archivo SQL guardado como inserts_ventas_ml.sql');
  conn.disconnect();
  console.log('🚀 Generación de ventas para ML completada.');
}

async function generarVentaIndividual(conn, articulo, fecha, fileContent, tipodemanda) {
  // Insertar en VENTA
  const insertVentaSQL = `INSERT INTO "DBADMIN"."VENTA" ("FECMOVTO", "ELIMINADO")
VALUES ('${fecha}', 0);`;

  // Agregar al archivo SQL
  fileContent.content += insertVentaSQL + '\n';

  const idVenta = await new Promise((resolve, reject) => {
    conn.exec(insertVentaSQL, (err) => {
      if (err) return reject(err);

      conn.exec(`SELECT MAX("IdVenta") AS "IdVenta" FROM "DBADMIN"."VENTA"`, (err2, rows) => {
        if (err2) return reject(err2);
        resolve(rows[0].IdVenta);
      });
    });
  });

  // Cantidad basada en tipo de demanda
  let cantidad;
  switch(tipodemanda) {
    case 'alta':
      cantidad = faker.number.int({ min: 2, max: 10 });
      break;
    case 'media':
      cantidad = faker.number.int({ min: 1, max: 5 });
      break;
    case 'baja':
      cantidad = faker.number.int({ min: 1, max: 3 });
      break;
    default:
      cantidad = 1;
  }

  // Calcular precios
  let precioVenta;
  if (articulo.ARTPRECIOVENTA && articulo.ARTPRECIOVENTA > 0) {
    precioVenta = parseFloat(articulo.ARTPRECIOVENTA);
  } else {
    const margen = faker.number.float({ min: 1.3, max: 1.6 });
    precioVenta = parseFloat(articulo.ARTPRECIOCOMPRA) * margen;
  }
  
  const precioCompra = parseFloat(articulo.ARTPRECIOCOMPRA);
  const precioIVA = +(precioVenta * 1.16).toFixed(2);

  const insertVentaEnc = `INSERT INTO "DBADMIN"."VentaEnc" 
("IdVenta", "ARTIID", "VtaCant", "VtaPRECIOCOMP", "VtaPRECIOIVA", "ELIMINADO", "FECMOVTO")
VALUES (${idVenta}, ${articulo.ARTIID}, ${cantidad}, ${precioCompra.toFixed(2)}, ${precioIVA}, 0, '${fecha}');`;

  // Agregar al archivo SQL
  fileContent.content += insertVentaEnc + '\n\n';

  await new Promise((resolve, reject) => {
    conn.exec(insertVentaEnc, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  return idVenta;
}

// Ejecutar con parámetros para ML
if (require.main === module) {
  generarVentasML(3000);
}

// Exportar funciones para uso en otros módulos
module.exports = {
  generarVentasML,
  generarVentaIndividual,
  getProgressiveDates,
  classifyArticlesByDemand,
  getVentasPorDia
};
