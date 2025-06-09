from hana_ml import dataframe
from hana_ml.dataframe import create_dataframe_from_pandas
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import os
from datetime import datetime

print("🚨 DETECCIÓN DE RIESGO DE STOCK FUTURO")
print("=" * 50)

# 1. Conectar a SAP HANA
load_dotenv()
hana_host, hana_port = os.getenv("HANA_SERVER").split(":")
conn = dataframe.ConnectionContext(
    address=hana_host,
    port=int(hana_port),
    user=os.getenv("HANA_USER"),
    password=os.getenv("HANA_PASSWORD")
)

print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ✅ Conectado a SAP HANA")

# 2. Obtener predicción, existencia y análisis de órdenes
print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 📊 Obteniendo datos de riesgo...")

sql = """
WITH dias_entre_ordenes AS (
    SELECT 
        oa."ARTIID",
        AVG(DAYS_BETWEEN(o."FECMOVTO", o."FECHAENTREGA")) AS "DIAS_PROM_ENTRE_ORDENES",
        COUNT(*) AS "TOTAL_ORDENES"
    FROM "DBADMIN"."ORDEN" o
    JOIN "DBADMIN"."ORDENART" oa ON o."IDORDEN" = oa."IDORDEN"
    WHERE o."FECMOVTO" IS NOT NULL 
        AND o."FECHAENTREGA" IS NOT NULL
        AND o."ELIMINADO" = 0
        AND oa."ELIMINADO" = 0
    GROUP BY oa."ARTIID"
),
ventas_recientes AS (
    SELECT 
        "ARTIID",
        AVG("VtaCant") AS "VENTA_PROMEDIO_MENSUAL",
        COUNT(*) AS "TRANSACCIONES_RECIENTES"
    FROM "DBADMIN"."VentaEnc"
    WHERE "ELIMINADO" = 0 
        AND "FECMOVTO" IS NOT NULL 
        AND "VtaCant" > 0
        AND TO_VARCHAR("FECMOVTO", 'YYYYMM') >= '202504'  -- Últimos 3 meses
    GROUP BY "ARTIID"
)

SELECT 
    p."ARTIID",
    a."ARTNOMBRE",
    p."PERIODO",
    a."ARTEXISTENCIA" AS "EXISTENCIA_ACTUAL",
    p."PREDICCION",
    vr."VENTA_PROMEDIO_MENSUAL",
    d."DIAS_PROM_ENTRE_ORDENES",
    d."TOTAL_ORDENES",
    
    -- Cálculo de días de cobertura
    CASE 
        WHEN p."PREDICCION" > 0 THEN 
            ROUND((a."ARTEXISTENCIA" / p."PREDICCION") * 30, 1)
        ELSE 999
    END AS "DIAS_COBERTURA",
    
    -- Clasificación de riesgo mejorada
    CASE 
        WHEN a."ARTEXISTENCIA" = 0 THEN 'CRITICO'
        WHEN p."PREDICCION" > a."ARTEXISTENCIA" * 2 THEN 'CRITICO'
        WHEN p."PREDICCION" > a."ARTEXISTENCIA" THEN 'ALTO'
        WHEN p."PREDICCION" > a."ARTEXISTENCIA" * 0.7 THEN 'MEDIO'
        ELSE 'BAJO'
    END AS "RIESGO",
    
    -- Déficit estimado
    CASE 
        WHEN p."PREDICCION" > a."ARTEXISTENCIA" THEN 
            p."PREDICCION" - a."ARTEXISTENCIA"
        ELSE 0
    END AS "DEFICIT_ESTIMADO",
    
    -- Prioridad de reorden
    CASE 
        WHEN a."ARTEXISTENCIA" = 0 THEN 1
        WHEN p."PREDICCION" > a."ARTEXISTENCIA" * 2 THEN 2
        WHEN p."PREDICCION" > a."ARTEXISTENCIA" THEN 3
        WHEN p."PREDICCION" > a."ARTEXISTENCIA" * 0.7 THEN 4
        ELSE 5
    END AS "PRIORIDAD_REORDEN"

FROM "DBADMIN"."PREDICCION_DEMANDA_SIG_MES" p
JOIN "DBADMIN"."ARTICULO" a ON a."ARTIID" = p."ARTIID"
LEFT JOIN dias_entre_ordenes d ON d."ARTIID" = a."ARTIID"
LEFT JOIN ventas_recientes vr ON vr."ARTIID" = a."ARTIID"
WHERE a."ELIMINADO" = 0
ORDER BY "PRIORIDAD_REORDEN", "DEFICIT_ESTIMADO" DESC
"""

try:
    riesgo_df = conn.sql(sql).collect()
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 📈 Datos obtenidos: {len(riesgo_df)} productos analizados")
except Exception as e:
    print(f"❌ Error obteniendo datos: {e}")
    conn.close()
    exit()

# 3. Análisis de los resultados
print(f"\n📊 ANÁLISIS DE RIESGO:")
print("-" * 30)

# Contar por nivel de riesgo
riesgo_counts = riesgo_df['RIESGO'].value_counts()
for riesgo, count in riesgo_counts.items():
    print(f"   {riesgo}: {count} productos")

# Productos críticos
criticos = riesgo_df[riesgo_df['RIESGO'] == 'CRITICO']
if len(criticos) > 0:
    print(f"\n🚨 PRODUCTOS CRÍTICOS ({len(criticos)}):")
    for _, row in criticos.head(5).iterrows():
        print(f"   • {row['ARTNOMBRE']}: Stock {row['EXISTENCIA_ACTUAL']}, Predicción {row['PREDICCION']}")

# Productos con mayor déficit
deficit_alto = riesgo_df[riesgo_df['DEFICIT_ESTIMADO'] > 0].sort_values('DEFICIT_ESTIMADO', ascending=False)
if len(deficit_alto) > 0:
    print(f"\n📉 MAYOR DÉFICIT ESTIMADO:")
    for _, row in deficit_alto.head(3).iterrows():
        print(f"   • {row['ARTNOMBRE']}: Déficit {row['DEFICIT_ESTIMADO']} unidades")

# Estadísticas generales
print(f"\n📈 ESTADÍSTICAS GENERALES:")
print(f"   Total productos analizados: {len(riesgo_df)}")
print(f"   Productos con déficit: {len(riesgo_df[riesgo_df['DEFICIT_ESTIMADO'] > 0])}")
print(f"   Déficit total estimado: {riesgo_df['DEFICIT_ESTIMADO'].sum():.0f} unidades")

# Cobertura promedio
cobertura_promedio = riesgo_df[riesgo_df['DIAS_COBERTURA'] < 999]['DIAS_COBERTURA'].mean()
print(f"   Días de cobertura promedio: {cobertura_promedio:.1f} días")

# 4. Subir resultados a SAP HANA
print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 📤 Subiendo resultados a SAP HANA...")

try:
    # Eliminar tabla anterior si existe
    try:
        conn.drop_table("RIESGO_STOCK_FUTURO")
        print("   🗑️ Tabla anterior eliminada")
    except:
        pass

    # Crear nueva tabla
    create_dataframe_from_pandas(
        connection_context=conn,
        pandas_df=riesgo_df,
        table_name="RIESGO_STOCK_FUTURO",
        force=True
    )
    
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ✅ Tabla 'RIESGO_STOCK_FUTURO' creada exitosamente")
    print(f"   📊 {len(riesgo_df)} registros insertados")

except Exception as e:
    print(f"❌ Error creando tabla: {e}")

# 5. Crear vista de resumen para dashboard
print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 📋 Creando vista de resumen...")

sql_vista_resumen = """
CREATE OR REPLACE VIEW "DBADMIN"."RESUMEN_RIESGO_STOCK" AS
SELECT 
    "RIESGO",
    COUNT(*) AS "CANTIDAD_PRODUCTOS",
    SUM("DEFICIT_ESTIMADO") AS "DEFICIT_TOTAL",
    AVG("DIAS_COBERTURA") AS "COBERTURA_PROMEDIO",
    MIN("DIAS_COBERTURA") AS "COBERTURA_MINIMA",
    MAX("DEFICIT_ESTIMADO") AS "DEFICIT_MAXIMO"
FROM "DBADMIN"."RIESGO_STOCK_FUTURO"
WHERE "DIAS_COBERTURA" < 999
GROUP BY "RIESGO"
ORDER BY 
    CASE "RIESGO"
        WHEN 'CRITICO' THEN 1
        WHEN 'ALTO' THEN 2
        WHEN 'MEDIO' THEN 3
        WHEN 'BAJO' THEN 4
    END
"""

try:
    conn.sql(sql_vista_resumen).collect()
    print("   ✅ Vista 'RESUMEN_RIESGO_STOCK' creada")
except Exception as e:
    print(f"   ⚠️ Error creando vista: {e}")

# 6. Recomendaciones de acción
print(f"\n🎯 RECOMENDACIONES DE ACCIÓN:")
print("-" * 35)

productos_accion = riesgo_df[riesgo_df['RIESGO'].isin(['CRITICO', 'ALTO'])].sort_values('PRIORIDAD_REORDEN')

if len(productos_accion) > 0:
    print("📋 Productos que requieren acción inmediata:")
    for i, (_, row) in enumerate(productos_accion.head(10).iterrows(), 1):
        dias_cobertura = row['DIAS_COBERTURA'] if row['DIAS_COBERTURA'] < 999 else 0
        print(f"   {i}. {row['ARTNOMBRE']}")
        print(f"      • Riesgo: {row['RIESGO']}")
        print(f"      • Stock actual: {row['EXISTENCIA_ACTUAL']}")
        print(f"      • Predicción: {row['PREDICCION']}")
        print(f"      • Déficit: {row['DEFICIT_ESTIMADO']}")
        print(f"      • Cobertura: {dias_cobertura:.1f} días")
        print()
else:
    print("✅ No hay productos con riesgo crítico o alto")

print(f"\n📊 PRÓXIMOS PASOS SUGERIDOS:")
print("1. Revisar productos críticos inmediatamente")
print("2. Generar órdenes de compra para productos con déficit")
print("3. Monitorear productos con riesgo medio")
print("4. Actualizar predicciones semanalmente")

conn.close()
print(f"\n✅ Análisis de riesgo completado - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}") 