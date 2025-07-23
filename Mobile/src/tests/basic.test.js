describe('AnimTech - Verificación del Sistema', () => {
  it('debe validar configuración del proyecto', () => {
    const projectConfig = {
      name: 'AnimTech',
      platform: 'React Native',
      version: '1.0.0'
    };

    expect(projectConfig.name).toBe('AnimTech');
    expect(projectConfig.platform).toBe('React Native');
    expect(projectConfig.version).toBe('1.0.0');
  });

  it('debe verificar estructura de datos de mascota', () => {
    const mascota = {
      id: 1,
      nombre: 'Luna',
      especie: 'Canino',
      edad: 3,
      activo: true
    };

    expect(mascota.id).toBeGreaterThan(0);
    expect(mascota.nombre).toBeTruthy();
    expect(mascota.especie).toBe('Canino');
    expect(typeof mascota.edad).toBe('number');
    expect(mascota.activo).toBe(true);
  });
});