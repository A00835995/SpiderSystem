class AlertasResponseDto {
    static toAlertasResponse(alert) {
        return {
            id: alert.ARTICULOID,
            nombre: alert.NOMBRE_ARTICULO,
            estado: alert.ESTADO,
            mensaje: alert.MENSAJE,
            fecha_creacion: alert.CREADA,
            fecha_resolucion: alert.RESUELTA,
            resuelto: alert.SERESOLVIO,
            existencia: alert.EXISTENCIA_ALERTA
        };
    }
    static toAlertasList(dbResult) {
        if (!Array.isArray(dbResult)) {
            return [];
        }
        return dbResult.map(alert => this.toAlertasResponse(alert));
    }
}

module.exports = AlertasResponseDto;    