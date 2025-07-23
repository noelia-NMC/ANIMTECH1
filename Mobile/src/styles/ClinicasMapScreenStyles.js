// src/styles/ClinicasMapScreenStyles.js

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  // ============ CONTAINER PRINCIPAL ============
  container: {
    flex: 1,
    backgroundColor: '#f4f7f9',
  },

  map: {
    flex: 1,
  },

  // ============ PANTALLA DE CARGA ============
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7f9',
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },

  loadingIndicator: {
    paddingVertical: 20,
  },

  // ============ CONTROLES SUPERIORES - POSICIÓN FIJA ============
  headerControls: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1000,
    // ✅ Sin dependencia de insets aquí - se maneja en el componente
  },

  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  rightControls: {
    alignItems: 'flex-end',
    gap: 10,
  },

  mapTypeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  mapTypeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },

  // ============ FILTROS ============
  filtros: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  filtroBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 2,
  },

  filtroActivo: {
    backgroundColor: '#42a8a1',
  },

  filtroTxt: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  filtroTxtActivo: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // ============ PANEL DESLIZABLE ============
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },

  // ============ HEADER DEL PANEL ============
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 12,
  },

  listHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },

  // ✅ BOTÓN TOGGLE CORREGIDO
  togglePanelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  clearRouteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fecaca',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // ============ CLÍNICA SELECCIONADA ============
  selectedClinicaContainer: {
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#42a8a1',
  },

  selectedClinicaInfo: {
    marginBottom: 12,
  },

  selectedClinicaName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },

  selectedClinicaAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  phoneText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },

  routeInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  routeInfoText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // ============ MODOS DE TRANSPORTE ============
  transportLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },

  transportModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  transportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    minWidth: 75,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  transportText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },

  loadingRouteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  loadingRouteText: {
    fontSize: 14,
    color: '#42a8a1',
    fontStyle: 'italic',
  },

  // ============ LISTA DE CLÍNICAS ============
  lista: {
    flex: 1,
    paddingTop: 8,
  },

  // ============ TARJETAS DE CLÍNICAS ============
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },

  cardSelected: {
    borderColor: '#42a8a1',
    borderWidth: 2,
    backgroundColor: '#f0fdfa',
  },

  iconContainer: {
    backgroundColor: '#f0fdfa',
    borderRadius: 25,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    flex: 1,
    gap: 4,
  },

  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },

  dato: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },

  telefonoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  telefono: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },

  routeIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0fdfa',
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  // ============ CALLOUT DEL MAPA ============
  callout: {
    minWidth: 200,
    maxWidth: 250,
  },

  calloutContainer: {
    padding: 8,
    gap: 4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },

  calloutDescription: {
    fontSize: 12,
    color: '#6b7280',
  },

  calloutPhone: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },

  calloutActionText: {
    fontSize: 11,
    color: '#42a8a1',
    fontStyle: 'italic',
    marginTop: 2,
  },

  // ============ MANEJO DE ERRORES ============
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },

  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#42a8a1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#42a8a1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});