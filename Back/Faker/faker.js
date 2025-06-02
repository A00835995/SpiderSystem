import { faker } from '@faker-js/faker';

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
  const fecMovto = new Date().toISOString().slice(0, 19).replace('T', ' '); // formato para SAP HANA

  console.log(`INSERT INTO "DBADMIN"."ARTICULO" (
  "ARTCODIGO", "ARTNOMBRE", "ARTDESC", "ARTCATEG", "ARTPRECIOCOMPRA",
  "ARTPRECIOVENTA", "ARTIVA", "ARTMARGENOBJ", "ARTUBI", "ARTEXISTENCIA",
  "CATEGID", "IDPROV", "ELIMINADO", "FECMOVTO"
) VALUES (
  '${artCodigo}', '${artNombre}', '${artDesc}', '${artCateg}',
  ${artPrecioCompra}, ${artPrecioVenta}, ${artIva}, ${margen},
  '${artUbi}', ${artExistencia}, ${categId}, ${idProv}, ${eliminado},
  '${fecMovto}'
);`);
}
