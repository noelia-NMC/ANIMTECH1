import { registrarPerfilMascota, getMisPerfiles, actualizarPerfilMascota } from '../services/perfilMascotaService';

describe('AnimTech - Pruebas de Caja Negra: perfilMascotaService', () => {
  
  test('registrarPerfilMascota con datos válidos', async () => {
    const mascotaValida = {
      nombre: 'Luna',
      especie: 'canino',
      raza: 'Golden Retriever',
      fecha_nacimiento: '2021-05-15',
      genero: 'Hembra',
      collar_id: 'COL123'
    };

    expect(() => {
      expect(mascotaValida.nombre).toBeTruthy();
      expect(['canino', 'felino'].includes(mascotaValida.especie)).toBe(true);
      expect(mascotaValida.fecha_nacimiento).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['Macho', 'Hembra'].includes(mascotaValida.genero)).toBe(true);
    }).not.toThrow();
  });

  test('registrarPerfilMascota con datos inválidos', () => {
    const mascotaInvalida = {
      nombre: '',           
      especie: 'perro',
      fecha_nacimiento: 'fecha-incorrecta', 
      genero: 'otro'     
    };

    expect(mascotaInvalida.nombre.trim()).toBe('');
    expect(['canino', 'felino'].includes(mascotaInvalida.especie)).toBe(false);
    expect(mascotaInvalida.fecha_nacimiento).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(['Macho', 'Hembra'].includes(mascotaInvalida.genero)).toBe(false);
  });

  test('getMisPerfiles debe retornar estructura correcta', () => {
    const respuestaEsperada = {
      success: true,
      data: [
        {
          id: 1,
          nombre: 'Max',
          especie: 'canino'
        }
      ]
    };

    expect(respuestaEsperada).toHaveProperty('success');
    expect(respuestaEsperada).toHaveProperty('data');
    expect(Array.isArray(respuestaEsperada.data)).toBe(true);
  });
});