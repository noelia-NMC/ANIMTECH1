// Mobile/src/services/socialService.js - CORREGIDO
import http from './http'; // TU HTTP EXISTENTE

const socialService = {
  /**
   * Obtener feed de publicaciones
   */
  getFeed: async (page = 1, limit = 10) => {
    try {
      const response = await http.get(`/api/social/feed?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: {
          posts: response.data.posts || [],
          pagination: response.data.pagination || {}
        }
      };
    } catch (error) {
      console.error('Error al obtener feed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar las publicaciones'
      };
    }
  },

  /**
   * Crear nueva publicación
   */
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      
      formData.append('mascota_id', postData.mascota_id);
      formData.append('contenido', postData.contenido);
      
      if (postData.tipo_post) {
        formData.append('tipo_post', postData.tipo_post);
      }

      if (postData.imagen) {
        formData.append('imagen', {
          uri: postData.imagen.uri,
          type: postData.imagen.type || 'image/jpeg',
          name: postData.imagen.fileName || `post_${Date.now()}.jpg`
        });
      }

      const response = await http.post('/api/social/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al crear post:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear la publicación'
      };
    }
  },

  /**
   * Dar/quitar like
   */
  toggleLike: async (postId) => {
    try {
      const response = await http.post(`/api/social/posts/${postId}/like`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al procesar like:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al procesar el like'
      };
    }
  },

  /**
   * Agregar comentario
   */
  addComment: async (postId, contenido) => {
    try {
      const response = await http.post(`/api/social/posts/${postId}/comments`, {
        contenido
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al agregar el comentario'
      };
    }
  },

  /**
   * Obtener comentarios
   */
  getComments: async (postId, page = 1, limit = 20) => {
    try {
      const response = await http.get(`/api/social/posts/${postId}/comments?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: {
          comentarios: response.data.comentarios || [],
          pagination: response.data.pagination || {}
        }
      };
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar los comentarios'
      };
    }
  },

  /**
   * Obtener publicaciones de una mascota
   */
  getPostsByPet: async (mascotaId, page = 1, limit = 10) => {
    try {
      const response = await http.get(`/api/social/posts/mascota/${mascotaId}?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: {
          posts: response.data.posts || [],
          pagination: response.data.pagination || {}
        }
      };
    } catch (error) {
      console.error('Error al obtener posts de mascota:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar las publicaciones'
      };
    }
  },

  /**
   * Eliminar publicación
   */
  deletePost: async (postId) => {
    try {
      const response = await http.delete(`/api/social/posts/${postId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar post:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar la publicación'
      };
    }
  }
};

export default socialService;