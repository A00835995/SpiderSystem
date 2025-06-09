import { useState, useEffect, useCallback } from 'react';
import PredictivoService from '../services/PredictivoService';

/**
 * Obtiene el período actual en formato YYYYMM
 * @returns {number} Período actual
 */
const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return parseInt(`${year}${month}`);
};

/**
 * Hook personalizado para manejar datos predictivos
 * @param {number} initialYear - Año inicial para cargar datos de tendencia (formato YYYY)
 * @returns {Object} Estado y funciones para manejar datos predictivos
 */
export const usePredictivo = (initialYear = new Date().getFullYear()) => {
    // Estados principales
    const [tendenciaData, setTendenciaData] = useState(null);
    const [riesgoStockData, setRiesgoStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingRiesgoStock, setLoadingRiesgoStock] = useState(false);
    const [error, setError] = useState(null);
    const [errorRiesgoStock, setErrorRiesgoStock] = useState(null);
    
    // selectedYear: formato YYYY para GET_TENDENCIA_VENTAS_ANUAL
    const [selectedYear, setSelectedYear] = useState(initialYear);
    
    // selectedPeriod: formato YYYYMM para GET_RIESGO_STOCK_FUTURO
    // Usa el próximo mes por defecto para análisis de riesgo futuro
    const [selectedPeriod, setSelectedPeriod] = useState(PredictivoService.getNextPeriod());

    // Estados derivados
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [statistics, setStatistics] = useState(null);
    
    // availableYears: para tendencias (formato YYYY: [2024, 2025])
    const [availableYears] = useState(PredictivoService.getAvailableYears());
    
    // availablePeriods: para riesgo de stock (formato YYYYMM: [202406, 202407, ...])
    const [availablePeriods] = useState(PredictivoService.getAvailablePeriodsAroundCurrent());

    /**
     * Carga la tendencia de ventas para un año específico
     * Usa GET_TENDENCIA_VENTAS_ANUAL con formato YYYY
     */
    const loadTendenciaVentas = useCallback(async (anio = selectedYear) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log(`🔄 Cargando tendencia de ventas para ${anio}...`);
            
            // Validar año (formato YYYY)
            if (!PredictivoService.isValidYear(anio)) {
                throw new Error(`El año ${anio} no está en el rango válido (2024-2025)`);
            }

            const data = await PredictivoService.getTendenciaVentasAnual(anio);
            
            setTendenciaData(data);
            
            // Formatear datos para gráficos
            const formattedChartData = PredictivoService.formatDataForChart(data);
            setChartData(formattedChartData);
            
            // Calcular estadísticas
            const stats = PredictivoService.calculateStatistics(data);
            setStatistics(stats);
            
            console.log('✅ Tendencia de ventas cargada exitosamente');
            
        } catch (err) {
            console.error('❌ Error cargando tendencia de ventas:', err);
            setError(err.message);
            setTendenciaData(null);
            setChartData({ labels: [], datasets: [] });
            setStatistics(null);
        } finally {
            setLoading(false);
        }
    }, [selectedYear]);

    /**
     * Carga el análisis de riesgo de stock para un período específico
     * Usa GET_RIESGO_STOCK_FUTURO con formato YYYYMM
     */
    const loadRiesgoStock = useCallback(async (periodo = selectedPeriod) => {
        try {
            setLoadingRiesgoStock(true);
            setErrorRiesgoStock(null);
            
            if (!periodo) {
                throw new Error('Se requiere un período para cargar el análisis de riesgo de stock');
            }
            
            console.log(`🔄 Cargando riesgo de stock para el período ${periodo}...`);
            
            // Validar período (formato YYYYMM)
            if (!PredictivoService.isValidPeriod(periodo)) {
                throw new Error(`El período ${periodo} no es válido. Debe estar en formato YYYYMM`);
            }

            const data = await PredictivoService.getRiesgoStockFuturo(periodo);
            
            setRiesgoStockData(data);
            
            console.log('✅ Riesgo de stock cargado exitosamente');
            
        } catch (err) {
            console.error('❌ Error cargando riesgo de stock:', err);
            setErrorRiesgoStock(err.message);
            setRiesgoStockData(null);
        } finally {
            setLoadingRiesgoStock(false);
        }
    }, [selectedPeriod]);

    /**
     * Cambia el año seleccionado y recarga los datos de tendencia
     * Formato YYYY para GET_TENDENCIA_VENTAS_ANUAL
     */
    const changeYear = useCallback(async (newYear) => {
        if (newYear !== selectedYear) {
            setSelectedYear(newYear);
            await loadTendenciaVentas(newYear);
        }
    }, [selectedYear, loadTendenciaVentas]);

    /**
     * Cambia el período seleccionado y recarga los datos de riesgo de stock
     * Formato YYYYMM para GET_RIESGO_STOCK_FUTURO
     */
    const changePeriod = useCallback(async (newPeriod) => {
        if (newPeriod !== selectedPeriod) {
            setSelectedPeriod(newPeriod);
            await loadRiesgoStock(newPeriod);
        }
    }, [selectedPeriod, loadRiesgoStock]);

    /**
     * Recarga los datos del año actual
     */
    const refresh = useCallback(() => {
        return loadTendenciaVentas(selectedYear);
    }, [loadTendenciaVentas, selectedYear]);

    /**
     * Recarga los datos de riesgo de stock del período actual
     */
    const refreshRiesgoStock = useCallback(() => {
        if (selectedPeriod) {
            return loadRiesgoStock(selectedPeriod);
        }
    }, [loadRiesgoStock, selectedPeriod]);

    /**
     * Limpia todos los datos y errores
     */
    const clearData = useCallback(() => {
        setTendenciaData(null);
        setRiesgoStockData(null);
        setChartData({ labels: [], datasets: [] });
        setStatistics(null);
        setError(null);
        setErrorRiesgoStock(null);
    }, []);

    /**
     * Obtiene datos de un mes específico
     */
    const getMonthData = useCallback((monthNumber) => {
        if (!tendenciaData || !tendenciaData.data || !tendenciaData.data.meses) {
            return null;
        }
        
        return tendenciaData.data.meses.find(mes => mes.mes === monthNumber);
    }, [tendenciaData]);

    /**
     * Obtiene el mes con mayores ventas reales
     */
    const getBestSalesMonth = useCallback(() => {
        if (!tendenciaData || !tendenciaData.data || !tendenciaData.data.meses) {
            return null;
        }
        
        const mesesConVentas = tendenciaData.data.meses.filter(mes => mes.tieneVentasReales);
        
        if (mesesConVentas.length === 0) return null;
        
        return mesesConVentas.reduce((best, current) => 
            current.ventasReales > best.ventasReales ? current : best
        );
    }, [tendenciaData]);

    /**
     * Obtiene el mes con mayor predicción
     */
    const getBestPredictionMonth = useCallback(() => {
        if (!tendenciaData || !tendenciaData.data || !tendenciaData.data.meses) {
            return null;
        }
        
        const mesesConPredicciones = tendenciaData.data.meses.filter(mes => mes.tienePrediccion);
        
        if (mesesConPredicciones.length === 0) return null;
        
        return mesesConPredicciones.reduce((best, current) => 
            current.prediccion > best.prediccion ? current : best
        );
    }, [tendenciaData]);

    /**
     * Verifica si hay datos disponibles
     */
    const hasData = tendenciaData && tendenciaData.data && tendenciaData.data.meses && tendenciaData.data.meses.length > 0;

    /**
     * Verifica si hay datos de ventas reales
     */
    const hasRealSalesData = hasData && tendenciaData.data.meses.some(mes => mes.tieneVentasReales);

    /**
     * Verifica si hay datos de predicciones
     */
    const hasPredictionData = hasData && tendenciaData.data.meses.some(mes => mes.tienePrediccion);

    /**
     * Obtiene productos por nivel de riesgo
     */
    const getProductsByRisk = useCallback((riskLevel) => {
        if (!riesgoStockData || !riesgoStockData.data || !riesgoStockData.data.productos) {
            return [];
        }
        
        return riesgoStockData.data.productos.filter(producto => 
            producto.riesgo.toUpperCase() === riskLevel.toUpperCase()
        );
    }, [riesgoStockData]);

    /**
     * Obtiene productos que necesitan reorden
     */
    const getProductsNeedingReorder = useCallback(() => {
        if (!riesgoStockData || !riesgoStockData.data || !riesgoStockData.data.productos) {
            return [];
        }
        
        return riesgoStockData.data.productos.filter(producto => producto.necesitaReorden);
    }, [riesgoStockData]);

    /**
     * Obtiene el producto con mayor déficit
     */
    const getHighestDeficitProduct = useCallback(() => {
        if (!riesgoStockData || !riesgoStockData.data || !riesgoStockData.data.productos) {
            return null;
        }
        
        const productosConDeficit = riesgoStockData.data.productos.filter(producto => producto.deficitEstimado > 0);
        
        if (productosConDeficit.length === 0) return null;
        
        return productosConDeficit.reduce((highest, current) => 
            current.deficitEstimado > highest.deficitEstimado ? current : highest
        );
    }, [riesgoStockData]);

    /**
     * Obtiene estadísticas del riesgo de stock
     */
    const getRiskStatistics = useCallback(() => {
        if (!riesgoStockData || !riesgoStockData.data) {
            return null;
        }
        
        return riesgoStockData.data.resumen;
    }, [riesgoStockData]);

    // Cargar datos iniciales
    useEffect(() => {
        if (PredictivoService.isValidYear(selectedYear)) {
            loadTendenciaVentas(selectedYear);
        }
    }, []); // Solo ejecutar una vez al montar el componente

    return {
        // Datos principales
        tendenciaData,
        riesgoStockData,
        chartData,
        statistics,
        
        // Estados
        loading,
        loadingRiesgoStock,
        error,
        errorRiesgoStock,
        selectedYear,
        selectedPeriod,
        availableYears,
        availablePeriods,
        
        // Funciones de control
        loadTendenciaVentas,
        loadRiesgoStock,
        changeYear,
        changePeriod,
        refresh,
        refreshRiesgoStock,
        clearData,
        
        // Funciones de consulta
        getMonthData,
        getBestSalesMonth,
        getBestPredictionMonth,
        getProductsByRisk,
        getProductsNeedingReorder,
        getHighestDeficitProduct,
        getRiskStatistics,
        
        // Estados derivados
        hasData,
        hasRealSalesData,
        hasPredictionData,
        hasRiskData: riesgoStockData && riesgoStockData.data && riesgoStockData.data.productos && riesgoStockData.data.productos.length > 0,
        
        // Utilidades
        isValidYear: PredictivoService.isValidYear,
        isValidPeriod: PredictivoService.isValidPeriod,
        formatPeriod: PredictivoService.formatPeriod,
        getCurrentPeriod: PredictivoService.getCurrentPeriod,
        getNextPeriod: PredictivoService.getNextPeriod
    };
};

/**
 * Hook simplificado para obtener solo la tendencia de ventas de un año específico
 * @param {number} year - Año para obtener datos
 * @returns {Object} Estado simplificado con datos de tendencia
 */
export const useTendenciaVentas = (year) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            if (!year || !PredictivoService.isValidYear(year)) {
                setError(`Año inválido: ${year}`);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const result = await PredictivoService.getTendenciaVentasAnual(year);
                setData(result);
                
            } catch (err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [year]);

    return { data, loading, error };
};

export default usePredictivo;
