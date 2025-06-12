import { useState, useCallback, useEffect } from 'react';
import AnalisisInvService from '../services/AnalisisInvService';

/**
 * Hook personalizado para manejar datos de análisis de inventario
 * @param {number} initialYear - Año inicial para cargar datos
 * @returns {Object} Estado y funciones para manejar datos de análisis de inventario
 */
export const useAnalisisInv = (initialYear = AnalisisInvService.getCurrentYear()) => {
    // Estados principales
    const [analisisData, setAnalisisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // selectedYear: para GET_ANALISIS_INVENTARIO
    const [selectedYear, setSelectedYear] = useState(initialYear);
    
    // Estados derivados
    const [productosClasificados, setProductosClasificados] = useState({});
    const [productosAccionUrgente, setProductosAccionUrgente] = useState([]);
    const [productosParaPromocion, setProductosParaPromocion] = useState([]);
    
    // availableYears: para validaciones (formato YYYY: [2024, 2025])
    const [availableYears] = useState(AnalisisInvService.getAvailableYears());
    
    // availablePeriods: para análisis de inventario (formato YYYYMM: [202406, 202407, ...])
    const [availablePeriods] = useState(AnalisisInvService.getAvailablePeriodsAroundCurrent());

    /**
     * Carga el análisis de inventario para un año específico
     * Usa GET_ANALISIS_INVENTARIO con formato YYYY
     */
    const loadAnalisisInventario = useCallback(async (anio = selectedYear) => {
        try {
            setLoading(true);
            setError(null);
            
            if (!anio) {
                throw new Error('Se requiere un año para cargar el análisis de inventario');
            }
            
            console.log(`Cargando análisis de inventario para el año ${anio}...`);
            
            // Validar año
            if (!AnalisisInvService.isValidYear(anio)) {
                throw new Error(`El año ${anio} no es válido.`);
            }

            const data = await AnalisisInvService.getAnalisisInventario(anio);
            
            setAnalisisData(data);
            
            // Procesar datos para análisis adicionales
            if (data && data.data && data.data.productos) {
                const productos = data.data.productos;
                
                // Clasificar productos por estado
                const clasificados = AnalisisInvService.clasificarProductosPorEstado(productos);
                setProductosClasificados(clasificados);
                
                // Obtener productos que requieren acción urgente
                const urgentes = AnalisisInvService.getProductosAccionUrgente(productos);
                setProductosAccionUrgente(urgentes);
                
                // Obtener productos para promoción
                const promocion = AnalisisInvService.getProductosParaPromocion(productos);
                setProductosParaPromocion(promocion);
                
                console.log('Análisis procesado:', {
                    totalProductos: productos.length,
                    productosUrgentes: urgentes.length,
                    productosPromocion: promocion.length,
                    clasificacion: Object.entries(clasificados).map(([key, value]) => `${key}: ${value.length}`)
                });
            }
            
            console.log('Análisis de inventario cargado exitosamente');
            
        } catch (err) {
            console.error('Error cargando análisis de inventario:', err);
            setError(err.message);
            setAnalisisData(null);
            setProductosClasificados({});
            setProductosAccionUrgente([]);
            setProductosParaPromocion([]);
        } finally {
            setLoading(false);
        }
    }, [selectedYear]);

    /**
     * Cambia el año seleccionado y recarga los datos de análisis
     * Formato YYYY para GET_ANALISIS_INVENTARIO
     */
    const changeYear = useCallback(async (newYear) => {
        if (newYear !== selectedYear) {
            setSelectedYear(newYear);
            await loadAnalisisInventario(newYear);
        }
    }, [selectedYear, loadAnalisisInventario]);

    /**
     * Recarga los datos del año actual
     */
    const refresh = useCallback(() => {
        if (selectedYear) {
            return loadAnalisisInventario(selectedYear);
        }
    }, [loadAnalisisInventario, selectedYear]);

    /**
     * Limpia todos los datos y errores
     */
    const clearData = useCallback(() => {
        setAnalisisData(null);
        setProductosClasificados({});
        setProductosAccionUrgente([]);
        setProductosParaPromocion([]);
        setError(null);
    }, []);

    /**
     * Obtiene productos por estado específico
     */
    const getProductosByEstado = useCallback((estado) => {
        if (!analisisData || !analisisData.data || !analisisData.data.productos) {
            return [];
        }
        
        return analisisData.data.productos.filter(producto => 
            producto.estadoStock.toUpperCase() === estado.toUpperCase()
        );
    }, [analisisData]);

    /**
     * Obtiene productos por tipo de situación
     */
    const getProductosByTipoSituacion = useCallback((tipo) => {
        if (!analisisData || !analisisData.data || !analisisData.data.productos) {
            return [];
        }
        
        return analisisData.data.productos.filter(producto => 
            producto.tipoSituacion.toUpperCase() === tipo.toUpperCase()
        );
    }, [analisisData]);

    /**
     * Obtiene el producto con mayor exceso
     */
    const getProductoMayorExceso = useCallback(() => {
        if (!analisisData || !analisisData.data || !analisisData.data.productos) {
            return null;
        }
        
        const productosExceso = analisisData.data.productos.filter(producto => producto.diferencia > 0);
        
        if (productosExceso.length === 0) return null;
        
        return productosExceso.reduce((mayor, current) => 
            current.diferencia > mayor.diferencia ? current : mayor
        );
    }, [analisisData]);

    /**
     * Obtiene el producto con mayor déficit
     */
    const getProductoMayorDeficit = useCallback(() => {
        if (!analisisData || !analisisData.data || !analisisData.data.productos) {
            return null;
        }
        
        const productosDeficit = analisisData.data.productos.filter(producto => producto.diferencia < 0);
        
        if (productosDeficit.length === 0) return null;
        
        return productosDeficit.reduce((mayor, current) => 
            Math.abs(current.diferencia) > Math.abs(mayor.diferencia) ? current : mayor
        );
    }, [analisisData]);

    /**
     * Obtiene estadísticas del análisis
     */
    const getEstadisticas = useCallback(() => {
        if (!analisisData || !analisisData.data) {
            return null;
        }
        
        return analisisData.data.resumen;
    }, [analisisData]);

    /**
     * Obtiene KPIs calculados
     */
    const getKPIs = useCallback(() => {
        if (!analisisData || !analisisData.data || !analisisData.data.productos) {
            return {
                eficienciaInventario: 0,
                porcentajeProductosOptimos: 0,
                porcentajeProductosUrgentes: 0,
                valorExcedente: 0,
                valorDeficit: 0
            };
        }
        
        const productos = analisisData.data.productos;
        const total = productos.length;
        
        if (total === 0) {
            return {
                eficienciaInventario: 0,
                porcentajeProductosOptimos: 0,
                porcentajeProductosUrgentes: 0,
                valorExcedente: 0,
                valorDeficit: 0
            };
        }
        
        const productosOptimos = productos.filter(p => 
            p.estadoStock === 'EQUILIBRADO' || p.tipoSituacion === 'STOCK_OPTIMO'
        ).length;
        
        const productosUrgentes = productosAccionUrgente.length;
        
        return {
            eficienciaInventario: Math.round((productosOptimos / total) * 100),
            porcentajeProductosOptimos: Math.round((productosOptimos / total) * 100),
            porcentajeProductosUrgentes: Math.round((productosUrgentes / total) * 100),
            valorExcedente: productos.reduce((sum, p) => sum + (p.diferencia > 0 ? p.diferencia : 0), 0),
            valorDeficit: productos.reduce((sum, p) => sum + (p.diferencia < 0 ? Math.abs(p.diferencia) : 0), 0)
        };
    }, [analisisData, productosAccionUrgente]);

    /**
     * Verifica si hay datos disponibles
     */
    const hasData = analisisData && analisisData.data && analisisData.data.productos && analisisData.data.productos.length > 0;

    // Cargar datos iniciales
    useEffect(() => {
        if (AnalisisInvService.isValidYear(selectedYear)) {
            loadAnalisisInventario(selectedYear);
        }
    }, []);

    return {
        // Datos principales
        analisisData,
        productosClasificados,
        productosAccionUrgente,
        productosParaPromocion,
        
        // Estados
        loading,
        error,
        selectedYear,
        availableYears,
        availablePeriods,
        
        // Funciones de control
        loadAnalisisInventario,
        changeYear,
        refresh,
        clearData,
        
        // Funciones de consulta
        getProductosByEstado,
        getProductosByTipoSituacion,
        getProductoMayorExceso,
        getProductoMayorDeficit,
        getEstadisticas,
        getKPIs,
        
        // Estados derivados
        hasData,
        
        // Utilidades
        isValidYear: AnalisisInvService.isValidYear,
        isValidPeriod: AnalisisInvService.isValidPeriod,
        formatPeriod: AnalisisInvService.formatPeriod,
        getCurrentPeriod: AnalisisInvService.getCurrentPeriod,
        getNextPeriod: AnalisisInvService.getNextPeriod
    };
};

export default useAnalisisInv;
