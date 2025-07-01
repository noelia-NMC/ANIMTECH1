import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import * as RoleService from '../services/rolesService';
import {
    PageContainer, Content, HeaderRow, PageTitle, AddButton, RolesGrid,
    RolCard, RolHeader, RolTitle, RolDescription, RolActions, ActionButton,
    PermisosContainer, PermissionGroup, GroupTitle, PermisoCheckbox, CheckboxGrid,
    CardFooter, SaveButton, LoadingState, ErrorState, ModalOverlay,
    ModalContent, ModalTitle, Input, TextArea, ModalActions, CancelButton
} from '../styles/rolesStyles';

export default function Roles() {
    // ... (toda la lógica del componente permanece igual)
    const [roles, setRoles] = useState([]);
    const [allPermisos, setAllPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRol, setCurrentRol] = useState({ id: null, nombre: '', descripcion: '' });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const [rolesRes, permisosRes] = await Promise.all([
                RoleService.getAllRoles(),
                RoleService.getAllPermisos()
            ]);
            setRoles(rolesRes.data.map(rol => ({ ...rol, permisos: new Set(rol.permisos.map(p => p.id)) })));
            setAllPermisos(permisosRes.data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar datos. Verifica tu conexión y permisos de administrador.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleOpenModal = (rol = null) => {
        if (rol) {
            setIsEditing(true);
            setCurrentRol({ id: rol.id, nombre: rol.nombre, descripcion: rol.descripcion });
        } else {
            setIsEditing(false);
            setCurrentRol({ id: null, nombre: '', descripcion: '' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => { setModalOpen(false); };

    const handleModalSave = async () => {
        try {
            if (!currentRol.nombre.trim() || !currentRol.descripcion.trim()) {
                alert("El nombre y la descripción son obligatorios.");
                return;
            }
            if (isEditing) {
                await RoleService.updateRol(currentRol.id, { descripcion: currentRol.descripcion });
                alert("Rol actualizado correctamente.");
            } else {
                await RoleService.createRol({ nombre: currentRol.nombre, descripcion: currentRol.descripcion });
                alert("Rol creado exitosamente.");
            }
            fetchData();
            handleCloseModal();
        } catch (err) {
            alert(`Error al guardar el rol: ${err.response?.data?.message || 'Error desconocido'}`);
        }
    };

    const handleDeleteRol = async (rolId) => {
        if (window.confirm("¿Seguro que quieres eliminar este rol? Esta acción no se puede deshacer y fallará si algún usuario tiene este rol asignado.")) {
            try {
                await RoleService.deleteRol(rolId);
                alert("Rol eliminado.");
                fetchData();
            } catch (err) {
                alert(`Error al eliminar: ${err.response?.data?.message || 'Error desconocido'}`);
            }
        }
    };

    const handlePermisoChange = (rolId, permisoId) => {
        setRoles(prevRoles => prevRoles.map(rol => {
            if (rol.id === rolId) {
                const newPermisos = new Set(rol.permisos);
                newPermisos.has(permisoId) ? newPermisos.delete(permisoId) : newPermisos.add(permisoId);
                return { ...rol, permisos: newPermisos };
            }
            return rol;
        }));
    };

    const handleSaveChanges = async (rol) => {
        try {
            const permisosIds = Array.from(rol.permisos);
            await RoleService.updateRolPermisos(rol.id, permisosIds);
            alert(`Permisos para el rol "${rol.nombre}" actualizados exitosamente.`);
        } catch (error) {
            alert(`Error al guardar permisos: ${error.response?.data?.message || 'Error desconocido'}`);
        }
    };

    const groupedPermisos = allPermisos.reduce((acc, permiso) => {
        const group = permiso.nombre.split(':')[0];
        if (!acc[group]) acc[group] = [];
        acc[group].push(permiso);
        return acc;
    }, {});

    const actionOrder = ['create', 'read', 'update', 'delete'];

    if (loading) return <PageContainer><Navbar /><LoadingState><h2>Cargando...</h2></LoadingState></PageContainer>;
    if (error) return <PageContainer><Navbar /><ErrorState><h2>{error}</h2></ErrorState></PageContainer>;

    return (
        <PageContainer>
            <Navbar />
            <Content>
                <HeaderRow>
                    <AddButton onClick={() => handleOpenModal()}>+ Añadir Rol</AddButton>
                </HeaderRow>
                <RolesGrid>
                    {roles.map(rol => (
                        <RolCard key={rol.id}>
                            <RolHeader>
                                <div>
                                    <RolTitle>{rol.nombre}</RolTitle>
                                    <RolDescription>{rol.descripcion}</RolDescription>
                                </div>
                                <RolActions>
                                    <ActionButton onClick={() => handleOpenModal(rol)} title="Editar rol" disabled={rol.nombre === 'admin'}>✏️</ActionButton>
                                    <ActionButton onClick={() => handleDeleteRol(rol.id)} title="Eliminar rol" disabled={rol.nombre === 'admin'}>🗑️</ActionButton>
                                </RolActions>
                            </RolHeader>
                            <PermisosContainer>
                                {Object.keys(groupedPermisos).sort().map(groupName => (
                                    <PermissionGroup key={groupName}>
                                        <GroupTitle>{groupName}</GroupTitle>
                                        <CheckboxGrid>
                                            {groupedPermisos[groupName]
                                              .sort((a, b) => {
                                                  const aAction = a.nombre.split(':')[1];
                                                  const bAction = b.nombre.split(':')[1];
                                                  return actionOrder.indexOf(aAction) - actionOrder.indexOf(bAction);
                                              })
                                              .map(permiso => (
                                                <PermisoCheckbox key={permiso.id}>
                                                    <input
                                                        type="checkbox"
                                                        id={`permiso-${rol.id}-${permiso.id}`}
                                                        checked={rol.permisos.has(permiso.id)}
                                                        onChange={() => handlePermisoChange(rol.id, permiso.id)}
                                                        disabled={rol.nombre === 'admin'}
                                                    />
                                                    <label htmlFor={`permiso-${rol.id}-${permiso.id}`}>
                                                        {permiso.nombre.split(':')[1]}
                                                    </label>
                                                </PermisoCheckbox>
                                            ))}
                                        </CheckboxGrid>
                                    </PermissionGroup>
                                ))}
                            </PermisosContainer>
                            <CardFooter>
                                <SaveButton onClick={() => handleSaveChanges(rol)} disabled={rol.nombre === 'admin'}>
                                    Guardar Permisos
                                </SaveButton>
                            </CardFooter>
                        </RolCard>
                    ))}
                </RolesGrid>
            </Content>
            {modalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>{isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}</ModalTitle>
                        <Input type="text" placeholder="Nombre del rol (ej: recepcionista)" value={currentRol.nombre} onChange={(e) => setCurrentRol({ ...currentRol, nombre: e.target.value.toLowerCase() })} disabled={isEditing}/>
                        <TextArea placeholder="Descripción del rol" value={currentRol.descripcion} onChange={(e) => setCurrentRol({ ...currentRol, descripcion: e.target.value })}/>
                        <ModalActions>
                            <CancelButton onClick={handleCloseModal}>Cancelar</CancelButton>
                            <SaveButton onClick={handleModalSave}>{isEditing ? "Guardar Cambios" : "Crear Rol"}</SaveButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    );
}