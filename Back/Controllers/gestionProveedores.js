const { executeQuery } = require('../Utils/dbUtils');
const GestionProveedoresResponseDto = require('../dto/GestionProveedores/GestionResponseDto');

exports.getProveedoresResumen = async (req, res) => {
    try {
        const result = await executeQuery('CALL GETPROVEEDORESRESUMEN()');

        if (!result || result.length === 0) {
            const response = GestionProveedoresResponseDto.notFoundResponse(
                "No se encontraron proveedores", 
                "Proveedores"
            );
            return res.status(404).json(response);
        }

        const response = GestionProveedoresResponseDto.proveedoresResumenResponse(result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getProveedoresResumen:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al obtener proveedores",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getDetalleProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL GETDETALLEPROVEEDORPORID(?)', [id]);

        if (!result || result.length === 0) {
            const response = GestionProveedoresResponseDto.notFoundResponse(
                `No se encontró el proveedor con ID ${id}`,
                "Proveedor"
            );
            return res.status(404).json(response);
        }

        const response = GestionProveedoresResponseDto.detalleProveedorResponse(result[0]);
        return res.status(200).json(response);
        
    } catch (error) {
        console.error("Error en getDetalleProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al obtener detalles del proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.createProveedor = async (req, res) => {
    try {
        const { 
            nombre, 
            contacto, 
            email, 
            telefono, 
            direccion, 
            tipo, 
            tipoPago 
        } = req.body;

        // Validaciones básicas
        if (!nombre || !contacto || !email || !telefono || !direccion) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                "Todos los campos obligatorios deben ser proporcionados",
                ["nombre", "contacto", "email", "telefono", "direccion"]
            );
            return res.status(400).json(response);
        }

        // Validar formato de email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                "Formato de email inválido"
            );
            return res.status(400).json(response);
        }

        // Valores por defecto
        const finalTipo = tipo || 'Fabricante';
        const finalTipoPago = tipoPago || 'Crédito Corporativo';

        const result = await executeQuery(
            'CALL CREAR_PROVEEDOR(?, ?, ?, ?, ?, ?, ?)', 
            [nombre, contacto, email, telefono, direccion, finalTipoPago, finalTipo]
        );

        const response = GestionProveedoresResponseDto.createProveedorResponse(result);
        return res.status(201).json(response);

    } catch (error) {
        console.error("Error en createProveedor:", error.message);
        
        // Verificar si es un error de duplicado
        if (error.message.includes('UNIQUE') || error.message.includes('duplicate')) {
            const response = GestionProveedoresResponseDto.conflictResponse(
                "Ya existe un proveedor con este email",
                "email"
            );
            return res.status(409).json(response);
        }

        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al crear el proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.actualizarNombreProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        if (!nombre) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el nuevo nombre del proveedor',
                ['nombre']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery(
            'CALL ACTUALIZAR_NOMBRE_PROVEEDOR(?, ?)', 
            [id, nombre]
        );

        const response = GestionProveedoresResponseDto.updateProveedorResponse("Nombre", result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en actualizarNombreProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al actualizar el nombre del proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.actualizarNombreContactoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreContacto } = req.body;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        if (!nombreContacto) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el nuevo nombre del contacto del proveedor',
                ['nombreContacto']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery(
            'CALL ACTUALIZAR_NOMBRE_CONTACTO_PROVEEDOR(?, ?)', [id, nombreContacto]
        );

        const response = GestionProveedoresResponseDto.updateProveedorResponse("Nombre del contacto", result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en actualizarNombreContactoProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al actualizar el nombre del contacto del proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.actualizarEmailProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        if (!email) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el nuevo email del proveedor',
                ['email']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery(
            'CALL ACTUALIZAR_EMAIL_CONTACTO_PROVEEDOR(?, ?)', [id, email]
        );

        const response = GestionProveedoresResponseDto.updateProveedorResponse("Email", result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en actualizarEmailProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al actualizar el email del proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.actualizarTelefonoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { telefono } = req.body;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        if (!telefono) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el nuevo teléfono del proveedor',
                ['telefono']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery(
            'CALL ACTUALIZAR_TEL_CONTACTO_PROVEEDOR(?, ?)', 
            [id, telefono]
        );

        const response = GestionProveedoresResponseDto.updateProveedorResponse("Teléfono", result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en actualizarTelefonoProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al actualizar el teléfono del proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.actualizarDireccionProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { direccion } = req.body;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        if (!direccion) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere la nueva dirección del proveedor',
                ['direccion']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery(
            'CALL ACTUALIZAR_DIR_PROVEEDOR(?, ?)', 
            [id, direccion]
        );

        const response = GestionProveedoresResponseDto.updateProveedorResponse("Dirección", result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en actualizarDireccionProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al actualizar la dirección del proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.actualizarTipoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoProveedor } = req.body;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        if (!tipoProveedor) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del tipo de proveedor',
                ['tipoProveedor']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery(
            'CALL ACTUALIZAR_TIPO_PROVEEDOR(?, ?)', 
            [id, tipoProveedor]
        );

        const response = GestionProveedoresResponseDto.updateProveedorResponse("Tipo de proveedor", result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en actualizarTipoProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al actualizar el tipo de proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.actualizarTipoPagoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoPago } = req.body;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        if (!tipoPago) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el nuevo tipo de pago del proveedor',
                ['tipoPago']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery(
            'CALL ACTUALIZAR_TIPO_PAGO_PROVEEDOR(?, ?)', [id, tipoPago]
        );

        const response = GestionProveedoresResponseDto.updateProveedorResponse("Tipo de pago", result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en actualizarTipoPagoProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al actualizar el tipo de pago del proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            const response = GestionProveedoresResponseDto.validationErrorResponse(
                'Se requiere el ID del proveedor',
                ['id']
            );
            return res.status(400).json(response);
        }

        // Verificar que el proveedor existe antes de eliminarlo
        const proveedorExiste = await executeQuery('CALL GETDETALLEPROVEEDORPORID(?)', [id]);
        
        if (!proveedorExiste || proveedorExiste.length === 0) {
            const response = GestionProveedoresResponseDto.notFoundResponse(
                `No se encontró el proveedor con ID ${id}`,
                "Proveedor"
            );
            return res.status(404).json(response);
        }

        const result = await executeQuery('CALL ELIMINAR_PROVEEDOR(?)', [id]);

        const response = GestionProveedoresResponseDto.deleteProveedorResponse(result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en eliminarProveedor:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al eliminar el proveedor",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getResumenCategorias = async (req, res) => {
    try {
        const result = await executeQuery('CALL GETRESUMENCATEGORIA()');

        if (!result || result.length === 0) {
            const response = GestionProveedoresResponseDto.notFoundResponse(
                "No se encontraron categorías",
                "Categorías"
            );
            return res.status(404).json(response);
        }

        const response = GestionProveedoresResponseDto.resumenCategoriasResponse(result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getResumenCategorias:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al obtener resumen de categorías",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getDistribucionProveedorInventario = async (req, res) => {
    try {
        const result = await executeQuery('CALL DISTRIBUCION_PROVEEDOR_INVENTARIO()');
        
        if (!result || result.length === 0) {
            const response = GestionProveedoresResponseDto.notFoundResponse(
                "No se encontraron datos de distribución",
                "Distribución de inventario"
            );
            return res.status(404).json(response);
        }

        const response = GestionProveedoresResponseDto.distribucionProveedorInventarioResponse(result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getDistribucionProveedorInventario:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al obtener distribución de inventario",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getTiposProveedores = async (req, res) => {
    try {
        const result = await executeQuery('CALL GET_TIPO_PROVEEDOR()');

        if (!result || result.length === 0) {
            const response = GestionProveedoresResponseDto.notFoundResponse(
                "No se encontraron tipos de proveedores",
                "Tipos de proveedores"
            );
            return res.status(404).json(response);
        }

        const response = GestionProveedoresResponseDto.tiposDeProveedoresResponse(result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getTiposProveedores:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al obtener tipos de proveedores",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getTiposPagosProveedores = async (req, res) => {
    try {
        const result = await executeQuery('CALL GET_TIPO_PAGO_PROVEEDOR()');

        if (!result || result.length === 0) {
            const response = GestionProveedoresResponseDto.notFoundResponse(
                "No se encontraron tipos de pagos",
                "Tipos de pagos"
            );
            return res.status(404).json(response);
        }

        const response = GestionProveedoresResponseDto.tiposDePagosResponse(result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getTiposPagosProveedores:", error.message);
        const response = GestionProveedoresResponseDto.errorResponse(
            "Error en el servidor al obtener tipos de pagos",
            error.message
        );
        res.status(500).json(response);
    }
};