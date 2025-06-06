const { executeQuery } = require('./dbUtils');
const { broadcastUpdate } = require('./websocket');

let lastInventoryState = null;

// Función para obtener el estado actual del inventario
const getInventoryState = async () => {
    try {
        const [articulos, estados] = await Promise.all([
            executeQuery('CALL ArticulosDTO()'),
            executeQuery('CALL CONTARESTADOS()')
        ]);

        return {
            articulos,
            estados
        };
    } catch (error) {
        console.error('Error al obtener estado del inventario:', error);
        return null;
    }
};

// Función para verificar cambios en el inventario
const checkInventoryChanges = async () => {
    try {
        const currentState = await getInventoryState();
        
        if (!currentState) return;

        // Si es la primera vez, solo guardamos el estado
        if (!lastInventoryState) {
            lastInventoryState = currentState;
            return;
        }

        // Comparar si hay cambios
        const hasChanges = JSON.stringify(currentState.articulos) !== JSON.stringify(lastInventoryState.articulos);

        if (hasChanges) {
            console.log('Cambios detectados en el inventario - Enviando actualización');
            
            // Enviar actualización a todos los clientes
            broadcastUpdate({
                type: 'INVENTORY_UPDATE',
                data: currentState.articulos,
                stats: currentState.estados
            });

            // Actualizar el último estado conocido
            lastInventoryState = currentState;
        }
    } catch (error) {
        console.error('Error al verificar cambios en el inventario:', error);
    }
};

// Iniciar el watcher
const startInventoryWatcher = (interval = 2000) => { // 2 segundos
    console.log('Iniciando monitor de inventario...');
    
    // Primera verificación inmediata
    checkInventoryChanges();
    
    // Configurar verificación periódica
    const watcherId = setInterval(checkInventoryChanges, interval);
    
    return watcherId;
};

module.exports = {
    startInventoryWatcher
}; 