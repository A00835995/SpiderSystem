from hana_ml import dataframe
from dotenv import load_dotenv
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.preprocessing import LabelEncoder
import pickle
import os
import numpy as np

# 1. Cargar conexión desde .env
load_dotenv()
hana_host, hana_port = os.getenv("HANA_SERVER").split(":")
conn = dataframe.ConnectionContext(
    address=hana_host,
    port=int(hana_port),
    user=os.getenv("HANA_USER"),
    password=os.getenv("HANA_PASSWORD")
)

# 2. Obtener y agregar datos
print("📊 Cargando y agregando datos de ventas por mes...")
sql_query = """
WITH ventas_por_mes AS (
    SELECT 
        "ARTIID",
        TO_VARCHAR("FECMOVTO", 'YYYYMM') as "PERIODO",
        SUM("VtaCant") as "UNIDADES_VENDIDAS"
    FROM "DBADMIN"."VentaEnc"
    WHERE "ELIMINADO" = 0 
        AND "FECMOVTO" IS NOT NULL 
        AND "VtaCant" > 0
    GROUP BY "ARTIID", TO_VARCHAR("FECMOVTO", 'YYYYMM')
    HAVING SUM("VtaCant") >= 1
),
promedio_por_articulo AS (
    SELECT 
        "ARTIID",
        AVG("VtaCant") as "PROMEDIO_HISTORICO"
    FROM "DBADMIN"."VentaEnc"
    WHERE "ELIMINADO" = 0 AND "VtaCant" > 0
    GROUP BY "ARTIID"
)
SELECT 
    v."ARTIID",
    v."PERIODO",
    v."UNIDADES_VENDIDAS",
    p."PROMEDIO_HISTORICO"
FROM ventas_por_mes v
JOIN promedio_por_articulo p ON v."ARTIID" = p."ARTIID"
ORDER BY v."ARTIID", CAST(v."PERIODO" AS INTEGER)
"""

ventas_df = conn.sql(sql_query).collect()
print("✅ Datos agregados exitosamente")

# 3. Preparar datos
ventas_df["PERIODO"] = ventas_df["PERIODO"].astype(int)

# 4. Definir variables predictoras y objetivo - USANDO PROMEDIO HISTÓRICO
X = ventas_df[["PERIODO", "PROMEDIO_HISTORICO"]]
y = ventas_df["UNIDADES_VENDIDAS"]

print(f"🧾 Registros totales después de agrupar: {len(ventas_df)}")
print(f"🛒 Artículos únicos: {ventas_df['ARTIID'].nunique()}")
print(f"📆 Períodos únicos: {ventas_df['PERIODO'].nunique()}")

# 5. Dividir datos
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"📚 Entrenamiento: {len(X_train)} registros")
print(f"🧪 Prueba: {len(X_test)} registros")

# 6. Entrenar modelo
print("🤖 Entrenando modelo con scikit-learn...")
model = LinearRegression()
model.fit(X_train, y_train)
print("✅ Modelo entrenado")

# 7. Guardar modelo (ya no necesitamos LabelEncoder)
os.makedirs("modelos", exist_ok=True)
with open("modelos/modelo_demanda_mensual.pkl", "wb") as f:
    pickle.dump(model, f)
print("💾 Modelo guardado en carpeta 'modelos'")

# 8. Predicciones y evaluación
print("🔮 Generando predicciones...")
predicciones = model.predict(X_test)

# Crear DataFrame de resultados con los datos originales
resultado_df = ventas_df.iloc[X_test.index].copy()
resultado_df["UNIDADES_VENDIDAS_REAL"] = y_test.values
resultado_df["PREDICCION"] = predicciones

# 9. Subir predicciones a SAP HANA
print("📤 Subiendo predicciones a SAP HANA...")
try:
    conn.drop_table("PREDICCION_DEMANDA_MENSUAL")
except:
    pass

from hana_ml.dataframe import create_dataframe_from_pandas
hana_df = create_dataframe_from_pandas(
    connection_context=conn,
    pandas_df=resultado_df.reset_index(drop=True)[["ARTIID", "PERIODO", "UNIDADES_VENDIDAS_REAL", "PREDICCION"]],
    table_name="PREDICCION_DEMANDA_MENSUAL",
    force=True
)
print("✅ Tabla 'PREDICCION_DEMANDA_MENSUAL' creada exitosamente")

# 10. Métricas de evaluación
r2 = r2_score(y_test, predicciones)
mae = mean_absolute_error(y_test, predicciones)
rmse = np.sqrt(mean_squared_error(y_test, predicciones))

print("\n📊 Evaluación del modelo:")
print(f"R² Score: {r2:.4f}")
print(f"MAE (Error Absoluto Medio): {mae:.2f}")
print(f"RMSE (Raíz del Error Cuadrático Medio): {rmse:.2f}")
print(f"📈 Rango real: {y_test.min():.0f} - {y_test.max():.0f}")
print(f"🔮 Rango predicciones: {predicciones.min():.0f} - {predicciones.max():.0f}")

# 11. Muestra de resultados
print("\n📋 Muestra de predicciones:")
print(resultado_df[["ARTIID", "PERIODO", "UNIDADES_VENDIDAS_REAL", "PREDICCION"]].head(10))

# 12. Cerrar conexión
conn.close()
print("\n🎯 Proceso completado con éxito.")
