import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  // Preferir los campos mapeados, pero usar los originales si no existen
  const displayName = user?.name || `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || 'Usuario';
  const displayEmail = user?.email || user?.correo || '';

  return (
    <header className="header">
      <div className="header__left">
        <motion.button
          onClick={() => setSidebarOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="header__icon-button"
        >
          <Menu className="header__icon" />
        </motion.button>

        <div className="header__titles">
          <h1 className="header__title">Dashboard</h1>
          <p className="header__subtitle">Bienvenido de nuevo, {displayName}</p>
        </div>
      </div>

      <div className="header__right">
        <div className="header__search-container">
          <Search className="header__search-icon" />
          <input
            type="text"
            placeholder="Buscar transacciones..."
            className="header__search-input"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="header__icon-button header__notification"
        >
          <Bell className="header__icon" />
          <span className="header__notification-dot"></span>
        </motion.button>

        <div className="header__user-info">
          <div className="header__user-avatar">
            <User className="header__user-icon" />
          </div>
          <div className="header__user-text">
            <p className="header__user-name">{displayName}</p>
            <p className="header__user-email">{displayEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
