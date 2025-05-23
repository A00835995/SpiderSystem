import { useState, useEffect } from 'react';
import { fetchAlertas } from '../services/AlertasService';

export function useAlertas() {
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAlertas();
                setAlertas(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { alertas, loading, error };
}
