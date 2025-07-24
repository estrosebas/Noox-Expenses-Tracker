import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  useEffect(() => {
    if (location.state && location.state.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    setIsLoading(true);
    try {
      // Dividir nombre completo en firstname y lastname
      const [firstname, ...rest] = formData.name.trim().split(' ');
      const lastname = rest.join(' ') || firstname;
      const success = await register({
        firstname,
        lastname,
        email: formData.email,
        password: formData.password
      });
      if (success) navigate('/dashboard');
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="register-page__container"
      >
        {/* Back to home */}
        <Link 
          to="/" 
          className="register-page__back-link"
        >
          <ArrowLeft className="register-page__back-icon" />
          Volver al inicio
        </Link>

        {/* Logo */}
        <div className="register-page__brand">
          <div className="register-page__brand-icon">
            <Zap className="register-page__brand-icon-svg" />
          </div>
          <span className="register-page__brand-text">Noox</span>
        </div>

        {/* Card */}
        <div className="register-page__card">
          <div className="register-page__header">
            <h1 className="register-page__title">Crear cuenta</h1>
            <p className="register-page__subtitle">Comienza a controlar tus gastos hoy</p>
          </div>

          <form onSubmit={handleSubmit} className="register-page__form">
            {/* Name Field */}
            <div className="register-page__form-group">
              <label htmlFor="name" className="register-page__label">
                Nombre completo
              </label>
              <div className="register-page__input-container">
                <User className="register-page__input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="register-page__input register-page__input--with-icon"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="register-page__form-group">
              <label htmlFor="email" className="register-page__label">
                Correo electrónico
              </label>
              <div className="register-page__input-container">
                <Mail className="register-page__input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="register-page__input register-page__input--with-icon"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="register-page__form-group">
              <label htmlFor="password" className="register-page__label">
                Contraseña
              </label>
              <div className="register-page__input-container">
                <Lock className="register-page__input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="register-page__input register-page__input--with-icon register-page__input--with-button"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="register-page__toggle-password"
                >
                  {showPassword ? <EyeOff className="register-page__toggle-icon" /> : <Eye className="register-page__toggle-icon" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="register-page__form-group">
              <label htmlFor="confirmPassword" className="register-page__label">
                Confirmar contraseña
              </label>
              <div className="register-page__input-container">
                <Lock className="register-page__input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="register-page__input register-page__input--with-icon register-page__input--with-button"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="register-page__toggle-password"
                >
                  {showConfirmPassword ? <EyeOff className="register-page__toggle-icon" /> : <Eye className="register-page__toggle-icon" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="register-page__terms">
              <input
                type="checkbox"
                className="register-page__checkbox"
                required
              />
              <span className="register-page__terms-text">
                Acepto los{' '}
                <Link to="#" className="register-page__terms-link">
                  términos y condiciones
                </Link>{' '}
                y la{' '}
                <Link to="#" className="register-page__terms-link">
                  política de privacidad
                </Link>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="register-page__submit-button"
            >
              {isLoading ? (
                <div className="register-page__loading">
                  <div className="register-page__spinner"></div>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="register-page__footer">
            <p className="register-page__footer-text">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="register-page__signin-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export { RegisterPage };