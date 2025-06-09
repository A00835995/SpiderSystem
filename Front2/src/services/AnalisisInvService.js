import axios from 'axios';
import { API_CONFIG } from '../config/api.js';

class AnalisisInvService {
    
    /**
     * Obtiene los años disponibles para análisis
     * @returns {Array} Array de años disponibles
     */
    static getAvailableYears() {
        // Solo 2024 y 2025 son años válidos
        return [2024, 2025];
    }

    /**
     * Obtiene el año actual
     * @returns {number} Año actual
     */
    static getCurrentYear() {
        return new Date().getFullYear();
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
     * Obtiene el siguiente período en formato YYYYMM
     * @returns {number} Siguiente período
     */
    static getNextPeriod() {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 2; // +2 porque getMonth() es 0-based y queremos el siguiente mes
        
        if (month > 12) {
            month = 1;
            year += 1;
        }
        
        const monthStr = month.toString().padStart(2, '0');
        return parseInt(`${year}${monthStr}`);
    }

    /**
     * Formatea un período para mostrar
     * @param {number} periodo - Período en formato YYYYMM
     * @returns {Object} Objeto con información del período formateado
     */
    static formatPeriod(periodo) {
        const periodoStr = periodo.toString();
        const anio = periodoStr.substring(0, 4);
        const mes = periodoStr.substring(4, 6);
        
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const monthName = monthNames[parseInt(mes) - 1] || `Mes ${mes}`;
        
        return {
            anio: parseInt(anio),
            mes: parseInt(mes),
            nombreMes: monthName,
            formato: `${monthName} ${anio}`
        };
    }

    /**
     * Obtiene el análisis de inventario para un período específico
     * @param {string|number} periodo - Período en formato YYYYMM (ej: 202507)
     * @returns {Promise} Respuesta con datos de análisis de inventario
     */
    static async getAnalisisInventario(anio) {
        try {
            console.log(`🔍 Obteniendo análisis de inventario para el año: ${anio}`);
            const url = `${API_CONFIG.baseUrl}/analisis-inventario/analisis/${anio}`;
            console.log('🌐 URL completa:', url);
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('📊 Análisis de inventario obtenido:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error obteniendo análisis de inventario:', error);
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        throw new Error(data.message || 'Parámetros inválidos para obtener análisis de inventario');
                    case 401:
                        throw new Error('No autorizado. Por favor, inicia sesión nuevamente');
                    case 404:
                        throw new Error(data.message || `No se encontraron datos de análisis de inventario para el año ${anio}`);
                    case 500:
                        throw new Error(data.message || 'Error interno del servidor al obtener análisis de inventario');
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
     * Valida si un período es válido para consultas de análisis de inventario
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
     * Obtiene los períodos disponibles para análisis de inventario
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

    /**
     * Clasifica productos por estado de stock
     * @param {Array} productos - Array de productos del análisis
     * @returns {Object} Productos clasificados por estado
     */
    static clasificarProductosPorEstado(productos) {
        if (!productos || !Array.isArray(productos)) {
            return {};
        }

        return {
            equilibrado: productos.filter(p => p.estadoStock === 'EQUILIBRADO'),
            excesoLeve: productos.filter(p => p.estadoStock === 'EXCESO_LEVE'),
            excesoModerado: productos.filter(p => p.estadoStock === 'EXCESO_MODERADO'),
            excesoAlto: productos.filter(p => p.estadoStock === 'EXCESO_ALTO'),
            deficitLeve: productos.filter(p => p.estadoStock === 'DEFICIT_LEVE'),
            deficitModerado: productos.filter(p => p.estadoStock === 'DEFICIT_MODERADO'),
            deficitAlto: productos.filter(p => p.estadoStock === 'DEFICIT_ALTO'),
            deficitCritico: productos.filter(p => p.estadoStock === 'DEFICIT_CRITICO')
        };
    }

    /**
     * Obtiene productos que requieren acción inmediata
     * @param {Array} productos - Array de productos del análisis
     * @returns {Array} Productos que requieren acción urgente
     */
    static getProductosAccionUrgente(productos) {
        if (!productos || !Array.isArray(productos)) {
            return [];
        }

        return productos.filter(p => 
            p.estadoStock === 'DEFICIT_CRITICO' || 
            p.estadoStock === 'DEFICIT_ALTO' ||
            p.tipoSituacion === 'SIN_STOCK_CON_DEMANDA'
        ).sort((a, b) => a.porcentajeCobertura - b.porcentajeCobertura);
    }

    /**
     * Obtiene productos con exceso que pueden promocionarse
     * @param {Array} productos - Array de productos del análisis
     * @returns {Array} Productos con exceso de stock
     */
    static getProductosParaPromocion(productos) {
        if (!productos || !Array.isArray(productos)) {
            return [];
        }

        return productos.filter(p => 
            p.estadoStock === 'EXCESO_ALTO' || 
            p.estadoStock === 'EXCESO_MODERADO'
        ).sort((a, b) => b.porcentajeCobertura - a.porcentajeCobertura);
    }
}

export default AnalisisInvService;
