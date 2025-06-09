from hana_ml import dataframe
from dotenv import load_dotenv
import os

# Conectar a SAP HANA
load_dotenv()
hana_host, hana_port = os.getenv('HANA_SERVER').split(':')
conn = dataframe.ConnectionContext(
    address=hana_host, 
    port=int(hana_port), 
    user=os.getenv('HANA_USER'), 
    password=os.getenv('HANA_PASSWORD')
)

# Consultar ventas promedio por artículo
query = '''
SELECT 
    "ARTIID", 
    AVG("VtaCant") as PROMEDIO_VENTAS,
    COUNT(*) as TOTAL_TRANSACCIONES
FROM "DBADMIN"."VentaEnc" 
WHERE "ELIMINADO" = 0 AND "VtaCant" > 0 
GROUP BY "ARTIID" 
ORDER BY "ARTIID"
'''

result = conn.sql(query).collect()
print("ARTIID vs Promedio Real de Ventas:")
print("=" * 40)
print(result.head(20))

print("\n" + "=" * 40)
print("Estadísticas:")
print(f"Artículo con menor promedio: {result['PROMEDIO_VENTAS'].min():.2f}")
print(f"Artículo con mayor promedio: {result['PROMEDIO_VENTAS'].max():.2f}")
print(f"Promedio general: {result['PROMEDIO_VENTAS'].mean():.2f}")

conn.close() 