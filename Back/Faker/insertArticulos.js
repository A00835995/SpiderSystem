const { faker } = require('@faker-js/faker');
const { connectToHANA } = require('../Config/confDB');
const fs = require('fs');
require('dotenv').config();

async function insertArticulos() {
  try {
    const conn = await connectToHANA();
    console.log('✅ Conexión lista, insertando artículos...');

    let insertsToFile = '';

    for (let i = 1; i <= 10; i++) {
      const artCodigo = `COD10${i.toString().padStart(2, '0')}`;
      const artNombre = faker.commerce.productName();
      const artDesc = faker.commerce.productDescription();
      const artCateg = faker.commerce.department();
      const artPrecioCompra = Number(faker.commerce.price({ min: 50, max: 1000 }));
      const margen = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
      const artPrecioVenta = +(artPrecioCompra * (1 + margen / 100)).toFixed(2);
      const artIva = 16;
      const artUbi = faker.location.streetAddress();
      const artExistencia = Math.floor(Math.random() * 91) + 10;
      const categId = Math.floor(Math.random() * 4) + 1;
      const idProv = Math.floor(Math.random() * 4) + 1;
      const eliminado = 0;
      const fecMovto = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const query = `
INSERT INTO "DBADMIN"."ARTICULO" (
  "ARTCODIGO", "ARTNOMBRE", "ARTDESC", "ARTCATEG", "ARTPRECIOCOMPRA",
  "ARTPRECIOVENTA", "ARTIVA", "ARTMARGENOBJ", "ARTUBI", "ARTEXISTENCIA",
  "CATEGID", "IDPROV", "ELIMINADO", "FECMOVTO"
) VALUES (
  '${artCodigo}', '${artNombre}', '${artDesc}', '${artCateg}',
  ${artPrecioCompra}, ${artPrecioVenta}, ${artIva}, ${margen},
  '${artUbi}', ${artExistencia}, ${categId}, ${idProv}, ${eliminado},
  '${fecMovto}'
);`;

      insertsToFile += query + '\n';

      await new Promise((resolve, reject) => {
        conn.exec(query, (err) => {
          if (err) {
            console.error(`❌ Error insertando ${artCodigo}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Insertado ${artCodigo}`);
            resolve();
          }
        });
      });
    }

    fs.writeFileSync('inserts_articulos.sql', insertsToFile, 'utf8');
    console.log('📝 Archivo SQL guardado como inserts_articulos.sql');

    console.log('🚀 Inserción finalizada.');
    conn.disconnect();
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

insertArticulos();
