// Categories.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './categories.css';
import { 
  Plus, Edit2, Trash2, Tag, DollarSign, Target,
  Utensils, Car, Film, Zap, ShoppingBag, Heart
} from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, ] = useState([
    { id: 1, name: 'Alimentación', budget: 1000, spent: 850, color: '#06B6D4', icon: Utensils },
    { id: 2, name: 'Transporte', budget: 500, spent: 420, color: '#8B5CF6', icon: Car },
    { id: 3, name: 'Entretenimiento', budget: 400, spent: 380, color: '#10B981', icon: Film },
    { id: 4, name: 'Servicios', budget: 600, spent: 350, color: '#F59E0B', icon: Zap },
    { id: 5, name: 'Compras', budget: 300, spent: 280, color: '#EF4444', icon: ShoppingBag },
    { id: 6, name: 'Salud', budget: 200, spent: 120, color: '#EC4899', icon: Heart }
  ]);

  const [, setShowAddForm] = useState(false);

  const getProgressPercentage = (spent: number, budget: number) =>
    Math.min((spent / budget) * 100, 100);

  const getProgressColor = (percentage: number) =>
    percentage >= 90 ? 'progress-red' :
    percentage >= 75 ? 'progress-yellow' : 'progress-green';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="categories-wrapper"
    >
      {/* Header */}
      <div className="header-card">
        <div className="header-content">
          <div className="header-left">
            <div className="icon-box">
              <Tag className="icon-white" />
            </div>
            <div>
              <h1 className="title">Gestión de Categorías</h1>
              <p className="subtitle">Organiza y controla tus presupuestos</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="add-category-button"
          >
            <Plus className="icon-small" />
            <span className="btn-label-full">Nueva Categoría</span>
            <span className="btn-label-short">Nueva</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.map((category, index) => {
          const percentage = getProgressPercentage(category.spent, category.budget);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="category-card"
            >
              <div className="category-header">
                <div className="category-info">
                  <div
                    className="category-icon"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <category.icon className="icon-medium" style={{ color: category.color }} />
                  </div>
                  <div>
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-budget">S/ {category.spent} / S/ {category.budget}</p>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="edit-btn"><Edit2 className="icon-small" /></button>
                  <button className="delete-btn"><Trash2 className="icon-small" /></button>
                </div>
              </div>

              {/* Progress */}
              <div className="progress-section">
                <div className="progress-info">
                  <span className="progress-label">Progreso</span>
                  <span className={`progress-value ${getProgressColor(percentage)}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div className={`progress-bar-fill ${getProgressColor(percentage)}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>

              {/* Stats */}
              <div className="category-stats">
                <div className="stat-box">
                  <DollarSign className="stat-icon" />
                  <p className="stat-label">Gastado</p>
                  <p className="stat-value">S/ {category.spent}</p>
                </div>
                <div className="stat-box">
                  <Target className="stat-icon" />
                  <p className="stat-label">Restante</p>
                  <p className="stat-value">S/ {Math.max(0, category.budget - category.spent)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="summary-card">
        <h3 className="summary-title">Resumen de Presupuestos</h3>
        <div className="summary-grid">
          <div className="summary-box">
            <p className="summary-label">Total Presupuestado</p>
            <p className="summary-value white">
              S/ {categories.reduce((s, c) => s + c.budget, 0).toLocaleString()}
            </p>
          </div>
          <div className="summary-box">
            <p className="summary-label">Total Gastado</p>
            <p className="summary-value cyan">
              S/ {categories.reduce((s, c) => s + c.spent, 0).toLocaleString()}
            </p>
          </div>
          <div className="summary-box">
            <p className="summary-label">Disponible</p>
            <p className="summary-value green">
              S/ {(categories.reduce((s, c) => s + c.budget, 0) -
                   categories.reduce((s, c) => s + c.spent, 0)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
