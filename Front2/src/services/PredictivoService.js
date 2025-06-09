import { API_CONFIG } from '../config/api';
import axios from 'axios';

class PredictivoService {
    /**
     * Obtiene la tendencia de ventas anual (datos históricos + predicciones)
     * @param {number} anio - Año para obtener la tendencia
     * @returns {Promise} Respuesta con datos de tendencia de ventas
     */
    static async getTendenciaVentasAnual(anio) {
        try {
            console.log(`🔍 Obteniendo tendencia de ventas para el año: ${anio}`);
            
            const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.tendenciaVentasAnual.replace(':anio', anio)}`;
            console.log('🌐 URL completa:', url);
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📊 Tendencia de ventas obtenida:', response.data);
            return response.data;
            
        } catch (error) {
            console.error('❌ Error obteniendo tendencia de ventas anual:', error);
            
            // Manejo específico de errores
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 400:
                        throw new Error(data.message || 'Parámetros inválidos para obtener tendencia de ventas');
                    case 401:
                        throw new Error('No autorizado. Por favor, inicia sesión nuevamente');
                    case 404:
                        throw new Error(data.message || `No se encontraron datos de tendencia para el año ${anio}`);
                    case 500:
                        throw new Error(data.message || 'Error interno del servidor al obtener tendencia de ventas');
                    default:
                        throw new Error(`Error ${status}: ${data.message || 'Error desconocido'}`);
                }
            } else if (error.request) {
                throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet');
            } else {
                throw new Error('Error inesperado al procesar la solicitud');
            }
        }
    }

    /**
     * Obtiene el análisis de riesgo de stock futuro para un período específico
     * @param {string|number} periodo - Período en formato YYYYMM (ej: 202507)
     * @returns {Promise} Respuesta con datos de riesgo de stock futuro
     */
    static async getRiesgoStockFuturo(periodo) {
        try {
            console.log(`🔍 Obteniendo riesgo de stock futuro para el período: ${periodo}`);
            
            const url = `${API_CONFIG.baseUrl}/predictivo/riesgo-stock/futuro/${periodo}`;
            console.log('🌐 URL completa:', url);
            
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📊 Riesgo de stock futuro obtenido:', response.data);
            return response.data;
            
        } catch (error) {
            console.error('❌ Error obteniendo riesgo de stock futuro:', error);
            
            // Manejo específico de errores
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 400:
                        throw new Error(data.message || 'Parámetros inválidos para obtener riesgo de stock');
                    case 401:
                        throw new Error('No autorizado. Por favor, inicia sesión nuevamente');
                    case 404:
                        throw new Error(data.message || `No se encontraron datos de riesgo de stock para el período ${periodo}`);
                    case 500:
                        throw new Error(data.message || 'Error interno del servidor al obtener riesgo de stock');
                    default:
                        throw new Error(`Error ${status}: ${data.message || 'Error desconocido'}`);
                }
            } else if (error.request) {
                throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet');
            } else {
                throw new Error('Error inesperado al procesar la solicitud');
            }
        }
    }

    /**
     * Valida si un año es válido para consultas
     * @param {number} anio - Año a validar
     * @returns {boolean} True si el año es válido
     */
    static isValidYear(anio) {
        // Solo 2024 y 2025 son años válidos
        return anio === 2024 || anio === 2025;
    }

    /**
     * Valida si un período es válido para consultas de riesgo de stock
     * @param {string|number} periodo - Período en formato YYYYMM
     * @returns {boolean} True si el período es válido
     */
    static isValidPeriod(periodo) {
        const periodoStr = periodo.toString();
        
        // Validar formato (debe ser 6 dígitos)
        if (periodoStr.length !== 6 || isNaN(periodo)) {
            return false;
        }
        
        const anio = parseInt(periodoStr.substring(0, 4));
        const mes = parseInt(periodoStr.substring(4, 6));
        
        // Validar año (2024-2025) y mes (01-12)
        return this.isValidYear(anio) && mes >= 1 && mes <= 12;
    }

    /**
     * Obtiene los años disponibles para consulta
     * @returns {Array} Array de años disponibles
     */
    static getAvailableYears() {
        // Solo retornar 2024 y 2025 como años disponibles
        return [2024, 2025];
    }

    /**
     * Obtiene los períodos disponibles para análisis de riesgo de stock
     * @returns {Array} Array de períodos en formato YYYYMM
     */
    static getAvailablePeriods() {
        const periods = [];
        const years = this.getAvailableYears();
        
        years.forEach(year => {
            for (let month = 1; month <= 12; month++) {
                const monthStr = month.toString().padStart(2, '0');
                periods.push(parseInt(`${year}${monthStr}`));
            }
        });
        
        return periods;
    }

    /**
     * Formatea un período para mostrar en UI
     * @param {string|number} periodo - Período en formato YYYYMM
     * @returns {Object} Objeto con información formateada del período
     */
    static formatPeriod(periodo) {
        const periodoStr = periodo.toString();
        const anio = parseInt(periodoStr.substring(0, 4));
        const mes = parseInt(periodoStr.substring(4, 6));
        
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        return {
            anio,
            mes,
            nombreMes: meses[mes - 1] || `Mes ${mes}`,
            formato: `${meses[mes - 1] || `Mes ${mes}`} ${anio}`,
            periodoCompleto: periodo
        };
    }

    /**
     * Formatea los datos de tendencia para gráficos
     * @param {Object} data - Datos de respuesta del API
     * @returns {Object} Datos formateados para gráficos
     */
    static formatDataForChart(data) {
        if (!data || !data.data || !data.data.meses) {
            return { labels: [], datasets: [] };
        }

        const meses = data.data.meses;
        
        return {
            labels: meses.map(mes => mes.nombreMes),
            datasets: [
                {
                    label: 'Ventas Reales',
                    data: meses.map(mes => mes.tieneVentasReales ? mes.ventasReales : null),
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#28a745',
                    pointBorderColor: '#28a745',
                    pointRadius: 5,
                    spanGaps: false // No conectar puntos cuando hay valores null
                },
                {
                    label: 'Predicciones',
                    data: meses.map(mes => mes.tienePrediccion ? mes.prediccion : null),
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#007bff',
                    pointBorderColor: '#007bff',
                    pointRadius: 5,
                    borderDash: [5, 5], // Línea punteada para predicciones
                    spanGaps: false
                }
            ]
        };
    }

    /**
     * Calcula estadísticas básicas de los datos
     * @param {Object} data - Datos de respuesta del API
     * @returns {Object} Estadísticas calculadas
     */
    static calculateStatistics(data) {
        if (!data || !data.data || !data.data.meses) {
            return null;
        }

        const meses = data.data.meses;
        const ventasReales = meses.filter(mes => mes.tieneVentasReales);
        const predicciones = meses.filter(mes => mes.tienePrediccion);

        const totalVentasReales = ventasReales.reduce((sum, mes) => sum + mes.ventasReales, 0);
        const totalPredicciones = predicciones.reduce((sum, mes) => sum + mes.prediccion, 0);

        return {
            totalVentasReales,
            totalPredicciones,
            promedioVentasReales: ventasReales.length > 0 ? Math.round(totalVentasReales / ventasReales.length) : 0,
            promedioPredicciones: predicciones.length > 0 ? Math.round(totalPredicciones / predicciones.length) : 0,
            mesesConVentasReales: ventasReales.length,
            mesesConPredicciones: predicciones.length,
            diferenciaTotalEstimada: totalPredicciones - totalVentasReales
        };
    }

    /**
     * Obtiene el período actual en formato YYYYMM
     * @returns {number} Período actual
     */
    static getCurrentPeriod() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        return parseInt(`${year}${month}`);
    }

    /**
     * Obtiene el próximo período (mes siguiente) en formato YYYYMM
     * @returns {number} Próximo período
     */
    static getNextPeriod() {
        const now = new Date();
        // Agregar un mes
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const year = nextMonth.getFullYear();
        const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0');
        return parseInt(`${year}${month}`);
    }

    /**
     * Obtiene períodos disponibles alrededor de la fecha actual
     * @param {number} monthsBefore - Meses hacia atrás desde hoy
     * @param {number} monthsAfter - Meses hacia adelante desde hoy
     * @returns {Array} Array de períodos disponibles
     */
    static getAvailablePeriodsAroundCurrent(monthsBefore = 6, monthsAfter = 6) {
        const periods = [];
        const currentDate = new Date();
        
        // Generar períodos hacia atrás
        for (let i = monthsBefore; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const period = parseInt(`${year}${month}`);
            
            if (this.isValidPeriod(period)) {
                periods.push(period);
            }
        }
        
        // Generar períodos hacia adelante (sin incluir el actual que ya está)
        for (let i = 1; i <= monthsAfter; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const period = parseInt(`${year}${month}`);
            
            if (this.isValidPeriod(period)) {
                periods.push(period);
            }
        }
        
        // Eliminar duplicados y ordenar
        return [...new Set(periods)].sort((a, b) => a - b);
    }
}

export default PredictivoService;
