// src/styles/mapStyle.js

// Estilo para modo normal (estándar)
export const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
      { "visibility": "on" }, 
      { "lightness": 33 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      { "color": "#f2f2f2" }
    ]
  },
  {
    "featureType": "landscape.natural.terrain",
    "elementType": "all",
    "stylers": [
      { "color": "#E0E0E0" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#c5e5c5" }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      { "visibility": "on" }, 
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "color": "#c1d6d2" } // Toque sutil del color de la marca AnimTech
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#d5e5e3" } // Toque sutil del color de la marca AnimTech
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      { "visibility": "on" }, 
      { "color": "#b5ffff" } // Color accent light de la paleta AnimTech
    ]
  }
];

// Para el modo satélite no necesitamos estilo personalizado
// React Native Maps maneja automáticamente el tipo 'satellite'
export const satelliteStyle = undefined;