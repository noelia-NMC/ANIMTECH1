// Mobile/src/styles/CommunityStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const communityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  
  // ===== HEADER =====
  header: {
    backgroundColor: '#42a8a1',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  
  // ===== CREAR POST =====
  createPostContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createPostButton: {
    backgroundColor: '#42a8a1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  createPostButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // ===== FEED =====
  feedContainer: {
    flex: 1,
  },
  
  // ===== POST CARD =====
  postCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 10,
  },
  petPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  ownerName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  petBreed: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  postTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  
  // ===== BADGE TIPO POST =====
  postTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  postTypeBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // ===== CONTENIDO DEL POST =====
  postContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2c3e50',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 10,
  },
  
  // ===== ACCIONES DEL POST =====
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  likeButton: {
    backgroundColor: '#e8f5e8',
  },
  likeButtonActive: {
    backgroundColor: '#d4edda',
  },
  commentButton: {
    backgroundColor: '#e3f2fd',
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  likeButtonText: {
    color: '#28a745',
  },
  commentButtonText: {
    color: '#007bff',
  },
  
  // ===== COMENTARIOS =====
  commentsSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#42a8a1',
    marginBottom: 3,
  },
  commentText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 18,
  },
  
  // ===== MODAL CREAR POST =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    width: width * 0.9,
    maxHeight: '80%',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // ===== FORMULARIO =====
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  
  // ===== IMAGEN =====
  imagePreviewContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  addImageButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    color: '#6c757d',
    fontSize: 14,
    marginTop: 5,
  },
  
  // ===== BOTONES MODAL =====
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#42a8a1',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // ===== ESTADOS =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 15,
  },
  
  // ===== UTILIDADES =====
  centerText: {
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#7f8c8d',
  },
  
  // ===== ESTILOS FALTANTES PARA COMMENTS Y OTROS =====
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  sendButton: {
    backgroundColor: '#42a8a1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  
  // ===== NAVEGACIÓN Y OTROS =====
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#42a8a1',
  },
  tabText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#42a8a1',
    fontWeight: '600',
  },
});