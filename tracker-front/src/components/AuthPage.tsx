import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Camera, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

interface AuthPageProps {
  onBack: () => void;
  initialEmail?: string;
  initialMode?: 'login' | 'register' | 'face';
  onSuccessfulLogin?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, initialEmail = '', initialMode = 'login', onSuccessfulLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'face'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [cameraState, setCameraState] = useState<'off' | 'starting' | 'ready' | 'error'>('off');
  const [, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: '',
    firstname: '',
    lastname: '',
    confirmPassword: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { login, register, loginWithGoogle, loginWithFaceNooxid, isLoading, error } = useAuth();

  // Limpiar cámara al desmontar el componente
  useEffect(() => {
    return () => {
      console.log('🧹 Limpiando cámara al desmontar componente');
      stopCamera();
    };
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const success = await login(formData.email, formData.password);
      console.log('Login result:', success);
      if (success && onSuccessfulLogin) {
        onSuccessfulLogin();
      }
    } else if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        return; // Handle password mismatch
      }
      const success = await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });
      console.log('Register result:', success);
      if (success && onSuccessfulLogin) {
        onSuccessfulLogin();
      }
    }
  };

  const handleGoogleLogin = async () => {
    // This would typically integrate with Google OAuth
    // For now, using mock data
    const mockGoogleData = {
      email: 'usuario@gmail.com',
      googleid: 'google_123456789',
      firstname: 'Usuario',
      lastname: 'Demo'
    };
    
    const success = await loginWithGoogle(mockGoogleData);
    console.log('Google login result:', success);
  };

  const handleFaceLogin = async () => {
    if (!formData.email) {
      alert('Por favor ingresa tu email primero');
      return;
    }
    
    console.log('🎥 Iniciando captura facial...');
    // Mostrar el modal de captura facial
    setShowFaceCapture(true);
    // Iniciar cámara inmediatamente después de abrir el modal
    setTimeout(async () => {
      await startCamera();
    }, 200);
  };

  // Remover el useEffect problemático que estaba causando el conflicto

  const startCamera = async () => {
    try {
      console.log('📹 Iniciando cámara...');
      console.log('📺 Elemento video disponible:', !!videoRef.current);
      setCameraState('starting');
      setCameraError(null);
      
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara');
      }
      
      console.log('🔍 Solicitando acceso a la cámara...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('✅ Stream de cámara obtenido:', stream);
      console.log('📺 Tracks activos:', stream.getVideoTracks().length);
      
      // Como el elemento video siempre existe, no necesitamos verificar si existe
      console.log('📺 Asignando stream al elemento video...');
      videoRef.current!.srcObject = stream;
      
      // Función que se ejecuta cuando el video está listo
      const handleVideoReady = () => {
        console.log('🎬 Video ready! Cambiando estado a ready');
        console.log('📏 Dimensiones del video:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
        setCameraState('ready');
      };
      
      // Múltiples eventos para detectar cuando está listo
      videoRef.current!.addEventListener('loadedmetadata', handleVideoReady);
      videoRef.current!.addEventListener('canplay', handleVideoReady);
      videoRef.current!.addEventListener('playing', handleVideoReady);
      
      // Error handler
      videoRef.current!.addEventListener('error', (e) => {
        console.error('❌ Error en el elemento video:', e);
        setCameraError('Error al cargar el video');
        setCameraState('error');
      });
      
      try {
        console.log('▶️ Intentando reproducir video...');
        const playPromise = videoRef.current!.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Video en reproducción');
        }
        
        // Fallback más agresivo con verificaciones
        setTimeout(() => {
          if (videoRef.current) {
            console.log('⏰ Verificando estado después de 500ms...');
            console.log('📏 Dimensiones actuales:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
            console.log('🎮 Estado actual:', cameraState);
            console.log('📺 ReadyState:', videoRef.current.readyState);
            
            if (videoRef.current.readyState >= 3) { // HAVE_FUTURE_DATA
              console.log('🔄 Forzando estado ready por readyState');
              setCameraState('ready');
            } else if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
              console.log('🔄 Forzando estado ready por dimensiones');
              setCameraState('ready');
            }
          }
        }, 500);
        
        // Segundo fallback aún más tarde
        setTimeout(() => {
          if (videoRef.current && cameraState === 'starting') {
            console.log('🔄 Segundo fallback - forzando ready sin condiciones');
            setCameraState('ready');
          }
        }, 2000);
        
      } catch (playError) {
        console.error('❌ Error al reproducir video:', playError);
        // Intentar reproducir de nuevo tras un breve delay
        setTimeout(async () => {
          if (videoRef.current) {
            console.log('🔁 Reintentando reproducción...');
            try {
              await videoRef.current.play();
              console.log('✅ Reproducción exitosa en segundo intento');
            } catch (retryError) {
              console.error('❌ Error en segundo intento:', retryError);
            }
          }
        }, 500);
      }
    } catch (error) {
      console.error('💥 Error general en startCamera:', error);
      setCameraState('error');
      setCameraError(
        error instanceof Error 
          ? `Error al acceder a la cámara: ${error.message}` 
          : 'No se pudo acceder a la cámara. Verifica los permisos.'
      );
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || cameraState !== 'ready') return;

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }

      // Configurar canvas con las dimensiones del video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Dibujar el frame actual del video
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir a base64
      const base64String = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(base64String);

      // Detener la cámara
      stopCamera();

      // Proceder con el login facial usando el flujo de endpoints nooxid
      if (formData.email) {
        const success = await loginWithFaceNooxid(formData.email);
        console.log('Face login (nooxid) result:', success);
        if (success) {
          setShowFaceCapture(false);
          setCapturedImage(null);
          if (onSuccessfulLogin) {
            onSuccessfulLogin();
          }
        }
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      setCameraError('Error al capturar la imagen');
    }
  };

  const stopCamera = () => {
    console.log('🛑 Deteniendo cámara...');
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      console.log('📹 Deteniendo tracks de video:', stream.getTracks().length);
      stream.getTracks().forEach(track => {
        console.log('⏹️ Deteniendo track:', track.kind);
        track.stop();
      });
      videoRef.current.srcObject = null;
      
      // Limpiar event listeners usando removeEventListener
      videoRef.current.removeEventListener('loadedmetadata', () => {});
      videoRef.current.removeEventListener('canplay', () => {});
      videoRef.current.removeEventListener('playing', () => {});
      videoRef.current.removeEventListener('error', () => {});
    }
    setCameraState('off');
    setCameraError(null);
    console.log('✅ Cámara detenida');
  };

  const closeFaceCapture = () => {
    stopCamera();
    setShowFaceCapture(false);
    setCapturedImage(null);
    setCameraError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          onClick={onBack}
          className="btn btn-secondary"
          style={{ position: 'absolute', top: '20px', left: '20px' }}
        >
          <ArrowLeft size={20} />
        </button>
        
        <motion.div
          className="sidebar-logo"
          style={{ margin: '0 auto 20px' }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          N
        </motion.div>
        
        <h2 className="auth-title">
          {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Registrarse' : 'Login Facial'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Ingresa a tu cuenta' : mode === 'register' ? 'Crea tu nueva cuenta' : 'Usa tu rostro para ingresar'}
        </p>

        {error && (
          <motion.div
          className="auth-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setMode('login')}
              className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              Registro
            </button>
            <button
              onClick={() => setMode('face')}
              className={`btn ${mode === 'face' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              Facial
            </button>
          </div>
        </div>

        {mode !== 'face' && (
          <form onSubmit={handleEmailLogin} style={{ width: '100%' }}>
            {mode === 'register' && (
              <>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Nombre"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="auth-input"
                  style={{
                    marginBottom: '15px'
                  }}
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Apellido"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="auth-input"
                  style={{
                    marginBottom: '15px'
                  }}
                  required
                />
              </>
            )}
            
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleInputChange}
              className="auth-input"
              style={{
                marginBottom: '15px'
              }}
              required
            />
            
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="auth-input"
                style={{
                  paddingRight: '45px'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {mode === 'register' && (
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="auth-input"
                style={{
                  marginBottom: '15px'
                }}
                required
              />
            )}
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '15px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? 'Procesando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </motion.button>
          </form>
        )}

        {mode === 'face' && (
          <div style={{ width: '100%' }}>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico (para identificarte)"
              value={formData.email}
              onChange={handleInputChange}
              className="auth-input"
              style={{
                marginBottom: '15px'
              }}
              required
            />
            <motion.button
              onClick={handleFaceLogin}
              disabled={isLoading || !formData.email}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '15px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? 'Analizando...' : '📷 Usar Reconocimiento Facial'}
            </motion.button>
          </div>
        )}
        
        <div style={{ margin: '20px 0', textAlign: 'center', color: '#6b7280' }}>
          o
        </div>
        
        <motion.button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="google-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <motion.div
              style={{ width: '20px', height: '20px', border: '2px solid #333', borderTop: '2px solid #4285f4', borderRadius: '50%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {isLoading ? 'Conectando...' : 'Continuar con Google'}
        </motion.button>
      </motion.div>

      {/* Modal de Captura Facial */}
      {showFaceCapture && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              backdropFilter: 'blur(4px)',
              border: '1px solid #374151',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={closeFaceCapture}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={24} />
            </button>

            <h3 style={{ color: '#ffffff', marginBottom: '8px', textAlign: 'center', fontSize: '24px', fontWeight: 700 }}>
              Reconocimiento Facial
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '20px', textAlign: 'center', fontSize: '16px' }}>
              Posiciona tu rostro en el centro de la cámara y haz clic en "Capturar"
            </p>
            
            {/* Debug info */}
            <div style={{ marginBottom: '10px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
              Estado: {cameraState} | Email: {formData.email}
              <br />
              Video ref: {videoRef.current ? 'OK' : 'NULL'} | 
              Stream: {videoRef.current?.srcObject ? 'OK' : 'NULL'}
              <br />
              Dimensiones: {videoRef.current?.videoWidth || 0}x{videoRef.current?.videoHeight || 0}
            </div>

            <div style={{ 
              width: '100%', 
              height: '300px', 
              backgroundColor: 'rgba(55, 65, 81, 0.5)', 
              borderRadius: '12px',
              border: '1px solid #4b5563',
              marginBottom: '20px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Video siempre presente en el DOM */}
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                  visibility: cameraState === 'ready' ? 'visible' : 'hidden'
                }}
                autoPlay
                muted
                playsInline
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Botón de capturar siempre presente pero solo visible cuando ready */}
              {cameraState === 'ready' && (
                <motion.button
                  onClick={capturePhoto}
                  disabled={isLoading}
                  style={{ 
                    position: 'absolute', 
                    bottom: '16px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    padding: '12px 24px',
                    background: 'linear-gradient(to right, #06b6d4, #9333ea)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 10
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Camera size={20} />
                  {isLoading ? 'Analizando...' : 'Capturar Foto'}
                </motion.button>
              )}

              {/* Overlay para estado "starting" */}
              {cameraState === 'starting' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(55, 65, 81, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5
                }}>
                  <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                    <motion.div
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        border: '4px solid #374151', 
                        borderTop: '4px solid #4285f4', 
                        borderRadius: '50%',
                        margin: '0 auto 16px'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p>Iniciando cámara...</p>
                  </div>
                </div>
              )}

              {/* Overlay para estado "error" */}
              {cameraState === 'error' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(55, 65, 81, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5
                }}>
                  <div style={{ textAlign: 'center', color: '#ef4444' }}>
                    <X size={48} style={{ marginBottom: '16px' }} />
                    <p>Error al acceder a la cámara</p>
                    {cameraError && (
                      <p style={{ fontSize: '12px', marginTop: '8px' }}>{cameraError}</p>
                    )}
                    <motion.button
                      onClick={startCamera}
                      style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        backgroundColor: 'rgba(55, 65, 81, 0.5)',
                        color: '#d1d5db',
                        border: '1px solid #4b5563',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '12px auto'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RefreshCw size={16} />
                      Reintentar
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Overlay para estado inicial "off" */}
              {cameraState === 'off' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(55, 65, 81, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5
                }}>
                  <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                    <Camera size={48} style={{ marginBottom: '16px' }} />
                    <p>Preparando cámara...</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={closeFaceCapture}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(55, 65, 81, 0.5)',
                  color: '#d1d5db',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AuthPage;
