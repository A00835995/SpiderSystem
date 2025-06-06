const { connectToHANA } = require('../Config/confDB');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

function getRandomDateWithinLastMonths(months = 5) {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - months);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()))
    .toISOString().slice(0, 19).replace('T', ' ');
}

async function generarOrdenes(numOrdenes = 20) {
  const conn = await connectToHANA();

  // Obtener artículos existentes con su ID y precio de compra
  const articulos = await new Promise((resolve, reject) => {
    conn.exec(`SELECT "ARTIID", "ARTPRECIOCOMPRA", "IDPROV" FROM "DBADMIN"."ARTICULO" WHERE "ELIMINADO" = 0`, (err, rows) => {
      if (err) return reject(err instanceof Error ? err : new Error(String(err)));
      resolve(rows);
    });
  });

  if (articulos.length === 0) {
    console.error('❌ No hay artículos disponibles.');
    conn.disconnect();
    return;
  }

  for (let i = 0; i < numOrdenes; i++) {
    const articuloAleatorio = faker.helpers.arrayElement(articulos);
    const idProv = articuloAleatorio.IDPROV;
    const idPago = faker.helpers.arrayElement([1, 2]); // 1: Crédito, 2: Transferencia
    const idOrdStat = 2;
    const fecMovto = getRandomDateWithinLastMonths();
    const fechaEntrega = new Date(new Date(fecMovto).getTime() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');    

    // Insertar en ORDEN
    const insertOrdenSQL = `
      INSERT INTO "DBADMIN"."ORDEN" ("IDPROV", "IDPAGO", "IDORDSTAT", "FECHAENTREGA", "FECMOVTO", "ELIMINADO")
      VALUES (${idProv}, ${idPago}, ${idOrdStat}, '${fechaEntrega}', '${fecMovto}', 0);
    `;

    const idOrden = await new Promise((resolve, reject) => {
      conn.exec(insertOrdenSQL, (err) => {
        if (err) return reject(err instanceof Error ? err : new Error(String(err)));

        // Obtener el último IDORDEN generado
        conn.exec(`SELECT MAX("IDORDEN") AS "IDORDEN" FROM "DBADMIN"."ORDEN"`, (err2, rows) => {
          if (err2) return reject(err2 instanceof Error ? err2 : new Error(String(err2)));
          resolve(rows[0].IDORDEN);
        });
      });
    });

    // Elegir de 1 a 5 artículos
    const numArticulos = faker.number.int({ min: 1, max: 20 });
    const articulosSeleccionados = faker.helpers.shuffle(articulos).slice(0, numArticulos);


    for (const art of articulosSeleccionados) {
      const cantidad = Math.floor(Math.random() * 25) + 1;
      const precioCompra = parseFloat(art.ARTPRECIOCOMPRA).toFixed(2);
      const precioIVA = +(precioCompra * 1.16).toFixed(2);

      const insertArt = `
        INSERT INTO "DBADMIN"."ORDENART" 
        ("IDORDEN", "ARTIID", "ORDARTCANT", "ORDPRECIOCOMP", "ORDPRECIOIVA", "ELIMINADO", "FECMOVTO")
        VALUES (${idOrden}, ${art.ARTIID}, ${cantidad}, ${precioCompra}, ${precioIVA}, 0, '${fecMovto}');
      `;

      const insertRecibo = `
        INSERT INTO "DBADMIN"."ORDENRECIBO"
        ("IDORDEN", "ARTIID", "CANTIDADRECB")
        VALUES (${idOrden}, ${art.ARTIID}, ${cantidad});
      `;

      await new Promise((resolve, reject) => {
        conn.exec(insertArt, (err1) => {
          if (err1) return reject(err1 instanceof Error ? err1 : new Error(String(err1)));
          conn.exec(insertRecibo, (err2) => {
            if (err2) return reject(err2 instanceof Error ? err2 : new Error(String(err2)));
            resolve();
          });
        });
      });
    }

    console.log(`✅ Orden ${idOrden} generada con artículos.`);
  }

  conn.disconnect();
  console.log('🚀 Inserción de órdenes completada.');
}

generarOrdenes(5);
