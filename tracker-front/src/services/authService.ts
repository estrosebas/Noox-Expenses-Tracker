import { API_CONFIG, getAuthHeaders, handleApiResponse } from './api';
import type { ApiResponse, User } from './api';

export class AuthService {
  // Verificar si existe el usuario por email
  static async verifyExist(email: string): Promise<{ exists: boolean }> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verifyexist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  }

  // Registrar usuario por token facial (token = email en base64)
  static async registerByFace(data: { tokennooxid: string; nombre: string; apellido: string; correo: string }): Promise<any> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/registerbyface`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Login usuario por token facial (token = email en base64)
  static async loginByFace(tokennooxid: string): Promise<any> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/loginbyface`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokennooxid })
    });
    return response.json();
  }
  
  // Registrar nuevo usuario
  static async register(userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    base64imageprofile?: string;
  }): Promise<ApiResponse<User>> {
    // El backend espera nombre, apellido, correo
    const payload = {
      nombre: userData.firstname,
      apellido: userData.lastname,
      correo: userData.email,
      password: userData.password,
      ...(userData.base64imageprofile ? { base64imageprofile: userData.base64imageprofile } : {})
    };
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleApiResponse(response);
  }

  // Login tradicional
  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }> | { redirectToRegister: boolean }> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleApiResponse(response);
    // Guardar token automáticamente
    if (data.success && data.token) {
      localStorage.setItem('noox_token', String(data.token));
      localStorage.setItem('noox_user', JSON.stringify(data.user));
    }
    return data;
  }

  // Login facial
  static async faceLogin(loginData: {
    email: string;
    face_image: string;
  }): Promise<ApiResponse<{ user: User; token: string; face_verification: any }>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_FACE_LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    
    const data = await handleApiResponse(response);
    
    // Guardar token automáticamente
    if (data.success && data.token) {
      localStorage.setItem('noox_token', String(data.token));
      localStorage.setItem('noox_user', JSON.stringify(data.user));
    }
    
    return data;
  }

  // Autenticación con Google
  static async googleAuth(googleData: {
    firstname?: string;
    lastname?: string;
    email: string;
    googleid: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_GOOGLE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleData)
    });
    
    const data = await handleApiResponse(response);
    
    // Guardar token automáticamente
    if (data.success && data.token) {
      localStorage.setItem('noox_token', String(data.token));
      localStorage.setItem('noox_user', JSON.stringify(data.user));
    }
    
    return data;
  }

  // Verificar token
  static async verifyToken(): Promise<ApiResponse<{ user: User; valid: boolean }>> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_VERIFY_TOKEN}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    return handleApiResponse(response);
  }

  // Logout
  static logout(): void {
    localStorage.removeItem('noox_token');
    localStorage.removeItem('noox_user');
  }

  // Obtener usuario desde localStorage
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('noox_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtener token desde localStorage
  static getToken(): string | null {
    return localStorage.getItem('noox_token');
  }

  // Verificar si está autenticado
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
