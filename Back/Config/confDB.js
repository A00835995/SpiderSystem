// confDB.js
const path = require('path');

// Carga manual de .env si no ha sido cargado por otro archivo (como index.js)
if (!process.env.HANA_SERVER) {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const hana = require('@sap/hana-client');
const connection = hana.createConnection();

function connectToHANA() {
  return new Promise((resolve, reject) => {
    const connParams = {
      serverNode: process.env.HANA_SERVER1,
      uid: process.env.HANA_USER1,
      pwd: process.env.HANA_PASSWORD1,
    };

    try {
      connection.connect(connParams);
      console.log("✅ Conectado a SAP HANA");
      resolve(connection);
    } catch (error) {
      console.error("❌ Error al conectar a SAP HANA:", error);
      reject(error);
    }
  });
}

function connectToHANA5() {
    return new Promise((resolve, reject) => {
      const connParams = {
        serverNode: process.env.HANA_SERVER1,
        uid: process.env.HANA_USER1,
        pwd: process.env.HANA_PASSWORD1,
      };
  
      try {
        connection.connect(connParams);
        console.log("✅ Conectado a SAP HANA 5");
        resolve(connection);
      } catch (error) {
        console.error("❌ Error al conectar a SAP HANA 5:", error);
        reject(error);
      }
    });
  }

module.exports = { connection, connectToHANA, connectToHANA5 };
