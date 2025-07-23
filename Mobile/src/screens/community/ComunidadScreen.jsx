// Mobile/src/screens/community/ComunidadScreen.js - CORREGIDO
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { communityStyles } from '../../styles/CommunityStyles';
import socialService from '../../services/socialService';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';

const ComunidadScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Cargar feed inicial
  const loadFeed = async (pageNum = 1, isRefresh = false) => {
    try {
      if (!isRefresh && pageNum === 1) setLoading(true);

      const response = await socialService.getFeed(pageNum);
      
      if (response.success) {
        if (pageNum === 1 || isRefresh) {
          setPosts(response.data.posts);
        } else {
          setPosts(prev => [...prev, ...response.data.posts]);
        }
        
        setHasMore(response.data.posts.length === 10); // Asumiendo límite de 10
        setPage(pageNum);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error al cargar feed:', error);
      Alert.alert('Error', 'No se pudo cargar las publicaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Efecto inicial
  useEffect(() => {
    loadFeed();
  }, []);

  // Refrescar feed
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeed(1, true);
  }, []);

  // Cargar más posts (paginación)
  const loadMore = () => {
    if (!loading && hasMore) {
      loadFeed(page + 1);
    }
  };

  // Manejar like
  const handleLike = async (postId, currentlyLiked) => {
    try {
      const response = await socialService.toggleLike(postId);
      
      if (response.success) {
        // Actualizar el estado local
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                me_gusta: !currentlyLiked,
                total_likes: currentlyLiked 
                  ? parseInt(post.total_likes) - 1 
                  : parseInt(post.total_likes) + 1
              };
            }
            return post;
          })
        );
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      Alert.alert('Error', 'No se pudo procesar el like');
    }
  };

  // Manejar comentario
  const handleComment = (postId, postContent) => {
    // Navegar a pantalla de comentarios
    navigation.navigate('CommentsScreen', {
      postId,
      postContent
    });
  };

  // Crear nueva publicación
  const handleCreatePost = async (postData) => {
    try {
      const response = await socialService.createPost(postData);
      
      if (response.success) {
        // Agregar el nuevo post al inicio del feed
        setPosts(prev => [response.data.post, ...prev]);
        setShowCreateModal(false);
        Alert.alert('¡Éxito!', 'Tu publicación ha sido compartida');
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error al crear post:', error);
      Alert.alert('Error', 'No se pudo crear la publicación');
    }
  };

  // Renderizar cada post
  const renderPost = ({ item }) => (
    <PostCard
      post={item}
      onLike={() => handleLike(item.id, item.me_gusta)}
      onComment={() => handleComment(item.id, item.contenido)}
      currentUserId={user?.id}
    />
  );

  // Renderizar header del feed
  const renderHeader = () => (
    <View style={communityStyles.createPostContainer}>
      <TouchableOpacity
        style={communityStyles.createPostButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
        <Text style={communityStyles.createPostButtonText}>
          ¿Qué está haciendo tu mascota?
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizar indicador de carga al final
  const renderFooter = () => {
    if (!loading || page === 1) return null;
    
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="small" color="#42a8a1" />
      </View>
    );
  };

  // Renderizar pantalla vacía
  const renderEmpty = () => (
    <View style={communityStyles.emptyContainer}>
      <Ionicons name="heart-outline" size={60} color="#bdc3c7" />
      <Text style={communityStyles.emptyText}>
        ¡Sé el primero en compartir algo sobre tu mascota!
      </Text>
    </View>
  );

  if (loading && page === 1) {
    return (
      <View style={communityStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#42a8a1" />
        <Text style={[communityStyles.emptyText, { marginTop: 10 }]}>
          Cargando publicaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={communityStyles.container}>
      {/* Header personalizado */}
      <View style={communityStyles.header}>
        <Text style={communityStyles.headerTitle}>Comunidad</Text>
      </View>

      {/* Feed de publicaciones */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#42a8a1']}
            tintColor="#42a8a1"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal para crear publicación */}
      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
      />
    </View>
  );
};

export default ComunidadScreen;