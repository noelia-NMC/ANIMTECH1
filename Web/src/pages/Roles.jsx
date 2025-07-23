// src/pages/Roles.js
import React, { useState, useEffect, useCallback } from 'react';
import * as RoleService from '../services/rolesService';
import {
    PageContainer, HeaderRow, PageTitle, AddButton, RolesGrid,
    RolCard, RolHeader, RolTitle, RolDescription, RolActions, ActionButton,
    PermisosContainer, PermissionGroup, GroupTitle, PermisoCheckbox, CheckboxGrid,
    CardFooter, SaveButton, LoadingState, ErrorState, ModalOverlay,
    ModalContent, ModalTitle, Input, TextArea, ModalActions, CancelButton
} from '../styles/rolesStyles';

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [allPermisos, setAllPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRol, setCurrentRol] = useState({ id: null, nombre: '', descripcion: '' });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true); setError(null);
            const [rolesRes, permisosRes] = await Promise.all([ RoleService.getAllRoles(), RoleService.getAllPermisos() ]);
            setRoles(rolesRes.data.map(rol => ({ ...rol, permisos: new Set(rol.permisos.map(p => p.id)) })));
            setAllPermisos(permisosRes.data);
        } catch (err) {
            console.error(err);
            setError("Error al cargar datos. Verifique su conexión y permisos de administrador.");
        } finally { setLoading(false); }
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
            fetchData(); handleCloseModal();
        } catch (err) { alert(`Error al guardar el rol: ${err.response?.data?.message || 'Error desconocido'}`); }
    };

    const handleDeleteRol = async (rolId) => {
        if (window.confirm("¿Está seguro de que quiere eliminar este rol? Esta acción no se puede deshacer y fallará si algún usuario tiene este rol asignado.")) {
            try {
                await RoleService.deleteRol(rolId);
                alert("Rol eliminado correctamente.");
                fetchData();
            } catch (err) { alert(`Error al eliminar: ${err.response?.data?.message || 'Error desconocido'}`); }
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
        } catch (error) { alert(`Error al guardar permisos: ${error.response?.data?.message || 'Error desconocido'}`); }
    };

    const groupedPermisos = allPermisos.reduce((acc, permiso) => {
        const group = permiso.nombre.split(':')[0];
        if (!acc[group]) acc[group] = [];
        acc[group].push(permiso);
        return acc;
    }, {});

    const actionOrder = ['create', 'read', 'update', 'delete'];

    if (loading) return <LoadingState><h2>Cargando...</h2></LoadingState>;
    if (error) return <ErrorState><h2>{error}</h2></ErrorState>;

    return (
        <PageContainer>
            <HeaderRow>
                <PageTitle>Gestión de roles y permisos</PageTitle>
                <AddButton onClick={() => handleOpenModal()}>+ Añadir rol</AddButton>
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
                                          .sort((a, b) => actionOrder.indexOf(a.nombre.split(':')[1]) - actionOrder.indexOf(b.nombre.split(':')[1]))
                                          .map(permiso => (
                                            <PermisoCheckbox key={permiso.id}>
                                                <input
                                                    type="checkbox" id={`permiso-${rol.id}-${permiso.id}`}
                                                    checked={rol.permisos.has(permiso.id)}
                                                    onChange={() => handlePermisoChange(rol.id, permiso.id)}
                                                    disabled={rol.nombre === 'admin'}
                                                />
                                                <label htmlFor={`permiso-${rol.id}-${permiso.id}`}>{permiso.nombre.split(':')[1]}</label>
                                            </PermisoCheckbox>
                                        ))}
                                    </CheckboxGrid>
                                </PermissionGroup>
                            ))}
                        </PermisosContainer>
                        <CardFooter>
                            <SaveButton onClick={() => handleSaveChanges(rol)} disabled={rol.nombre === 'admin'}>
                                Guardar permisos
                            </SaveButton>
                        </CardFooter>
                    </RolCard>
                ))}
            </RolesGrid>
            {modalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>{isEditing ? 'Editar rol' : 'Crear nuevo rol'}</ModalTitle>
                        <Input type="text" placeholder="Nombre del rol (ej: recepcionista)" value={currentRol.nombre} onChange={(e) => setCurrentRol({ ...currentRol, nombre: e.target.value.toLowerCase() })} disabled={isEditing}/>
                        <TextArea placeholder="Descripción del rol" value={currentRol.descripcion} onChange={(e) => setCurrentRol({ ...currentRol, descripcion: e.target.value })}/>
                        <ModalActions>
                            <CancelButton onClick={handleCloseModal}>Cancelar</CancelButton>
                            <SaveButton onClick={handleModalSave}>{isEditing ? "Guardar cambios" : "Crear rol"}</SaveButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    );
}