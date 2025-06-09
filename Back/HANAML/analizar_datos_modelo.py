from hana_ml import dataframe
from dotenv import load_dotenv
import pandas as pd
import os

# Conectar a SAP HANA
load_dotenv()
hana_host, hana_port = os.getenv("HANA_SERVER").split(":")
conn = dataframe.ConnectionContext(
    address=hana_host,
    port=int(hana_port),
    user=os.getenv("HANA_USER"),
    password=os.getenv("HANA_PASSWORD")
)

print("🔍 ANÁLISIS DE DATOS PARA PREDICCIÓN DE TENDENCIA GLOBAL")
print("=" * 60)

# 1. Mostrar la query exacta que usa el modelo
print("\n📊 QUERY SQL UTILIZADA:")
print("-" * 30)
sql_query = """
SELECT 
    TO_VARCHAR("FECMOVTO", 'YYYYMM') AS "PERIODO",
    SUM("VtaCant") AS "VENTAS_TOTALES",
    COUNT(DISTINCT "ARTIID") AS "ARTICULOS_VENDIDOS",
    COUNT(*) AS "TRANSACCIONES"
FROM "DBADMIN"."VentaEnc"
WHERE "ELIMINADO" = 0 AND "FECMOVTO" IS NOT NULL AND "VtaCant" > 0
GROUP BY TO_VARCHAR("FECMOVTO", 'YYYYMM')
ORDER BY "PERIODO"
"""
print(sql_query)

# 2. Obtener y mostrar todos los datos
ventas_df = conn.sql(sql_query).collect()
ventas_df["PERIODO"] = ventas_df["PERIODO"].astype(int)

print(f"\n📈 DATOS HISTÓRICOS COMPLETOS ({len(ventas_df)} períodos):")
print("-" * 50)
print(ventas_df.to_string(index=False))

# 3. Preparar datos como lo hace el modelo
ventas_df = ventas_df.reset_index()
ventas_df["PERIODO_NUM"] = range(len(ventas_df))

print(f"\n🤖 VARIABLES QUE USA EL MODELO:")
print("-" * 35)
print("X (Variables predictoras):")
print("- PERIODO_NUM: Secuencia numérica (0, 1, 2, 3...)")
print("- PERIODO: Período real (202406, 202407, 202408...)")
print("\ny (Variable objetivo):")
print("- VENTAS_TOTALES: Suma de todas las ventas del mes")

print(f"\n📊 DATASET DE ENTRENAMIENTO:")
print("-" * 30)
training_data = ventas_df[["PERIODO_NUM", "PERIODO", "VENTAS_TOTALES"]]
print(training_data.to_string(index=False))

# 4. Estadísticas descriptivas
print(f"\n📈 ESTADÍSTICAS DE LOS DATOS:")
print("-" * 30)
print(f"Período más antiguo: {ventas_df['PERIODO'].min()}")
print(f"Período más reciente: {ventas_df['PERIODO'].max()}")
print(f"Total períodos: {len(ventas_df)}")
print(f"Ventas promedio por mes: {ventas_df['VENTAS_TOTALES'].mean():.1f}")
print(f"Ventas mínimas: {ventas_df['VENTAS_TOTALES'].min()}")
print(f"Ventas máximas: {ventas_df['VENTAS_TOTALES'].max()}")
print(f"Desviación estándar: {ventas_df['VENTAS_TOTALES'].std():.1f}")

# 5. Análisis de tendencia
print(f"\n📉 ANÁLISIS DE TENDENCIA:")
print("-" * 25)
primeros_3 = ventas_df['VENTAS_TOTALES'].head(3).mean()
ultimos_3 = ventas_df['VENTAS_TOTALES'].tail(3).mean()
cambio_total = ultimos_3 - primeros_3
cambio_porcentual = (cambio_total / primeros_3) * 100

print(f"Promedio primeros 3 meses: {primeros_3:.1f}")
print(f"Promedio últimos 3 meses: {ultimos_3:.1f}")
print(f"Cambio total: {cambio_total:+.1f} unidades")
print(f"Cambio porcentual: {cambio_porcentual:+.1f}%")

if cambio_total < 0:
    print("🔻 TENDENCIA: DECRECIENTE")
elif cambio_total > 0:
    print("🔺 TENDENCIA: CRECIENTE")
else:
    print("➡️ TENDENCIA: ESTABLE")

# 6. Filtros aplicados
print(f"\n🔍 FILTROS APLICADOS A LOS DATOS:")
print("-" * 35)
print('✅ "ELIMINADO" = 0 (solo registros activos)')
print('✅ "FECMOVTO" IS NOT NULL (solo con fecha válida)')
print('✅ "VtaCant" > 0 (solo ventas positivas)')
print('✅ Agrupado por mes (TO_VARCHAR("FECMOVTO", \'YYYYMM\'))')

# 7. Qué NO incluye
print(f"\n❌ QUE NO INCLUYE EL MODELO:")
print("-" * 30)
print("- Estacionalidad (patrones por época del año)")
print("- Días de la semana o feriados")
print("- Factores externos (economía, competencia)")
print("- Diferencias por producto individual")
print("- Diferencias por cliente o región")
print("- Promociones o descuentos")

conn.close()
print(f"\n✅ Análisis completado") 