// Mobile/src/screens/community/CommentsScreen.js - CORREGIDO
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { communityStyles } from '../../styles/CommunityStyles';
import socialService from '../../services/socialService';
import { formatTimeAgo } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

const CommentsScreen = ({ route, navigation }) => {
  const { postId, postContent } = route.params;
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef(null);

  // Configurar header de navegación
  useEffect(() => {
    navigation.setOptions({
      title: 'Comentarios',
      headerStyle: {
        backgroundColor: '#42a8a1',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  // Cargar comentarios
  const loadComments = async (pageNum = 1, isRefresh = false) => {
    try {
      if (!isRefresh && pageNum === 1) setLoading(true);

      const response = await socialService.getComments(postId, pageNum);
      
      if (response.success) {
        if (pageNum === 1 || isRefresh) {
          setComments(response.data.comentarios);
        } else {
          setComments(prev => [...prev, ...response.data.comentarios]);
        }
        
        setHasMore(response.data.comentarios.length === 20); // Límite de 20
        setPage(pageNum);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  // Enviar comentario
  const sendComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'El comentario no puede estar vacío');
      return;
    }

    setSending(true);
    try {
      const response = await socialService.addComment(postId, newComment.trim());
      
      if (response.success) {
        // Agregar el comentario al inicio de la lista
        setComments(prev => [response.data.comentario, ...prev]);
        setNewComment('');
        
        // Scroll al inicio para mostrar el nuevo comentario
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Alert.alert('Error', 'No se pudo enviar el comentario');
    } finally {
      setSending(false);
    }
  };

  // Cargar más comentarios
  const loadMore = () => {
    if (!loading && hasMore) {
      loadComments(page + 1);
    }
  };

  // Renderizar cada comentario
  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>
          {item.usuario_nombre} {item.usuario_apellido}
        </Text>
        <Text style={styles.commentTime}>
          {formatTimeAgo(new Date(item.fecha_creacion))}
        </Text>
      </View>
      <Text style={styles.commentText}>
        {item.contenido}
      </Text>
    </View>
  );

  // Renderizar header con el contenido del post
  const renderHeader = () => (
    <View style={styles.postContentContainer}>
      <Text style={styles.postContentLabel}>Publicación:</Text>
      <Text style={styles.postContentText}>{postContent}</Text>
    </View>
  );

  // Renderizar footer de carga
  const renderFooter = () => {
    if (!loading || page === 1) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#42a8a1" />
      </View>
    );
  };

  // Renderizar estado vacío
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={60} color="#bdc3c7" />
      <Text style={styles.emptyText}>
        ¡Sé el primero en comentar!
      </Text>
    </View>
  );

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={styles.loadingText}>
          Cargando comentarios...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Lista de comentarios */}
      <FlatList
        ref={flatListRef}
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        style={styles.commentsList}
      />

      {/* Input para nuevo comentario */}
      <View style={communityStyles.commentInputContainer}>
        <TextInput
          style={communityStyles.commentInput}
          placeholder="Escribe un comentario..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
          editable={!sending}
        />
        <TouchableOpacity
          style={[
            communityStyles.sendButton,
            (!newComment.trim() || sending) && communityStyles.sendButtonDisabled
          ]}
          onPress={sendComment}
          disabled={!newComment.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="send" size={20} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Estilos específicos para CommentsScreen
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  
  // ===== CONTENIDO DEL POST =====
  postContentContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  postContentLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#42a8a1',
    marginBottom: 8,
  },
  postContentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2c3e50',
  },
  
  // ===== LISTA DE COMENTARIOS =====
  commentsList: {
    flex: 1,
  },
  
  // ===== ITEM DE COMENTARIO =====
  commentItem: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#42a8a1',
  },
  commentTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  commentText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  
  // ===== ESTADOS =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 15,
  },
};

export default CommentsScreen;