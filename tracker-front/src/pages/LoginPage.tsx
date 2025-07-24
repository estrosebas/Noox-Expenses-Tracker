import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowLeft, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result === 'redirectToRegister') {
        navigate('/register', { state: { email } });
        return;
      }
      if (result) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceLogin = () => {
    if (!email.trim()) {
      alert('Por favor ingresa tu correo electrónico primero');
      return;
    }
    // Redirect directly to face login page instead of showing modal
    navigate(`/face-login?email=${encodeURIComponent(email)}`);
  };


  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="login-page__container"
      >
        {/* Back to home */}
        <Link 
          to="/" 
          className="login-page__back-link"
        >
          <ArrowLeft className="login-page__back-icon" />
          Volver al inicio
        </Link>

        {/* Logo */}
        <div className="login-page__brand">
          <div className="login-page__brand-icon">
            <Zap className="login-page__brand-icon-svg" />
          </div>
          <span className="login-page__brand-text">Noox</span>
        </div>

        {/* Card */}
        <div className="login-page__card">
          <div className="login-page__header">
            <h1 className="login-page__title">Bienvenido</h1>
            <p className="login-page__subtitle">Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="login-page__form">
            {/* Email Field */}
            <div className="login-page__form-group">
              <label htmlFor="email" className="login-page__label">
                Correo electrónico
              </label>
              <div className="login-page__input-container">
                <Mail className="login-page__input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-page__input login-page__input--with-icon"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-page__form-group">
              <label htmlFor="password" className="login-page__label">
                Contraseña
              </label>
              <div className="login-page__input-container">
                <Lock className="login-page__input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-page__input login-page__input--with-icon login-page__input--with-button"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-page__toggle-password"
                >
                  {showPassword ? <EyeOff className="login-page__toggle-icon" /> : <Eye className="login-page__toggle-icon" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="login-page__options">
              <label className="login-page__checkbox-label">
                <input
                  type="checkbox"
                  className="login-page__checkbox"
                />
                <span className="login-page__checkbox-text">Recordarme</span>
              </label>
              <Link to="#" className="login-page__forgot-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-page__submit-button"
            >
              {isLoading ? (
                <div className="login-page__loading">
                  <div className="login-page__spinner"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Face Login Button */}
            <button
              type="button"
              onClick={handleFaceLogin}
              className="login-page__face-login-button"
              disabled={isLoading}
            >
              <Camera size={18} />
              Acceder con Reconocimiento Facial
            </button>
          </form>

          {/* Sign up link */}
          <div className="login-page__footer">
            <p className="login-page__footer-text">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="login-page__signup-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Face Login Modal - Removed in favor of direct redirection */}
    </div>
  );
};