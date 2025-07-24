import { API_CONFIG, getAuthHeaders, handleApiResponse } from './api';
import type { ApiResponse, User } from './api';

export class UserService {
  
  // Obtener perfil del usuario actual
  static async getCurrentProfile(): Promise<User> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_PROFILE}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const apiResp = await handleApiResponse(response);
    // Si el backend retorna el usuario como objeto raíz
    let user: User | undefined;
    if (apiResp && typeof apiResp === 'object' && 'id' in apiResp) {
      user = apiResp as User;
    } else if (apiResp && apiResp.user && typeof apiResp.user === 'object' && 'id' in apiResp.user) {
      user = apiResp.user as User;
    }
    console.log('[UserService] getCurrentProfile raw response:', apiResp);
    if (user && user.id) {
      const mappedUser: User = {
        ...user,
        name: `${user.nombre || ''} ${user.apellido || ''}`.trim(),
        email: user.correo,
        profile_img_url: user.profile_img_url
      };
      console.log('[UserService] getCurrentProfile mappedUser:', mappedUser);
      localStorage.setItem('noox_user', JSON.stringify(mappedUser));
      return mappedUser;
    }
    throw new Error('No user found in profile response');
  }

  // Actualizar perfil del usuario actual
  static async updateProfile(userData: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    base64imageprofile?: string;
  }): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_PROFILE}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await handleApiResponse(response);
    // Actualizar datos del usuario en localStorage si es exitoso y mapear formato
    if (data.success && data.user) {
      const mappedUser = {
        ...data.user,
        name: `${data.user.nombre || ''} ${data.user.apellido || ''}`.trim(),
        email: data.user.correo,
        profile_img_url: data.user.profile_img_url
      };
      localStorage.setItem('noox_user', JSON.stringify(mappedUser));
      data.user = mappedUser;
    }
    return data;
  }

  // Obtener usuario por ID
  static async getUserById(id: number): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleApiResponse(response);
  }

  // Obtener todos los usuarios (paginado)
  static async getAllUsers(page = 1, perPage = 10): Promise<ApiResponse<{ users: User[]; total: number; pages: number }>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}?page=${page}&per_page=${perPage}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleApiResponse(response);
  }

  // Buscar usuarios por email
  static async searchUserByEmail(email: string): Promise<ApiResponse<{ users: User[] }>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_SEARCH}?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleApiResponse(response);
  }

  // Subir imagen facial
  static async uploadFaceImage(base64Image: string): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_UPLOAD_FACE}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ base64imageprofile: base64Image })
    });
    const data = await handleApiResponse(response);
    // Actualizar datos del usuario en localStorage si es exitoso y mapear formato
    if (data.success && data.user) {
      const mappedUser = {
        ...data.user,
        name: `${data.user.nombre || ''} ${data.user.apellido || ''}`.trim(),
        email: data.user.correo,
        profile_img_url: data.user.profile_img_url
      };
      localStorage.setItem('noox_user', JSON.stringify(mappedUser));
      data.user = mappedUser;
    }
    return data;
  }

  // Verificar rostro del usuario actual
  static async verifyFace(faceImage: string): Promise<ApiResponse<{ verification_result: any }>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_VERIFY_FACE}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ face_image: faceImage })
    });
    
    return handleApiResponse(response);
  }

  // Eliminar usuario actual
  static async deleteCurrentUser(): Promise<ApiResponse> {
    const user = JSON.parse(localStorage.getItem('noox_user') || '{}');
    if (!user.id) throw new Error('No user found');

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${user.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    const data = await handleApiResponse(response);
    
    // Limpiar localStorage si es exitoso
    if (data.success) {
      localStorage.removeItem('noox_token');
      localStorage.removeItem('noox_user');
    }
    
    return data;
  }
}
