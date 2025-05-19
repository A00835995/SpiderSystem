import { useState, useEffect } from 'react';
import { fetchInicioData, fetchVentasMes, fetchProductosInventario, fetchVentasMesAnterior, fetchOrdenesRecientes, fetchVentasXCategoria } from '../services/InicioService';

export function useInicio() {
    const [inicioData, setInicioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordenesPendientes, ventasMes, productosInventario, ventasMesAnterior, ordenesRecientes, ventasXCategoria] = await Promise.all([
                    fetchInicioData(),
                    fetchVentasMes(),
                    fetchProductosInventario(),
                    fetchVentasMesAnterior(),
                    fetchOrdenesRecientes(),
                    fetchVentasXCategoria()
                ]);

                setInicioData({
                    ordenesPendientes,
                    ventasMes,
                    productosInventario,
                    ventasMesAnterior,
                    ordenesRecientes,
                    ventasXCategoria
                });

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { inicioData, loading, error };
}       