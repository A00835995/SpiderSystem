const { connectToHANA } = require('../Config/confDB');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

function getRandomDateWithinLastMonths(months = 12) {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - months);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()))
    .toISOString().slice(0, 19).replace('T', ' ');
}

async function generarVentas(numVentas = 20) {
  const conn = await connectToHANA();

  // Obtener artículos existentes con su ID y precios
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

  for (let i = 0; i < numVentas; i++) {
    const fecMovto = getRandomDateWithinLastMonths();

    // Insertar en VENTA
    const insertVentaSQL = `
      INSERT INTO "DBADMIN"."VENTA" ("FECMOVTO", "ELIMINADO")
      VALUES ('${fecMovto}', 0);
    `;

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
      
      // Usar precio de venta si existe, sino calcular margen sobre precio de compra
      let precioVenta;
      if (art.ARTPRECIOVENTA && art.ARTPRECIOVENTA > 0) {
        precioVenta = parseFloat(art.ARTPRECIOVENTA);
      } else {
        // Si no hay precio de venta, aplicar margen del 30-50% sobre precio de compra
        const margen = faker.number.float({ min: 1.3, max: 1.5 });
        precioVenta = parseFloat(art.ARTPRECIOCOMPRA) * margen;
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

    console.log(`✅ Venta ${idVenta} generada con ${articulosSeleccionados.length} artículos.`);
  }

  conn.disconnect();
  console.log('🚀 Inserción de ventas completada.');
}

// Ejecutar el generador con 30 ventas por defecto
generarVentas(30);
