import { useState, useEffect } from 'react';
import { fetchInventoryData, fetchTotalInventoryCount } from '../services/inventoryService';

export function useInventory() {
    const [inventoryData, setInventoryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inventoryStats, setInventoryStats] = useState({
        disponibles: 0,
        bajoStock: 0,
        agotados: 0,
        total: 0
    });
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    const loadInventory = async () => {
        //Se está cargando la data
        setIsLoading(true);
        setError(null);
        try{
            //Promise all sirve para ejecutar varias promesas en paralelo
            const [data, stats] = await Promise.all([
                fetchInventoryData(), //Consigo los datos del inventario
                fetchTotalInventoryCount()
            ]);

            setInventoryData(data);
            setFilteredData(data);
            setInventoryStats(stats);
            setLastUpdateTime(new Date());
        } catch (error){
            setError(error.message);
            console.error('Error al cargar el inventario:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadInventory();
      }, []);
    
      // Refresh function
      const refreshInventory = () => {
        return loadInventory();
      };
    
      return {
        inventoryData,
        setInventoryData,
        filteredData,
        setFilteredData,
        isLoading,
        error,
        inventoryStats,
        lastUpdateTime,
        refreshInventory
      };
}
