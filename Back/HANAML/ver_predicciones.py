from hana_ml import dataframe
from dotenv import load_dotenv
import os

load_dotenv()
hana_host, hana_port = os.getenv('HANA_SERVER').split(':')
conn = dataframe.ConnectionContext(
    address=hana_host, 
    port=int(hana_port), 
    user=os.getenv('HANA_USER'), 
    password=os.getenv('HANA_PASSWORD')
)

result = conn.sql('SELECT "ARTIID", "PERIODO", "PREDICCION" FROM "DBADMIN"."PREDICCION_DEMANDA_SIG_MES" ORDER BY "ARTIID"').collect()
print('Nuevas predicciones con modelo mejorado:')
print("=" * 40)
print(result.head(20))

print("\n" + "=" * 40)
print("Estadísticas de predicciones:")
print(f"Predicción mínima: {result['PREDICCION'].min()}")
print(f"Predicción máxima: {result['PREDICCION'].max()}")
print(f"Predicción promedio: {result['PREDICCION'].mean():.2f}")

conn.close() 