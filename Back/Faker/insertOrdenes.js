const { connectToHANA } = require('../Config/confDB');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
require('dotenv').config();

// Generar fechas sistemáticas cada 1-2 semanas
function getOrderScheduleDates(startMonthsAgo = 5, weeksInterval = 1.5) {
  const dates = [];
  const today = new Date();
  
  // Empezar desde hace X meses
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - startMonthsAgo);
  startDate.setHours(0, 0, 0, 0); // Limpiar tiempo
  
  let currentDate = new Date(startDate);
  const endDate = new Date(today);
  endDate.setHours(0, 0, 0, 0);
  
  while (currentDate <= endDate) {
    // Evitar fines de semana para órdenes
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Formato YYYY-MM-DD HH:MM:SS para SAP HANA
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day} 00:00:00`;
      dates.push(formattedDate);
    }
    
    // Avanzar 1-2 semanas
    const daysToAdd = Math.floor(weeksInterval * 7) + faker.number.int({ min: 0, max: 3 });
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
  }
  
  return dates;
}

// Agrupar artículos por proveedor para órdenes realistas
function groupArticlesBySupplier(articulos) {
  const grupos = {};
  
  articulos.forEach(art => {
    if (!grupos[art.IDPROV]) {
      grupos[art.IDPROV] = [];
    }
    grupos[art.IDPROV].push(art);
  });
  
  return grupos;
}

// Generar cantidades basadas en historial simulado de ventas
function calculateOrderQuantity(articulo, demandaType) {
  let baseQuantity;
  
  switch(demandaType) {
    case 'alta':
      baseQuantity = faker.number.int({ min: 50, max: 200 }); // Stock para alta demanda
      break;
    case 'media':
      baseQuantity = faker.number.int({ min: 20, max: 80 });
      break;
    case 'baja':
      baseQuantity = faker.number.int({ min: 5, max: 30 });
      break;
    default:
      baseQuantity = faker.number.int({ min: 10, max: 50 });
  }
  
  // Simular variación en pedidos (a veces se pide más, a veces menos)
  const variation = faker.number.float({ min: 0.7, max: 1.4 });
  return Math.max(1, Math.floor(baseQuantity * variation));
}

// Simular patrones de reabastecimiento
function needsRestock(articulo, currentWeek, demandaType) {
  // Artículos de alta demanda se reabastecen más seguido
  switch(demandaType) {
    case 'alta':
      return currentWeek % 2 === 0; // Cada 2 semanas
    case 'media':
      return currentWeek % 3 === 0; // Cada 3 semanas
    case 'baja':
      return currentWeek % 5 === 0; // Cada 5 semanas
    default:
      return Math.random() < 0.3;
  }
}

async function generarOrdenesML(targetOrdenes = 800) {
  const conn = await connectToHANA();
  const fileContent = {
    content: '-- Inserción de órdenes para Machine Learning\n-- Fecha: ' + new Date().toISOString() + '\n'
  };
  fileContent.content += '-- Total objetivo: ' + targetOrdenes + ' órdenes\n\n';

  // Obtener artículos existentes con proveedores
  const articulos = await new Promise((resolve, reject) => {
    conn.exec(`SELECT "ARTIID", "ARTPRECIOCOMPRA", "IDPROV" FROM "DBADMIN"."ARTICULO" WHERE "ELIMINADO" = 0`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  if (articulos.length === 0) {
    console.error('❌ No hay artículos disponibles.');
    conn.disconnect();
    return;
  }

  console.log(`📦 Artículos disponibles: ${articulos.length}`);
  
  // Agrupar por proveedor
  const articulosPorProveedor = groupArticlesBySupplier(articulos);
  const proveedores = Object.keys(articulosPorProveedor);
  console.log(`🏢 Proveedores encontrados: ${proveedores.length}`);

  // Clasificar artículos por demanda simulada
  const articulosArray = [...articulos];
  const shuffled = faker.helpers.shuffle(articulosArray);
  const total = articulos.length;
  
  const demandaMap = new Map();
  shuffled.slice(0, Math.floor(total * 0.2)).forEach(art => demandaMap.set(art.ARTIID, 'alta'));
  shuffled.slice(Math.floor(total * 0.2), Math.floor(total * 0.7)).forEach(art => demandaMap.set(art.ARTIID, 'media'));
  shuffled.slice(Math.floor(total * 0.7)).forEach(art => demandaMap.set(art.ARTIID, 'baja'));

  // Generar fechas de órdenes sistemáticas
  const fechasOrdenes = getOrderScheduleDates(5, 1.5);
  let ordenesGeneradas = 0;
  let ordenesPorMes = {};
  let ordenesPorProveedor = {};

  console.log(`📅 Fechas de órdenes disponibles: ${fechasOrdenes.length}`);

  for (let weekIndex = 0; weekIndex < fechasOrdenes.length && ordenesGeneradas < targetOrdenes; weekIndex++) {
    const fecha = fechasOrdenes[weekIndex];
    const mesKey = fecha.substring(0, 7); // YYYY-MM
    
    if (!ordenesPorMes[mesKey]) ordenesPorMes[mesKey] = 0;

    // Procesar cada proveedor
    for (const idProv of proveedores) {
      if (ordenesGeneradas >= targetOrdenes) break;
      
      const articulosProveedor = articulosPorProveedor[idProv];
      
      // Determinar si este proveedor necesita orden esta semana
      const probabilidadOrden = 0.6; // 60% probabilidad por semana
      if (Math.random() > probabilidadOrden) continue;

      // Seleccionar artículos que necesitan reabastecimiento
      const articulosParaOrden = articulosProveedor.filter(art => {
        const demandaType = demandaMap.get(art.ARTIID) || 'media';
        return needsRestock(art, weekIndex, demandaType);
      });

      if (articulosParaOrden.length === 0) continue;

      // Limitar número de artículos por orden
      const maxArticulosPorOrden = Math.min(15, articulosParaOrden.length);
      const articulosSeleccionados = faker.helpers.shuffle(articulosParaOrden).slice(0, maxArticulosPorOrden);

      // Crear la orden
      const idOrden = await crearOrden(conn, idProv, fecha, fileContent);
      
      // Agregar artículos a la orden
      for (const art of articulosSeleccionados) {
        const demandaType = demandaMap.get(art.ARTIID) || 'media';
        const cantidad = calculateOrderQuantity(art, demandaType);
        
        await agregarArticuloAOrden(conn, idOrden, art, cantidad, fecha, fileContent);
      }

      ordenesGeneradas++;
      ordenesPorMes[mesKey]++;
      
      if (!ordenesPorProveedor[idProv]) ordenesPorProveedor[idProv] = 0;
      ordenesPorProveedor[idProv]++;

      if (ordenesGeneradas % 50 === 0) {
        console.log(`📈 Progreso: ${ordenesGeneradas}/${targetOrdenes} órdenes generadas`);
      }

      fileContent.content += `\n-- Fin de la orden ${idOrden} (Proveedor: ${idProv}, Artículos: ${articulosSeleccionados.length})\n\n`;
    }
  }

  // Guardar archivo SQL
  fs.writeFileSync('inserts_ordenes_ml.sql', fileContent.content, 'utf8');
  
  // Mostrar estadísticas
  console.log('\n📊 ESTADÍSTICAS DE ÓRDENES GENERADAS:');
  console.log(`✅ Total de órdenes: ${ordenesGeneradas}`);
  console.log('\n📅 Órdenes por mes:');
  Object.entries(ordenesPorMes).forEach(([mes, cantidad]) => {
    console.log(`   ${mes}: ${cantidad} órdenes`);
  });
  
  console.log('\n🏢 Órdenes por proveedor:');
  Object.entries(ordenesPorProveedor).forEach(([prov, cantidad]) => {
    console.log(`   Proveedor ${prov}: ${cantidad} órdenes`);
  });
  
  console.log('📝 Archivo SQL guardado como inserts_ordenes_ml.sql');
  conn.disconnect();
  console.log('🚀 Generación de órdenes para ML completada.');
}

async function crearOrden(conn, idProv, fecha, fileContent) {
  const idPago = faker.helpers.arrayElement([1, 2]); // 1: Crédito, 2: Transferencia
  const idOrdStat = 2; // Estado completado para ML
  
  // Fecha de entrega 3-7 días después
  const diasEntrega = faker.number.int({ min: 3, max: 7 });
  const fechaOrden = new Date(fecha);
  const fechaEntregaObj = new Date(fechaOrden.getTime() + diasEntrega * 24 * 60 * 60 * 1000);
  
  // Formato YYYY-MM-DD HH:MM:SS para SAP HANA
  const year = fechaEntregaObj.getFullYear();
  const month = String(fechaEntregaObj.getMonth() + 1).padStart(2, '0');
  const day = String(fechaEntregaObj.getDate()).padStart(2, '0');
  const fechaEntrega = `${year}-${month}-${day} 00:00:00`;

  const insertOrdenSQL = `INSERT INTO "DBADMIN"."ORDEN" ("IDPROV", "IDPAGO", "IDORDSTAT", "FECHAENTREGA", "FECMOVTO", "ELIMINADO")
VALUES (${idProv}, ${idPago}, ${idOrdStat}, '${fechaEntrega}', '${fecha}', 0);`;

  fileContent.content += insertOrdenSQL + '\n';

  const idOrden = await new Promise((resolve, reject) => {
    conn.exec(insertOrdenSQL, (err) => {
      if (err) return reject(err);

      conn.exec(`SELECT MAX("IDORDEN") AS "IDORDEN" FROM "DBADMIN"."ORDEN"`, (err2, rows) => {
        if (err2) return reject(err2);
        resolve(rows[0].IDORDEN);
      });
    });
  });

  return idOrden;
}

async function agregarArticuloAOrden(conn, idOrden, articulo, cantidad, fecha, fileContent) {
  const precioCompra = parseFloat(articulo.ARTPRECIOCOMPRA).toFixed(2);
  const precioIVA = +(precioCompra * 1.16).toFixed(2);

  const insertArt = `INSERT INTO "DBADMIN"."ORDENART" 
("IDORDEN", "ARTIID", "ORDARTCANT", "ORDPRECIOCOMP", "ORDPRECIOIVA", "ELIMINADO", "FECMOVTO")
VALUES (${idOrden}, ${articulo.ARTIID}, ${cantidad}, ${precioCompra}, ${precioIVA}, 0, '${fecha}');`;

  const insertRecibo = `INSERT INTO "DBADMIN"."ORDENRECIBO"
("IDORDEN", "ARTIID", "CANTIDADRECB")
VALUES (${idOrden}, ${articulo.ARTIID}, ${cantidad});`;

  fileContent.content += insertArt + '\n';
  fileContent.content += insertRecibo + '\n';

  await new Promise((resolve, reject) => {
    conn.exec(insertArt, (err1) => {
      if (err1) return reject(err1);
      conn.exec(insertRecibo, (err2) => {
        if (err2) return reject(err2);
        resolve();
      });
    });
  });
}

// Ejecutar con parámetros para ML
if (require.main === module) {
  generarOrdenesML(800);
}

// Exportar funciones para uso en otros módulos
module.exports = {
  generarOrdenesML,
  crearOrden,
  agregarArticuloAOrden,
  getOrderScheduleDates,
  groupArticlesBySupplier,
  calculateOrderQuantity,
  needsRestock
};
