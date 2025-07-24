import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import type { User } from '../services/api';

type LoginResult = boolean | 'redirectToRegister';
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginWithGoogle: (googleData: {
    firstname?: string;
    lastname?: string;
    email: string;
    googleid: string;
  }) => Promise<boolean>;
  loginWithFace: (email: string, faceImage: string) => Promise<boolean>;
  loginWithFaceNooxid: (email: string) => Promise<boolean>;
  register: (userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    base64imageprofile?: string;
  }) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay un token guardado al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('noox_token');
      console.log('🔐 Checking auth on app load...');
      console.log('🔑 Token exists:', !!token);
      
      if (token) {
        try {
          console.log('📡 Verifying token with backend...');
          const isValid = await AuthService.verifyToken();
          console.log('✅ Token verification result:', isValid);
          
          if (isValid.success) {
            // Token válido, obtener perfil del usuario
            console.log('👤 Token valid, loading user profile...');
            await refreshProfile();
          } else {
            // Token inválido, limpiar storage
            console.log('❌ Token invalid, clearing storage...');
            localStorage.removeItem('noox_token');
          }
        } catch (error) {
          console.error('💥 Error checking auth:', error);
          console.log('🧹 Clearing token due to error...');
          localStorage.removeItem('noox_token');
        }
      } else {
        console.log('ℹ️ No token found, user not authenticated');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.login({ email, password });
      console.log('Login service response:', response);
      if (typeof response === 'object' && 'redirectToRegister' in response && response.redirectToRegister) {
        setIsLoading(false);
        return 'redirectToRegister';
      }
      if (typeof response === 'object' && 'success' in response && response.success && response.token) {
        localStorage.setItem('noox_token', String(response.token));
        // Si el usuario viene en la respuesta, lo seteamos; si no, lo pedimos al backend
        if (response.user) {
          setUser(response.user);
        } else {
          // Pedir perfil al backend
          try {
            const profileResp = await UserService.getCurrentProfile();
            if (profileResp.success && profileResp.user) {
              setUser(profileResp.user);
            } else {
              setUser(null);
            }
          } catch (e) {
            setUser(null);
          }
        }
        setIsLoading(false);
        return true;
      } else {
        setError((response as any).message || 'Error en el login');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error de conexión');
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (googleData: {
    firstname?: string;
    lastname?: string;
    email: string;
    googleid: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.googleAuth(googleData);
      if (response.success && response.token && response.user) {
        localStorage.setItem('noox_token', String(response.token));
        setUser(response.user);
        setIsLoading(false);
        return true;
      } else {
        setError(response.message || 'Error en el login con Google');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error de conexión');
      setIsLoading(false);
      return false;
    }
  };

  const loginWithFace = async (email: string, faceImage: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.faceLogin({ email, face_image: faceImage });
      if (response.success && response.token && response.user) {
        localStorage.setItem('noox_token', String(response.token));
        setUser(response.user);
        setIsLoading(false);
        return true;
      } else {
        setError(response.message || 'No se pudo autenticar con reconocimiento facial');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error de conexión');
      setIsLoading(false);
      return false;
    }
  };

  // Login/registro facial usando los endpoints /verifyexist, /registerbyface, /loginbyface
  const loginWithFaceNooxid = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Verificar si existe el usuario
      const verifyRes = await AuthService.verifyExist(email);
      // 2. Codificar el correo en base64
      const tokennooxid = btoa(email);
      let loginRes;
      if (verifyRes.exists) {
        // 3a. Si existe, loginByFace
        loginRes = await AuthService.loginByFace(tokennooxid);
      } else {
        // 3b. Si no existe, registerByFace y luego loginByFace
        // Para demo: usar email como nombre y apellido si no hay datos reales
        const [nombre, apellido] = email.split('@')[0].split('.')
          .length === 2
          ? email.split('@')[0].split('.')
          : [email.split('@')[0], email.split('@')[0]];
        await AuthService.registerByFace({
          tokennooxid,
          nombre,
          apellido,
          correo: email
        });
        loginRes = await AuthService.loginByFace(tokennooxid);
      }
      if (loginRes && loginRes.access_token) {
        localStorage.setItem('noox_token', String(loginRes.access_token));
        // Opcional: setUser si el backend lo retorna
        setIsLoading(false);
        return true;
      } else {
        setError(loginRes?.message || 'No se pudo autenticar con reconocimiento facial');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error de conexión');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    base64imageprofile?: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.register(userData);
      if (response.success) {
        // Registro exitoso, ahora hacer login automáticamente
        const loginResponse = await AuthService.login({ 
          email: userData.email, 
          password: userData.password 
        });
        if (typeof loginResponse === 'object' && 'success' in loginResponse && loginResponse.success && loginResponse.token && loginResponse.user) {
          localStorage.setItem('noox_token', String(loginResponse.token));
          setUser(loginResponse.user);
          setIsLoading(false);
          return true;
        } else {
          setError('Usuario registrado pero error en login automático');
          setIsLoading(false);
          return false;
        }
      } else {
        setError(response.message || 'Error en el registro');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'Error de conexión');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('noox_token');
    setUser(null);
    setError(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await UserService.getCurrentProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    loginWithFace,
    loginWithFaceNooxid,
    register,
    logout,
    refreshProfile,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
