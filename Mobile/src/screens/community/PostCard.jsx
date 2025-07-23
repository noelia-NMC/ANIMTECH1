// Mobile/src/screens/community/PostCard.js - CORREGIDO
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { communityStyles } from '../../styles/CommunityStyles'; // CORREGIDO
import { formatTimeAgo } from '../../utils/dateUtils';

const PostCard = ({ post, onLike, onComment, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(parseInt(post.total_likes) || 0);
  const [isLiked, setIsLiked] = useState(post.me_gusta);

  // Función para formatear el tiempo
  const getTimeAgo = (dateString) => {
    return formatTimeAgo(new Date(dateString));
  };

  // Manejar like con optimización optimista
  const handleLike = () => {
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? localLikes + 1 : localLikes - 1;
    
    // Actualización optimista
    setIsLiked(newLikedState);
    setLocalLikes(newLikesCount);
    
    // Llamar al callback del padre
    onLike();
  };

  // Manejar opciones del post
  const handlePostOptions = () => {
    const isOwner = currentUserId === post.user_id;
    
    const options = ['Cancelar'];
    const destructiveButtonIndex = [];

    if (isOwner) {
      options.unshift('Eliminar publicación');
      destructiveButtonIndex.push(0);
    } else {
      options.unshift('Reportar publicación');
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex,
          cancelButtonIndex: options.length - 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            if (isOwner) {
              handleDeletePost();
            } else {
              handleReportPost();
            }
          }
        }
      );
    } else {
      // Para Android, usar Alert
      const alertOptions = [
        { text: 'Cancelar', style: 'cancel' },
      ];

      if (isOwner) {
        alertOptions.unshift({
          text: 'Eliminar',
          style: 'destructive',
          onPress: handleDeletePost,
        });
      } else {
        alertOptions.unshift({
          text: 'Reportar',
          onPress: handleReportPost,
        });
      }

      Alert.alert('Opciones', 'Selecciona una opción:', alertOptions);
    }
  };

  // Eliminar publicación
  const handleDeletePost = () => {
    Alert.alert(
      'Eliminar publicación',
      '¿Estás seguro de que quieres eliminar esta publicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar eliminación
            console.log('Eliminar post:', post.id);
          },
        },
      ]
    );
  };

  // Reportar publicación
  const handleReportPost = () => {
    Alert.alert(
      'Reportar publicación',
      '¿Por qué quieres reportar esta publicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Contenido inapropiado', onPress: () => reportPost('inappropriate') },
        { text: 'Spam', onPress: () => reportPost('spam') },
        { text: 'Otro motivo', onPress: () => reportPost('other') },
      ]
    );
  };

  const reportPost = (motivo) => {
    // TODO: Implementar reporte
    console.log('Reportar post:', post.id, 'Motivo:', motivo);
    Alert.alert('Reporte enviado', 'Gracias por reportar. Revisaremos esta publicación.');
  };

  // Renderizar imagen si existe
  const renderPostImage = () => {
    if (!post.imagen_url) return null;

    return (
      <Image
        source={{ uri: post.imagen_url }}
        style={communityStyles.postImage}
        resizeMode="cover"
      />
    );
  };

  // Renderizar badge del tipo de post
  const renderPostTypeBadge = () => {
    if (!post.tipo_post || post.tipo_post === 'normal') return null;

    const badges = {
      adopcion: { text: 'En adopción', color: '#28a745', icon: 'heart' },
      perdido: { text: 'Perdido', color: '#dc3545', icon: 'search' },
      encontrado: { text: 'Encontrado', color: '#17a2b8', icon: 'checkmark-circle' },
    };

    const badge = badges[post.tipo_post];
    if (!badge) return null;

    return (
      <View style={[
        communityStyles.postTypeBadge,
        { backgroundColor: badge.color }
      ]}>
        <Ionicons name={badge.icon} size={12} color="#ffffff" />
        <Text style={communityStyles.postTypeBadgeText}>
          {badge.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={communityStyles.postCard}>
      {/* Header del post */}
      <View style={communityStyles.postHeader}>
        <Image
          source={{
            uri: post.mascota_foto || 'https://via.placeholder.com/50x50?text=🐕'
          }}
          style={communityStyles.petPhoto}
        />
        
        <View style={communityStyles.postUserInfo}>
          <Text style={communityStyles.petName}>
            {post.mascota_nombre}
          </Text>
          <Text style={communityStyles.ownerName}>
            {post.usuario_nombre} {post.usuario_apellido}
          </Text>
          {post.raza && (
            <Text style={communityStyles.petBreed}>
              {post.raza}
            </Text>
          )}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={communityStyles.postTime}>
            {getTimeAgo(post.fecha_creacion)}
          </Text>
          
          <TouchableOpacity
            onPress={handlePostOptions}
            style={{ padding: 5, marginTop: 5 }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#95a5a6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Badge del tipo de post */}
      {renderPostTypeBadge()}

      {/* Contenido del post */}
      <View style={communityStyles.postContent}>
        <Text style={communityStyles.postText}>
          {post.contenido}
        </Text>
        
        {renderPostImage()}
      </View>

      {/* Acciones del post */}
      <View style={communityStyles.postActions}>
        <TouchableOpacity
          style={[
            communityStyles.actionButton,
            communityStyles.likeButton,
            isLiked && communityStyles.likeButtonActive
          ]}
          onPress={handleLike}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={18}
            color="#28a745"
          />
          <Text style={[communityStyles.actionButtonText, communityStyles.likeButtonText]}>
            {localLikes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            communityStyles.actionButton,
            communityStyles.commentButton
          ]}
          onPress={onComment}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#007bff" />
          <Text style={[communityStyles.actionButtonText, communityStyles.commentButtonText]}>
            {post.total_comentarios || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={communityStyles.actionButton}
          onPress={() => {
            // TODO: Implementar compartir
            console.log('Compartir post:', post.id);
          }}
        >
          <Ionicons name="share-outline" size={18} color="#6c757d" />
        </TouchableOpacity>
      </View>

      {/* Sección de comentarios - TODO: Implementar */}
      {showComments && (
        <View style={communityStyles.commentsSection}>
          <Text style={communityStyles.secondaryText}>
            Los comentarios se mostrarán aquí...
          </Text>
        </View>
      )}
    </View>
  );
};

export default PostCard;