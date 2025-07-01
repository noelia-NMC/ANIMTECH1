// src/styles/ClinicasMapScreenStyles.js

import { StyleSheet } from 'react-native';

const colors = {
  primary: '#42a8a1',
  primaryDark: '#2d6e68',
  link: '#3b82f6',
  surface: '#ffffff',
  background: '#f4f7f9',
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  shadow: 'rgba(0, 0, 0, 0.15)', // Sombra un poco más oscura para mejor contraste
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
  // -- Contenedor de Controles Superiores Flotantes --
  headerControls: {
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 8,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  filtros: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 5, // Más compacto
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  filtroBtn: {
    paddingVertical: 7, // Más compacto
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  filtroActivo: {
    backgroundColor: colors.primary,
  },
  filtroTxt: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  filtroTxtActivo: {
    color: colors.surface,
  },

  // -- Bocadillo del Mapa (Callout) --
  callout: { width: 230, padding: 5, },
  calloutTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4, },
  calloutDescription: { fontSize: 13, color: colors.textSecondary, },
  calloutActionText: { marginTop: 8, color: colors.link, fontWeight: '600', textAlign: 'center' },
  
  // -- Panel Inferior Compacto --
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingTop: 8,
    maxHeight: '35%', // Altura máxima más reducida
  },
  dragHandle: { width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 8, },
  listHeader: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, paddingHorizontal: 20, paddingBottom: 10, },
  lista: { /* La lista ahora usará el espacio disponible en el BottomSheet */ },
  
  // -- Tarjetas de la lista --
  card: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
  },
  cardContent: { flex: 1, },
  nombre: { fontWeight: 'bold', fontSize: 15, color: colors.textPrimary, },
  dato: { fontSize: 13, color: colors.textSecondary, },
  
  // -- Estilos Generales --
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, },
  loadingText: { marginTop: 15, fontSize: 16, color: colors.textSecondary, },
  
  // -- Modal (sin cambios de estilo) --
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', },
  modalCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, width: '90%', elevation: 10, gap: 12, },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: colors.textPrimary, textAlign: 'center', },
  linkContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, },
  link: { color: colors.link, fontSize: 16, fontWeight: '500', marginLeft: 8 },
  cerrarBtn: { marginTop: 20, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center', },
  cerrarTxt: { fontSize: 16, color: colors.surface, fontWeight: 'bold' },
});