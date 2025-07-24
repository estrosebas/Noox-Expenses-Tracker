// Configuración base de la API
export const API_CONFIG = {
  // el noox expenses tracker es 8000 y el noox id es 5000
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  BASE_URLFACE: import.meta.env.VITE_API_URLFACE || 'http://localhost:5000',
  
  ENDPOINTS: {
    // Auth
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGIN: '/auth/login',
    AUTH_FACE_LOGIN: '/api/auth/face-login',
    AUTH_VERIFY_TOKEN: '/api/auth/verify-token',
    AUTH_GOOGLE: '/api/auth/google-auth',
    
    // Users
    USERS: '/api/users',
    USER_PROFILE: '/api/users/profile',
    USER_UPLOAD_FACE: '/api/users/upload-face',
    USER_VERIFY_FACE: '/api/users/verify-face',
    USER_SEARCH: '/api/users/search',
    
    // Apps
    APPS: '/api/apps',
    APP_REGENERATE_KEY: (id: string) => `/api/apps/${id}/regenerate-key`,
    APP_USERS: (id: string) => `/api/apps/${id}/users`,
    
    // Tokens
    TOKENS: '/api/apps/tokens',
    TOKEN_VALIDATE: (id: string) => `/api/apps/tokens/${id}/validate`,
    
    // Face Recognition
    FACE_COMPARE: '/api/face/compare',
    FACE_VERIFY_USER: '/api/face/verify-user',
    FACE_EXTRACT_ENCODING: '/api/face/extract-encoding',
    FACE_PROCESS_PROFILE: '/api/face/process-profile-image',
    FACE_TOLERANCE: '/api/face/tolerance',
    
    // Health
    HEALTH: '/api/health'
  }
};

// Tipos de datos
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
  ProfilePickPath?: string;
  created_at?: string;
  updated_at?: string;
}

export interface App {
  id: number;
  name_app: string;
  owner: number;
  api_key: string;
  last_edit?: string;
  created_at?: string;
  is_verified: boolean;
  IconAppPath?: string;
}

export interface Token {
  id: number;
  id_usuario: number;
  profilePick: boolean;
  email: boolean;
  created_at?: string;
  expires_at?: string;
}

export interface FaceComparison {
  match: boolean;
  distance: number;
  confidence: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  users?: User[];
  app?: App;
  apps?: App[];
  token?: Token;
  tokens?: Token[];
  comparison?: FaceComparison;
  verification?: FaceComparison;
  total?: number;
  pages?: number;
  current_page?: number;
}

// Headers de autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('noox_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Headers para API key
export const getApiKeyHeaders = (apiKey: string, appId: string) => ({
  'Content-Type': 'application/json',
  'X-API-Key': apiKey,
  'X-App-ID': appId
});

// Manejo de errores de la API
export class ApiError extends Error {
  status: number;
  response?: any;

  constructor(
    message: string,
    status: number,
    response?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Helper para manejar respuestas de la API
export const handleApiResponse = async (response: Response): Promise<ApiResponse> => {
  try {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data
      });
      
      throw new ApiError(
        data.message || `HTTP Error ${response.status}`,
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Error de red/CORS
    console.error('🌐 Network/CORS Error:', error);
    throw new ApiError(
      'Error de conexión. Verifica que el servidor esté ejecutándose.',
      0,
      { originalError: error }
    );
  }
};
