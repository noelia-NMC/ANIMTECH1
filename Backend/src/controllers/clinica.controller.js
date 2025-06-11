// Backend/src/controllers/clinica.controller.js   para maps clinicas y refugios
const axios = require ('axios');

// Controlador para buscar en OpenStreetMap con una consulta mejorada
const searchOSMClinicasAvanzado = async (req, res) => {
    // 1. Validar entrada
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ message: 'Se requieren latitud y longitud.' });
    }

    const radiusInMeters = 7000; // Aumentamos un poco el radio a 7km para tener más opciones

    // 2. Consulta Overpass QL mejorada.
    // [amenity=veterinary] -> Busca veterinarias.
    // [amenity=animal_shelter] -> Busca refugios.
    // [name] -> ¡CRÍTICO! Solo trae lugares que TENGAN un nombre definido.
    // [phone] -> Opcional, pero prioriza los que tienen teléfono.
    const overpassQuery = `
        [out:json][timeout:25];
        (
          // Busca nodos (puntos) con nombre y opcionalmente teléfono
          node["amenity"~"veterinary|animal_shelter"]["name"](around:${radiusInMeters},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
    `;
    
    const overpassUrl = 'https://overpass-api.de/api/interpreter';

    console.log(`[Backend] Pidiendo a Overpass API con consulta avanzada...`);

    try {
        // 3. Hacemos la petición POST
        const response = await axios.post(overpassUrl, `data=${encodeURIComponent(overpassQuery)}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // 4. Procesamos la respuesta para filtrar y estandarizar
        const clinicas = response.data.elements
            .filter(element => element.type === 'node' && element.tags) // Nos aseguramos de que sea un punto y tenga etiquetas
            .map(element => {
                const tags = element.tags;
                return {
                    id: element.id,
                    nombre: tags.name, // Sabemos que existe por la consulta
                    direccion: `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''}`.trim() || null,
                    ciudad: tags['addr:city'] || null,
                    telefono: tags.phone || tags.contact_phone || null,
                    website: tags.website || null,
                    latitude: element.lat,
                    longitude: element.lon,
                };
            });
        
        console.log(`[Backend] Se encontraron ${clinicas.length} lugares con nombre definido.`);
        res.status(200).json(clinicas);

    } catch (error) {
        console.error("[Backend] Error consultando Overpass API:", error.message);
        res.status(500).json({ message: 'Error interno del servidor al buscar clínicas.' });
    }
};

module.exports = {
    searchOSMClinicasAvanzado
};