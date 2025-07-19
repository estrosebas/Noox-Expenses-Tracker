import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Download,
  Trash2,
  Save,
  Phone,
  DollarSign
} from 'lucide-react';
import './Settings.css';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: true
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'data', label: 'Datos', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-form-grid">
            <div className="settings-form-group">
              <label className="settings-form-label">
                Nombre completo
              </label>
              <div className="settings-form-input-container">
                <User className="settings-form-icon" />
                <input
                  type="text"
                  defaultValue="Juan Pérez"
                  className="settings-form-input"
                />
              </div>
            </div>
            <div className="settings-form-group">
              <label className="settings-form-label">
                Correo electrónico
              </label>
              <div className="settings-form-input-container">
                <Mail className="settings-form-icon" />
                <input
                  type="email"
                  defaultValue="juan@example.com"
                  className="settings-form-input"
                />
              </div>
            </div>
            <div className="settings-form-group">
              <label className="settings-form-label">
                Teléfono
              </label>
              <div className="settings-form-input-container">
                <Phone className="settings-form-icon" />
                <input
                  type="tel"
                  defaultValue="+51 999 888 777"
                  className="settings-form-input"
                />
              </div>
            </div>
            <div className="settings-form-group">
              <label className="settings-form-label">
                Moneda preferida
              </label>
              <div className="settings-form-input-container">
                <DollarSign className="settings-form-icon" />
                <select className="settings-form-select">
                  <option>PEN - Sol Peruano</option>
                  <option>USD - Dólar Americano</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-notification-container">
            <div className="settings-notification-item">
              <div className="settings-notification-info">
                <h4>Notificaciones por email</h4>
                <p>Recibe resúmenes y alertas por correo</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-notification-item">
              <div className="settings-notification-info">
                <h4>Notificaciones push</h4>
                <p>Alertas instantáneas en tu dispositivo</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-notification-item">
              <div className="settings-notification-info">
                <h4>Reporte semanal</h4>
                <p>Resumen de gastos cada semana</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={notifications.weekly}
                  onChange={(e) => setNotifications({...notifications, weekly: e.target.checked})}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>

            <div className="settings-notification-item">
              <div className="settings-notification-info">
                <h4>Reporte mensual</h4>
                <p>Análisis completo cada mes</p>
              </div>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={notifications.monthly}
                  onChange={(e) => setNotifications({...notifications, monthly: e.target.checked})}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-security-container">
            <div className="settings-security-item">
              <h4>Cambiar contraseña</h4>
              <div>
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  className="settings-security-input"
                />
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  className="settings-security-input"
                />
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  className="settings-security-input"
                />
              </div>
            </div>

            <div className="settings-security-item">
              <h4>Autenticación de dos factores</h4>
              <p>Añade una capa extra de seguridad a tu cuenta</p>
              <button className="settings-button">
                Configurar 2FA
              </button>
            </div>

            <div className="settings-security-item">
              <h4>Sesiones activas</h4>
              <div className="settings-session-list">
                <div className="settings-session-item">
                  <div className="settings-session-info">
                    <p>Chrome en Windows</p>
                    <p className="settings-session-time">Última actividad: hace 2 minutos</p>
                  </div>
                  <span className="settings-session-status">Actual</span>
                </div>
                <div className="settings-session-item">
                  <div className="settings-session-info">
                    <p>Safari en iPhone</p>
                    <p className="settings-session-time">Última actividad: hace 2 horas</p>
                  </div>
                  <button className="settings-session-close">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="settings-data-container">
            <div className="settings-security-item">
              <h4>Exportar datos</h4>
              <p>Descarga una copia de todos tus datos financieros</p>
              <button className="settings-button">
                <Download className="settings-nav-icon-mobile" />
                <span>Exportar datos</span>
              </button>
            </div>

            <div className="settings-danger-zone">
              <h4>Zona de peligro</h4>
              <p>Estas acciones son irreversibles. Procede con precaución.</p>
              <div className="settings-danger-buttons">
                <button className="settings-button settings-button-danger">
                  <Trash2 className="settings-nav-icon-mobile" />
                  <span>Eliminar todos los datos</span>
                </button>
                <button className="settings-button settings-button-danger">
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-400">Selecciona una opción del menú</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="settings-container"
    >
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-icon-container">
            <SettingsIcon className="settings-nav-icon text-white" />
          </div>
          <div>
            <h1 className="settings-title">Configuración</h1>
            <p className="settings-subtitle">Personaliza tu experiencia en Noox</p>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-sidebar-container">
            <nav className="settings-nav">
              {/* Mobile horizontal scroll for tabs */}
              <div className="settings-nav-mobile">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`settings-nav-button-mobile ${
                        activeTab === tab.id ? 'active' : ''
                      }`}
                    >
                      <Icon className="settings-nav-icon-mobile" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Desktop vertical layout */}
              <div className="settings-nav-desktop">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`settings-nav-button ${
                        activeTab === tab.id ? 'active' : ''
                      }`}
                    >
                      <Icon className="settings-nav-icon" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="settings-content">
          <div className="settings-content-container">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="settings-save-container">
              <button className="settings-save-button">
                <Save className="settings-nav-icon-mobile" />
                <span>Guardar cambios</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};