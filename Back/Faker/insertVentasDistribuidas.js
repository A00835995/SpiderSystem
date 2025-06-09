const { connectToHANA } = require('../Config/confDB');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
require('dotenv').config();

// Generar fechas sistemáticas evitando meses con datos existentes
function getProgressiveDatesFromAugust() {
  const dates = [];
  const today = new Date();
  
  // Empezar desde agosto 2024 (evitar junio y julio que ya tienen datos)
  const startDate = new Date(2024, 7, 1); // Agosto 2024 (mes 7 = agosto)
  startDate.setHours(0, 0, 0, 0);
  
  // Terminar en la fecha actual
  const endDate = new Date(today);
  endDate.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Formato YYYY-MM-DD HH:MM:SS para SAP HANA
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day} 00:00:00`;
    dates.push(formattedDate);
    
    // Avanzar un día
    currentDate.setDate(currentDate.getDate() + 1);
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

// Calcular ventas objetivo por día para distribución equilibrada
function calcularVentasPorDia(targetVentas, totalDias) {
  const ventasBasePorDia = Math.floor(targetVentas / totalDias);
  const ventasExtra = targetVentas % totalDias;
  
  return {
    ventasBase: ventasBasePorDia,
    diasConExtra: ventasExtra
  };
}

// Generar patrones de venta realistas pero controlados
function getVentasPorDiaControlado(demandaType, dayOfWeek, isWeekend, ventasObjetivo) {
  let factor;
  
  // Ajustar según tipo de demanda
  switch(demandaType) {
    case 'alta':
      factor = 0.4; // 40% de las ventas del día
      break;
    case 'media':
      factor = 0.35; // 35% de las ventas del día
      break;
    case 'baja':
      factor = 0.25; // 25% de las ventas del día
      break;
    default:
      factor = 0.33;
  }
  
  let ventasCalculadas = Math.floor(ventasObjetivo * factor);
  
  // Reducir ventas en fin de semana
  if (isWeekend) {
    ventasCalculadas = Math.floor(ventasCalculadas * 0.7);
  }
  
  // Aumentar ventas en viernes
  if (dayOfWeek === 5) {
    ventasCalculadas = Math.floor(ventasCalculadas * 1.2);
  }
  
  return Math.max(0, ventasCalculadas);
}

async function generarVentasDistribuidasML(targetVentas = 3000) {
  const conn = await connectToHANA();
  const fileContent = {
    content: '-- Inserción de ventas DISTRIBUIDAS para Machine Learning\n-- Fecha: ' + new Date().toISOString() + '\n'
  };
  fileContent.content += '-- Total objetivo: ' + targetVentas + ' ventas distribuidas desde agosto 2024\n';
  fileContent.content += '-- EVITA junio y julio 2024 que ya tienen datos\n\n';

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

  // Generar fechas progresivas (último año completo)
  const fechasDisponibles = getProgressiveDatesFromAugust();
  const { ventasBase, diasConExtra } = calcularVentasPorDia(targetVentas, fechasDisponibles.length);
  
  console.log(`📅 Fechas disponibles: ${fechasDisponibles.length} (desde agosto 2024)`);
  console.log(`🎯 Distribución objetivo: ${ventasBase} ventas/día base, ${diasConExtra} días con +1 venta extra`);
  console.log('🚀 Iniciando generación de ventas distribuidas (evitando jun-jul 2024)...\n');

  let ventasGeneradas = 0;
  let ventasPorMes = {};
  let diasProcesados = 0;

  // Generar ventas día por día con control estricto
  for (const fecha of fechasDisponibles) {
    const fechaObj = new Date(fecha);
    const dayOfWeek = fechaObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const mesKey = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, '0')}`;
    
    if (!ventasPorMes[mesKey]) ventasPorMes[mesKey] = 0;

    // Calcular ventas objetivo para este día
    let ventasObjetivoHoy = ventasBase;
    if (diasProcesados < diasConExtra) {
      ventasObjetivoHoy += 1;
    }

    let ventasGeneradasHoy = 0;

    // Distribuir ventas entre tipos de demanda
    const tiposArticulos = [
      { tipo: 'alta', articulos: altaDemanda },
      { tipo: 'media', articulos: mediaDemanda },
      { tipo: 'baja', articulos: bajaDemanda }
    ];

    for (const { tipo, articulos: articulosTipo } of tiposArticulos) {
      if (ventasGeneradasHoy >= ventasObjetivoHoy) break;

      const ventasParaTipo = getVentasPorDiaControlado(tipo, dayOfWeek, isWeekend, ventasObjetivoHoy);
      
      for (let v = 0; v < ventasParaTipo && ventasGeneradasHoy < ventasObjetivoHoy; v++) {
        if (articulosTipo.length > 0) {
          const articulo = faker.helpers.arrayElement(articulosTipo);
          await generarVentaIndividual(conn, articulo, fecha, fileContent, tipo);
          ventasGeneradas++;
          ventasGeneradasHoy++;
          ventasPorMes[mesKey]++;
        }
      }
    }

    // Si no hemos alcanzado el objetivo del día, completar con artículos aleatorios
    while (ventasGeneradasHoy < ventasObjetivoHoy && ventasGeneradas < targetVentas) {
      const articulo = faker.helpers.arrayElement(articulos);
      await generarVentaIndividual(conn, articulo, fecha, fileContent, 'media');
      ventasGeneradas++;
      ventasGeneradasHoy++;
      ventasPorMes[mesKey]++;
    }

    diasProcesados++;

    if (diasProcesados % 30 === 0) {
      console.log(`📈 Progreso: ${ventasGeneradas}/${targetVentas} ventas generadas (${diasProcesados}/${fechasDisponibles.length} días)`);
    }

    if (ventasGeneradas >= targetVentas) break;
  }

  // Guardar archivo SQL
  fs.writeFileSync('inserts_ventas_distribuidas_ml.sql', fileContent.content, 'utf8');
  
  // Mostrar estadísticas
  console.log('\n📊 ESTADÍSTICAS GENERADAS (DISTRIBUIDAS):');
  console.log(`✅ Total de ventas: ${ventasGeneradas}`);
  console.log(`📅 Días procesados: ${diasProcesados}/${fechasDisponibles.length}`);
  console.log('\n📅 Ventas por mes:');
  Object.entries(ventasPorMes).sort().forEach(([mes, cantidad]) => {
    console.log(`   ${mes}: ${cantidad} ventas`);
  });
  
  console.log('📝 Archivo SQL guardado como inserts_ventas_distribuidas_ml.sql');
  conn.disconnect();
  console.log('🚀 Generación de ventas DISTRIBUIDAS para ML completada.');
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

  // Cantidad basada en tipo de demanda (más conservadora)
  let cantidad;
  switch(tipodemanda) {
    case 'alta':
      cantidad = faker.number.int({ min: 1, max: 3 }); // Reducido
      break;
    case 'media':
      cantidad = faker.number.int({ min: 1, max: 2 }); // Reducido
      break;
    case 'baja':
      cantidad = 1; // Siempre 1
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
  generarVentasDistribuidasML(3000);
}

// Exportar funciones para uso en otros módulos
module.exports = {
  generarVentasDistribuidasML,
  generarVentaIndividual,
  getProgressiveDatesFromAugust,
  classifyArticlesByDemand,
  calcularVentasPorDia,
  getVentasPorDiaControlado
}; 