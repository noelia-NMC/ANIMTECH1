import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
  },
  filtroBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  filtroActivo: {
    backgroundColor: '#2196F3',
  },
  filtroTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lista: {
    backgroundColor: '#fafafa',
    maxHeight: 180,
  },
  card: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dato: {
    fontSize: 14,
    color: '#444',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  link: {
    color: '#1E88E5',
    fontSize: 16,
    marginTop: 10,
  },
  cerrarBtn: {
    marginTop: 20,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cerrarTxt: {
    fontSize: 16,
    color: '#333',
  },
});
