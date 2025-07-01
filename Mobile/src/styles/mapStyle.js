// src/styles/mapStyle.js

// Estilo de Snazzy Maps: "Subtle Grayscale" - adaptado con toques de la paleta
export const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [{ "visibility": "on" }, { "lightness": 33 }]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{ "color": "#f2f2f2" }]
  },
  {
    "featureType": "landscape.natural.terrain",
    "elementType": "all",
    "stylers": [{ "color": "#E0E0E0" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#c5e5c5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [{ "visibility": "on" }, { "lightness": 20 }]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{ "lightness": 20 }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#c1d6d2" }] // Un toque sutil del color de la marca
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{ "color": "#d5e5e3" }] // Un toque sutil del color de la marca
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{ "visibility": "on" }, { "color": "#b5ffff" }] // El color accent light de tu paleta
  }
];