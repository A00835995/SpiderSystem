import { renderHook, act } from '@testing-library/react';
import { useAdminLogic } from '../useAdminLogic';
import { useAdmin } from '../../../hooks/useAdmin';

// Mock del hook useAdmin
jest.mock('../../../hooks/useAdmin', () => ({
  useAdmin: jest.fn()
}));

describe('useAdminLogic', () => {
  const mockUsuarios = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      rol: 'ADMIN',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria@example.com',
      rol: 'ANALISTA',
      estado: 'Activo'
    }
  ];

  const mockUseAdmin = {
    usuarios: mockUsuarios,
    loading: false,
    error: null,
    getUsuario: jest.fn(),
    crearUsuario: jest.fn(),
    actualizarRolUsuario: jest.fn(),
    actualizarNombreUsuario: jest.fn(),
    actualizarEmailUsuario: jest.fn(),
    eliminarUsuario: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAdmin.mockReturnValue(mockUseAdmin);
  });

  it('debería inicializar con el estado correcto', () => {
    const { result } = renderHook(() => useAdminLogic());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.usuarios).toEqual(mockUsuarios);
    expect(result.current.showDialog).toBe(false);
    expect(result.current.selectedUsuario).toBe(null);
    expect(result.current.showToast).toBe(false);
    expect(result.current.toastMessage).toBe('');
    expect(result.current.showConfirmDialog).toBe(false);
    expect(result.current.userIdToDelete).toBe(null);
    expect(result.current.formData).toEqual({
      nombre: '',
      email: '',
      password: '',
      rol: '',
      estado: 'Activo'
    });
  });

  it('debería manejar la adición de un nuevo usuario', () => {
    const { result } = renderHook(() => useAdminLogic());

    act(() => {
      result.current.handleAddUsuario();
    });

    expect(result.current.showDialog).toBe(true);
    expect(result.current.selectedUsuario).toBe(null);
    expect(result.current.formData).toEqual({
      nombre: '',
      email: '',
      password: '',
      rol: 'ANALISTA',
      estado: 'Activo'
    });
  });

  it('debería manejar la edición de un usuario existente', () => {
    const { result } = renderHook(() => useAdminLogic());
    const usuarioToEdit = mockUsuarios[0];

    act(() => {
      result.current.handleEditUsuario(usuarioToEdit);
    });

    expect(result.current.showDialog).toBe(true);
    expect(result.current.selectedUsuario).toEqual(usuarioToEdit);
    expect(result.current.formData).toEqual({
      ...usuarioToEdit,
      password: ''
    });
  });

  it('debería manejar la eliminación de un usuario', async () => {
    const { result } = renderHook(() => useAdminLogic());
    const userId = 1;

    act(() => {
      result.current.handleDeleteUsuario(userId);
    });

    expect(result.current.showConfirmDialog).toBe(true);
    expect(result.current.userIdToDelete).toBe(userId);

    // Simular confirmación de eliminación
    await act(async () => {
      await result.current.handleConfirmDelete();
    });

    expect(mockUseAdmin.eliminarUsuario).toHaveBeenCalledWith(userId);
    expect(result.current.showConfirmDialog).toBe(false);
    expect(result.current.userIdToDelete).toBe(null);
  });

  it('debería validar el formulario correctamente', () => {
    const { result } = renderHook(() => useAdminLogic());

    // Caso 1: Formulario válido
    act(() => {
      result.current.setFormData({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        rol: 'ADMIN',
        estado: 'Activo'
      });
    });

    expect(result.current.validateForm()).toBe(true);

    // Caso 2: Email inválido
    act(() => {
      result.current.setFormData({
        ...result.current.formData,
        email: 'invalid-email'
      });
    });

    expect(result.current.validateForm()).toBe(false);

    // Caso 3: Nombre vacío
    act(() => {
      result.current.setFormData({
        ...result.current.formData,
        nombre: ''
      });
    });

    expect(result.current.validateForm()).toBe(false);
  });

  it('debería guardar un nuevo usuario correctamente', async () => {
    const { result } = renderHook(() => useAdminLogic());
    const newUser = {
      nombre: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      password: 'password123',
      rol: 'ANALISTA',
      estado: 'Activo'
    };

    act(() => {
      result.current.setFormData(newUser);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUseAdmin.crearUsuario).toHaveBeenCalledWith({
      nombre: newUser.nombre,
      email: newUser.email,
      password: newUser.password,
      rol: newUser.rol
    });
    expect(result.current.showDialog).toBe(false);
  });

  it('debería actualizar un usuario existente correctamente', async () => {
    const { result } = renderHook(() => useAdminLogic());
    const usuarioToEdit = mockUsuarios[0];
    const updatedData = {
      ...usuarioToEdit,
      nombre: 'Nombre Actualizado',
      email: 'actualizado@example.com',
      rol: 'ANALISTA'
    };

    act(() => {
      result.current.handleEditUsuario(usuarioToEdit);
      result.current.setFormData(updatedData);
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockUseAdmin.actualizarNombreUsuario).toHaveBeenCalledWith(usuarioToEdit.id, updatedData.nombre);
    expect(mockUseAdmin.actualizarEmailUsuario).toHaveBeenCalledWith(usuarioToEdit.id, updatedData.email);
    expect(mockUseAdmin.actualizarRolUsuario).toHaveBeenCalledWith(usuarioToEdit.id, updatedData.rol);
    expect(result.current.showDialog).toBe(false);
  });

  it('debería obtener el color correcto para cada rol', () => {
    const { result } = renderHook(() => useAdminLogic());

    expect(result.current.getRolColor('DUEÑO')).toBe('var(--sapIndicationColor_1)');
    expect(result.current.getRolColor('ADMIN')).toBe('var(--sapIndicationColor_3)');
    expect(result.current.getRolColor('ANALISTA')).toBe('var(--sapIndicationColor_4)');
    expect(result.current.getRolColor('PROVEEDOR')).toBe('var(--sapIndicationColor_6)');
    expect(result.current.getRolColor('OTRO')).toBe('var(--sapIndicationColor_5)');
  });

  it('debería obtener las iniciales correctamente', () => {
    const { result } = renderHook(() => useAdminLogic());

    expect(result.current.getInitials('Juan Pérez')).toBe('JP');
    expect(result.current.getInitials('María García López')).toBe('MGL');
    expect(result.current.getInitials('')).toBe('');
    expect(result.current.getInitials(null)).toBe('');
  });
}); 