import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  TrendingUp, 
  PieChart, 
  Smartphone, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Mail className="home-page__feature-icon-svg" />,
      title: "Análisis Automático de Emails",
      description: "Conecta tu correo y detecta automáticamente recibos de Yape, Plin y otros servicios"
    },
    {
      icon: <TrendingUp className="home-page__feature-icon-svg" />,
      title: "Seguimiento en Tiempo Real",
      description: "Registra y categoriza tus gastos al instante sin intervención manual"
    },
    {
      icon: <PieChart className="home-page__feature-icon-svg" />,
      title: "Reportes Visuales",
      description: "Gráficas interactivas que te ayudan a entender tus patrones de gasto"
    },
    {
      icon: <Smartphone className="home-page__feature-icon-svg" />,
      title: "Multiplataforma",
      description: "Accede desde cualquier dispositivo, siempre sincronizado"
    }
  ];

  const benefits = [
    "Control total sobre gastos hormiga",
    "Identificación automática de transacciones",
    "Reportes personalizados y detallados",
    "Interfaz intuitiva y moderna",
    "Seguridad y privacidad garantizada"
  ];

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="home-page__nav">
        <div className="home-page__nav-container">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="home-page__brand"
          >
            <div className="home-page__brand-icon">
              <Zap className="home-page__brand-icon-svg" />
            </div>
            <span className="home-page__brand-text">Noox</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="home-page__nav-links"
          >
            <Link 
              to="/login" 
              className="home-page__nav-link"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="home-page__nav-btn"
            >
              Registrarse
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-page__hero">
        <div className="home-page__hero-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="home-page__hero-title">
              Controla tus
              <span className="home-page__hero-highlight">
                {" "}gastos{" "}
              </span>
              automáticamente
            </h1>
            <p className="home-page__hero-subtitle">
              Noox analiza tus emails automáticamente, detecta recibos de pago y registra cada gasto. 
              Di adiós a los gastos hormiga que afectan tu economía personal.
            </p>
            <div className="home-page__hero-buttons">
              <Link 
                to="/register" 
                className="home-page__hero-cta"
              >
                Comenzar Gratis
                <ArrowRight className="home-page__hero-cta-icon" />
              </Link>
              <Link 
                to="#features" 
                className="home-page__hero-secondary-btn"
              >
                Ver Características
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="home-page__features">
        <div className="home-page__features-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="home-page__features-header"
          >
            <h2 className="home-page__features-title">
              ¿Cómo funciona Noox?
            </h2>
            <p className="home-page__features-subtitle">
              Tecnología avanzada que simplifica el control de tus finanzas personales
            </p>
          </motion.div>

          <div className="home-page__features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="home-page__feature-card"
              >
                <div className="home-page__feature-icon">
                  {feature.icon}
                </div>
                <h3 className="home-page__feature-title">
                  {feature.title}
                </h3>
                <p className="home-page__feature-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="home-page__benefits">
        <div className="home-page__benefits-container">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="home-page__benefits-content"
          >
            <h2 className="home-page__benefits-title">
              Transforma tu relación con el dinero
            </h2>
            <ul className="home-page__benefits-list">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="home-page__benefit-item"
                >
                  <CheckCircle className="home-page__benefit-icon" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="home-page__benefits-card"
          >
            <div className="home-page__security-card">
              <div className="home-page__security-header">
                <Shield className="home-page__security-icon" />
                <span className="home-page__security-label">Seguro y Privado</span>
              </div>
              <h3 className="home-page__security-title">
                Tus datos están protegidos
              </h3>
              <p className="home-page__security-description">
                Utilizamos encriptación de extremo a extremo y nunca almacenamos 
                información sensible de tus cuentas bancarias.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-page__cta">
        <div className="home-page__cta-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="home-page__cta-content"
          >
            <h2 className="home-page__cta-title">
              ¿Listo para tomar control de tus finanzas?
            </h2>
            <p className="home-page__cta-subtitle">
              Únete a miles de usuarios que ya han mejorado su salud financiera con Noox
            </p>
            <Link 
              to="/register" 
              className="home-page__cta-button"
            >
              Comenzar Ahora
              <ArrowRight className="home-page__cta-button-icon" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-page__footer">
        <div className="home-page__footer-container">
          <div className="home-page__footer-brand">
            <div className="home-page__footer-brand-icon">
              <Zap className="home-page__footer-brand-icon-svg" />
            </div>
            <span className="home-page__footer-brand-text">Noox</span>
          </div>
          <p className="home-page__footer-copyright">
            © 2025 Noox Expenses Tracker. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};