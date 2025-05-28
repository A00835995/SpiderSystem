const { connection } = require('../Config/confDB');
const PermisosResponseDto = require('../dto/Permisos/PermisosResponseDto');

// Obtener todos los roles disponibles
const obtenerRoles = async (req, res) => {
  try {
    connection.exec('CALL LISTA_ROLES()', (err, result) => {
      if (err) {
        console.error('Error al obtener roles:', err);
        return res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener roles', err));
      }
      
      if (result && result.length > 0) {
        const rolesFormateados = PermisosResponseDto.toRolesList(result);
        res.json(PermisosResponseDto.toSuccessResponse(rolesFormateados, 'Roles obtenidos correctamente'));
      } else {
        res.json(PermisosResponseDto.toEmptySuccessResponse('No se encontraron roles'));
      }
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener roles', error));
  }
};

// Obtener todas las páginas disponibles
const obtenerPaginas = async (req, res) => {
  try {
    connection.exec('CALL LISTA_PAGINAS()', (err, result) => {
      if (err) {
        console.error('Error al obtener páginas:', err);
        return res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener páginas', err));
      }
      
      if (result && result.length > 0) {
        const paginasFormateadas = PermisosResponseDto.toPaginasList(result);
        res.json(PermisosResponseDto.toSuccessResponse(paginasFormateadas, 'Páginas obtenidas correctamente'));
      } else {
        res.json(PermisosResponseDto.toEmptySuccessResponse('No se encontraron páginas'));
      }
    });
  } catch (error) {
    console.error('Error al obtener páginas:', error);
    res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener páginas', error));
  }
};

// Obtener relación rol-página
const obtenerRolPagina = async (req, res) => {
  try {
    connection.exec('CALL LISTA_ROLPAGINA()', (err, result) => {
      if (err) {
        console.error('Error al obtener rol-página:', err);
        return res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener relaciones rol-página', err));
      }
      
      if (result && result.length > 0) {
        const relacionesFormateadas = PermisosResponseDto.toRolPaginaList(result);
        res.json(PermisosResponseDto.toSuccessResponse(relacionesFormateadas, 'Relaciones rol-página obtenidas correctamente'));
      } else {
        res.json(PermisosResponseDto.toEmptySuccessResponse('No se encontraron relaciones rol-página'));
      }
    });
  } catch (error) {
    console.error('Error al obtener rol-página:', error);
    res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener relaciones rol-página', error));
  }
};

// Obtener páginas permitidas para un rol específico usando el nuevo SP
const obtenerPaginasPermitidas = async (req, res) => {
  const { idRol } = req.params;
  
  try {
    // Validar parámetro
    if (!idRol || isNaN(idRol)) {
      return res.status(400).json(PermisosResponseDto.toErrorResponse('ID de rol inválido'));
    }

    // Usar el nuevo stored procedure PAGINAS_POR_ROL
    connection.exec('CALL PAGINAS_POR_ROL(?)', [parseInt(idRol)], (err, result) => {
      if (err) {
        console.error('Error al obtener páginas permitidas:', err);
        return res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener páginas permitidas', err));
      }
      
      if (result && result.length > 0) {
        const paginasPermitidas = PermisosResponseDto.toPaginasPermitidasList(result);
        res.json(PermisosResponseDto.toSuccessResponse(paginasPermitidas, `Páginas permitidas para el rol ${idRol} obtenidas correctamente`));
      } else {
        res.json(PermisosResponseDto.toEmptySuccessResponse(`No se encontraron páginas permitidas para el rol ${idRol}`));
      }
    });
  } catch (error) {
    console.error('Error al obtener páginas permitidas:', error);
    res.status(500).json(PermisosResponseDto.toErrorResponse('Error al obtener páginas permitidas', error));
  }
};

// Verificar si un usuario tiene permiso para acceder a una página específica usando el nuevo SP
const verificarPermiso = async (req, res) => {
  const { idRol, ruta } = req.params;
  
  try {
    // Validar parámetros
    if (!idRol || isNaN(idRol)) {
      return res.status(400).json(PermisosResponseDto.toErrorResponse('ID de rol inválido'));
    }
    
    if (!ruta) {
      return res.status(400).json(PermisosResponseDto.toErrorResponse('Ruta inválida'));
    }

    // Decodificar la ruta
    const rutaDecodificada = decodeURIComponent(ruta);

    // Usar el nuevo stored procedure VERIFICAR_PERMISO_POR_RUTA
    connection.exec('CALL VERIFICAR_PERMISO_POR_RUTA(?, ?)', [parseInt(idRol), rutaDecodificada], (err, result) => {
      if (err) {
        console.error('Error al verificar permiso:', err);
        return res.status(500).json(PermisosResponseDto.toErrorResponse('Error al verificar permiso', err));
      }
      
      const permisoResponse = PermisosResponseDto.toVerificarPermisoResponse(result);
      res.json(PermisosResponseDto.toSuccessResponse(permisoResponse, 'Verificación de permiso completada'));
    });
  } catch (error) {
    console.error('Error al verificar permiso:', error);
    res.status(500).json(PermisosResponseDto.toErrorResponse('Error al verificar permiso', error));
  }
};

module.exports = {
  obtenerRoles,
  obtenerPaginas,
  obtenerRolPagina,
  obtenerPaginasPermitidas,
  verificarPermiso
}; 