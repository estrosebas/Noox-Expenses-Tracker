import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Bell, 
  Save,
  Phone,
  DollarSign
} from 'lucide-react';
import './Settings.css';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell }
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