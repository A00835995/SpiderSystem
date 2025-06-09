from hana_ml import dataframe
from hana_ml.dataframe import create_dataframe_from_pandas
from dotenv import load_dotenv
import pandas as pd
import pickle
import os
from datetime import datetime

def log_with_timestamp(message):
    """Función para logging con timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

# Inicio del proceso
log_with_timestamp("🚀 Iniciando proceso de carga de predicciones de demanda mensual")

# 1. Cargar conexión SAP HANA
try:
    load_dotenv()
    hana_host, hana_port = os.getenv("HANA_SERVER").split(":")
    conn = dataframe.ConnectionContext(
        address=hana_host,
        port=int(hana_port),
        user=os.getenv("HANA_USER"),
        password=os.getenv("HANA_PASSWORD")
    )
    log_with_timestamp("✅ Conectado a SAP HANA")
except Exception as e:
    log_with_timestamp(f"❌ Error conectando a SAP HANA: {e}")
    exit(1)

# 2. Cargar modelo (ya no hay codificador)
try:
    # Usar ruta absoluta para los modelos
    modelos_dir = os.path.join(os.path.dirname(__file__), "modelos")
    modelo_path = os.path.join(modelos_dir, "modelo_demanda_mensual.pkl")
    
    if not os.path.exists(modelo_path):
        raise FileNotFoundError("Archivo de modelo no encontrado")
    
    with open(modelo_path, "rb") as f:
        model = pickle.load(f)
    log_with_timestamp("✅ Modelo cargado correctamente")
except Exception as e:
    log_with_timestamp(f"❌ Error cargando modelo: {e}")
    log_with_timestamp("💡 Ejecuta primero PREDICCION_DEMANDA_MENSUAL.py para entrenar el modelo")
    conn.close()
    exit(1)

# 3. Obtener último período
try:
    log_with_timestamp("📅 Obteniendo último período registrado...")
    query_periodo = """
    SELECT MAX(TO_INTEGER(TO_VARCHAR("FECMOVTO", 'YYYYMM'))) AS MAX_PERIODO
    FROM "DBADMIN"."VentaEnc"
    WHERE "ELIMINADO" = 0 AND "FECMOVTO" IS NOT NULL
    """
    resultado_periodo = conn.sql(query_periodo).collect()
    
    if resultado_periodo.empty or resultado_periodo.at[0, "MAX_PERIODO"] is None:
        raise ValueError("No se encontraron datos de ventas válidos")
    
    ultimo_periodo = resultado_periodo.at[0, "MAX_PERIODO"]
    proximo_periodo = ultimo_periodo + 1  # Ej. si es 202506, será 202507
    log_with_timestamp(f"📅 Último período: {ultimo_periodo}, Próximo a predecir: {proximo_periodo}")
except Exception as e:
    log_with_timestamp(f"❌ Error obteniendo período: {e}")
    conn.close()
    exit(1)

# 4. Obtener artículos únicos con su promedio histórico
try:
    log_with_timestamp("📦 Obteniendo artículos activos con promedio histórico...")
    query_articulos = """
    SELECT DISTINCT 
        v."ARTIID",
        AVG(v."VtaCant") as "PROMEDIO_HISTORICO"
    FROM "DBADMIN"."VentaEnc" v
    WHERE v."ELIMINADO" = 0 AND v."ARTIID" IS NOT NULL AND v."VtaCant" > 0
    GROUP BY v."ARTIID"
    ORDER BY v."ARTIID"
    """
    df_articulos = conn.sql(query_articulos).collect()

    if df_articulos.empty:
        raise ValueError("No hay artículos activos para predecir")
    
    log_with_timestamp(f"📦 Encontrados {len(df_articulos)} artículos únicos")
except Exception as e:
    log_with_timestamp(f"❌ Error obteniendo artículos: {e}")
    conn.close()
    exit(1)

# 5. Preparar datos para predicción
try:
    log_with_timestamp("🔮 Generando predicciones...")
    df_articulos["PERIODO"] = proximo_periodo
    
    if df_articulos.empty:
        raise ValueError("No hay artículos válidos para predicción")
    
    # Usar PERIODO y PROMEDIO_HISTORICO para predicción
    X_pred = df_articulos[["PERIODO", "PROMEDIO_HISTORICO"]]
    df_articulos["PREDICCION"] = model.predict(X_pred)
    
    # Redondear predicciones a números enteros y asegurar valores positivos
    df_articulos["PREDICCION"] = df_articulos["PREDICCION"].round().astype(int).clip(lower=0)
    
    log_with_timestamp(f"🔮 Predicciones generadas para {len(df_articulos)} artículos")
except Exception as e:
    log_with_timestamp(f"❌ Error generando predicciones: {e}")
    conn.close()
    exit(1)

# 6. Subir predicciones con MERGE INTO
try:
    log_with_timestamp("📤 Subiendo predicciones a SAP HANA...")
    
    # Crear tabla temporal
    create_dataframe_from_pandas(
        connection_context=conn,
        pandas_df=df_articulos[["ARTIID", "PERIODO", "PREDICCION"]],
        table_name="PRED_TEMP",
        force=True
    )
    log_with_timestamp("📤 Tabla temporal creada")

    # Verificar datos en tabla temporal
    try:
        temp_check_sql = 'SELECT COUNT(*) as TOTAL_TEMP FROM "DBADMIN"."PRED_TEMP"'
        temp_result = conn.sql(temp_check_sql).collect()
        total_temp = temp_result.at[0, "TOTAL_TEMP"]
        log_with_timestamp(f"📊 Registros en tabla temporal: {total_temp}")
    except Exception as e:
        log_with_timestamp(f"⚠️ Error verificando tabla temporal: {e}")

    # Usar create_dataframe_from_pandas para crear/reemplazar la tabla directamente
    try:
        log_with_timestamp("📋 Creando tabla destino con create_dataframe_from_pandas...")
        
        # Obtener datos de la tabla temporal como pandas DataFrame
        temp_data = conn.sql('SELECT "ARTIID", "PERIODO", "PREDICCION" FROM "DBADMIN"."PRED_TEMP"').collect()
        
        # Crear la tabla destino directamente desde pandas
        create_dataframe_from_pandas(
            connection_context=conn,
            pandas_df=temp_data,
            table_name="PREDICCION_DEMANDA_SIG_MES",
            force=True
        )
        log_with_timestamp("✅ Tabla destino creada y datos insertados correctamente")
        
    except Exception as e:
        log_with_timestamp(f"❌ Error creando tabla destino: {e}")
        # Intentar limpiar tabla temporal en caso de error
        try:
            conn.drop_table("PRED_TEMP")
        except:
            pass
        conn.close()
        exit(1)

except Exception as e:
    log_with_timestamp(f"❌ Error en proceso de carga: {e}")
    # Intentar limpiar tabla temporal en caso de error
    try:
        conn.drop_table("PRED_TEMP")
    except:
        pass
    conn.close()
    exit(1)

# 7. Limpiar tabla temporal
try:
    conn.drop_table("PRED_TEMP")
    log_with_timestamp("🧹 Tabla temporal limpiada")
except Exception as e:
    log_with_timestamp(f"⚠️ Advertencia limpiando tabla temporal: {e}")

# 8. Finalizar
conn.close()
log_with_timestamp(f"🎯 Proceso completado exitosamente para el período {proximo_periodo}")
log_with_timestamp(f"📊 Total de predicciones procesadas: {len(df_articulos)}")
