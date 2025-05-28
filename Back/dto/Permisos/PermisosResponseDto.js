class PermisosResponseDto {
    // DTO para transformar respuesta de roles
    static toRolResponse(dbResult) {
        return {
            id: dbResult?.IDROL || 0,
            nombre: dbResult?.ROLNOM || '',
            eliminado: dbResult?.ELIMINADO || 0
        };
    }

    // DTO para lista de roles
    static toRolesList(dbResult) {
        if (!Array.isArray(dbResult)) {
            return [];
        }
        return dbResult.map(rol => this.toRolResponse(rol));
    }

    // DTO para transformar respuesta de páginas
    static toPaginaResponse(dbResult) {
        return {
            id: dbResult?.IDPAGINA || 0,
            nombre: dbResult?.NOMBRE || '',
            ruta: dbResult?.RUTA || ''
        };
    }

    // DTO para lista de páginas
    static toPaginasList(dbResult) {
        if (!Array.isArray(dbResult)) {
            return [];
        }
        return dbResult.map(pagina => this.toPaginaResponse(pagina));
    }

    // DTO para transformar respuesta de relación rol-página
    static toRolPaginaResponse(dbResult) {
        return {
            idRol: dbResult?.IDROL || 0,
            idPagina: dbResult?.IDPAGINA || 0
        };
    }

    // DTO para lista de relaciones rol-página
    static toRolPaginaList(dbResult) {
        if (!Array.isArray(dbResult)) {
            return [];
        }
        return dbResult.map(relacion => this.toRolPaginaResponse(relacion));
    }

    // DTO para páginas permitidas (con información completa)
    static toPaginaPermitidaResponse(dbResult) {
        return {
            id: dbResult?.IDPAGINA || 0,
            nombre: dbResult?.NOMBRE || '',
            ruta: dbResult?.RUTA || ''
        };
    }

    // DTO para lista de páginas permitidas
    static toPaginasPermitidasList(dbResult) {
        if (!Array.isArray(dbResult)) {
            return [];
        }
        return dbResult.map(pagina => this.toPaginaPermitidaResponse(pagina));
    }

    // DTO para respuesta de verificación de permisos
    static toVerificarPermisoResponse(dbResult) {
        const tienePermiso = dbResult && dbResult.length > 0 && dbResult[0].TIENE_PERMISO > 0;
        return {
            tienePermiso: tienePermiso,
            mensaje: tienePermiso ? 'Acceso permitido' : 'Acceso denegado'
        };
    }

    // DTO para respuestas de éxito genéricas
    static toSuccessResponse(data, message = 'Operación exitosa') {
        return {
            success: true,
            message: message,
            data: data
        };
    }

    // DTO para respuestas de error
    static toErrorResponse(message = 'Error interno del servidor', error = null) {
        const response = {
            success: false,
            message: message
        };
        
        if (error && process.env.NODE_ENV === 'development') {
            response.error = error.message || error;
        }
        
        return response;
    }

    // DTO para respuesta vacía exitosa
    static toEmptySuccessResponse(message = 'No se encontraron datos') {
        return {
            success: true,
            message: message,
            data: []
        };
    }
}

module.exports = PermisosResponseDto; 