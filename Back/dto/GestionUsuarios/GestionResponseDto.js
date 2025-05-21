class GestionResponseDto {
    static toUsuariosResponse(dbResult) {
        return {
            id: dbResult?.IDUSR || 0,
            rol: dbResult?.ROLNOM || '',
            nombre: dbResult?.NAMEUSR || '',
            email: dbResult?.EMAILUSR || ''
        };
    }

    static toUsuariosList(dbResult) {
        if (!Array.isArray(dbResult)) {
            return [];
        }
        return dbResult.map(user => this.toUsuariosResponse(user));
    }

    static toUsuarioResponse(dbResult) {
        if (!dbResult || dbResult.length === 0) {
            return null;
        }
        return {
            id: dbResult[0]?.IDUSR || 0,
            rol: dbResult[0]?.ROLNOM || '',
            nombre: dbResult[0]?.NAMEUSR || '',
            email: dbResult[0]?.EMAILUSR || ''
        };
    }

    static toUsuarioList(dbResult) {
        if (!Array.isArray(dbResult)) {
            return [];
        }
        return dbResult.map(user => this.toUsuarioResponse(user));
    }

    static toUsuarioCreateResponse(dbResult) {
        if (!dbResult || dbResult.length === 0) {
            return { success: false, message: 'No se pudo crear el usuario' };
        }
        return {
            success: true,
            id: dbResult[0]?.IDUSR || 0,
            message: 'Usuario creado correctamente'
        };
    }

    static toUsuarioUpdateNombreResponse(dbResult) {
        if (!dbResult || dbResult.length === 0) {
            return { success: false, message: 'No se pudo actualizar el nombre del usuario' };
        }
        return {
            success: true,
            id: dbResult[0]?.IDUSR || 0,
            message: 'Nombre de usuario actualizado correctamente'
        };
    }

    static toUsuarioUpdateEmailResponse(dbResult) {
        if (!dbResult || dbResult.length === 0) {
            return { success: false, message: 'No se pudo actualizar el email del usuario' };
        }
        return {
            success: true,
            id: dbResult[0]?.IDUSR || 0,
            message: 'Email de usuario actualizado correctamente'
        };
    }

    static toUsuarioUpdateRolResponse(dbResult) {
        if (!dbResult || dbResult.length === 0) {
            return { success: false, message: 'No se pudo actualizar el rol del usuario' };
        }
        return {
            success: true,
            id: dbResult[0]?.IDUSR || 0,
            message: 'Rol de usuario actualizado correctamente'
        };
    }

    static toUsuarioDeleteResponse(dbResult) {
        if (!dbResult || dbResult.length === 0) {
            return { success: false, message: 'No se pudo eliminar el usuario' };
        }
        return {
            success: true,
            id: dbResult[0]?.IDUSR || 0,
            message: 'Usuario eliminado correctamente'
        };
    }
}

module.exports = GestionResponseDto;
