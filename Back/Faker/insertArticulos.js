const { faker } = require('@faker-js/faker');
const { connectToHANA5 } = require('../Config/confDB');
const fs = require('fs');
require('dotenv').config();

// Función para escapar comillas simples en SQL
function escapeSQLString(str) {
  return str.replace(/'/g, "''");
}

async function insertArticulos() {
  try {
    const conn = await connectToHANA5();
    console.log('✅ Conexión lista, insertando artículos...');

    let insertsToFile = '';
    const ubicaciones = ['Almacén A', 'Almacén B', 'Almacén C'];
    const tiposZapato = [
        'Zapatillas', 'Botines', 'Sandalias', 'Tenis', 'Zapatos de vestir',
        'Pantuflas', 'Mocasines', 'Bailarinas', 'Tacones', 'Botas'
      ];


    for (let i = 26; i <= 50; i++) {
      const artCodigo = `COD${i.toString().padStart(4, '0')}`;
      const artNombre = escapeSQLString(`${faker.commerce.productMaterial()} ${tiposZapato[Math.floor(Math.random() * tiposZapato.length)]}`);
      const artDesc = escapeSQLString(faker.commerce.productDescription());
      const artPrecioCompra = Number(faker.commerce.price({ min: 50, max: 1000 }));
      const margen = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
      const artPrecioVenta = +(artPrecioCompra * (1 + margen / 100)).toFixed(2);
      const artIva = 1.600;
      const artUbi = escapeSQLString(ubicaciones[Math.floor(Math.random() * ubicaciones.length)]);
      const artExistencia = Math.floor(Math.random() * 51);
      const categId = Math.floor(Math.random() * 4) + 1;
      const idProv = Math.floor(Math.random() * 4) + 1;
      const eliminado = 0;
      const fecMovto = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const query = `
INSERT INTO "DBADMIN"."ARTICULO" (
  "ARTCODIGO", "ARTNOMBRE", "ARTDESC", "ARTPRECIOCOMPRA",
  "ARTPRECIOVENTA", "ARTIVA", "ARTMARGENOBJ", "ARTUBI", "ARTEXISTENCIA",
  "CATEGID", "IDPROV", "ELIMINADO", "FECMOVTO"
) VALUES (
  '${artCodigo}', '${artNombre}', '${artDesc}',
  ${artPrecioCompra}, ${artPrecioVenta}, ${artIva}, ${margen},
  '${artUbi}', ${artExistencia}, ${categId}, ${idProv}, ${eliminado},
  '${fecMovto}'
);`;

      insertsToFile += query + '\n';

      await new Promise((resolve, reject) => {
        conn.exec(query, (err) => {
          if (err) {
            console.error(`❌ Error insertando ${artCodigo}:`, err.message);
            reject(err instanceof Error ? err : new Error(String(err)));
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
