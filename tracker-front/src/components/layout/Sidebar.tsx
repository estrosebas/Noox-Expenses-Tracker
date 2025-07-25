import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  //PieChart,
  FileText,
  Settings,
  LogOut,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  setIsOpen
}) => {

  const { logout } = useAuth();
  const handleLogout = () => {
    localStorage.clear();
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'analytics', label: 'Análisis', icon: TrendingUp },
   // { id: 'categories', label: 'Categorías', icon: PieChart },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <>
      {/* Fondo oscuro al abrir (solo en mobile) */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      <motion.div
        className="sidebar"
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <Zap className="sidebar__nav-icon" />
          </div>
          <span className="sidebar__brand-text">Noox</span>
          <button className="sidebar__close-btn" onClick={() => setIsOpen(false)}>
            <X className="sidebar__nav-icon" />
          </button>
        </div>

        {/* Navegación */}
        <ul className="sidebar__nav">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <li key={id} className="sidebar__nav-item">
              <button
                onClick={() => {
                  setActiveView(id);
                  setIsOpen(false);
                }}
                className={`sidebar__nav-link ${activeView === id ? 'sidebar__nav-link--active' : ''}`}
              >
                <Icon className="sidebar__nav-icon" />
                <span className="sidebar__nav-text">{label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="sidebar__footer">
          <button className="sidebar__nav-link logout" onClick={handleLogout}>
            <LogOut className="sidebar__nav-icon" />
            <span className="sidebar__nav-text">Cerrar Sesión</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};
