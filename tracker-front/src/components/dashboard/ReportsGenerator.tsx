import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Calendar, Filter, PieChart, BarChart3, TrendingUp, FileText, Mail
} from 'lucide-react';
import './ReportsGenerator.css';

export const ReportsGenerator: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [reportType, setReportType] = useState('summary');

  const categories = [
    'Alimentación', 'Transporte', 'Entretenimiento',
    'Servicios', 'Compras', 'Salud', 'Educación', 'Otros'
  ];

  const reportTypes = [
    { id: 'summary', title: 'Resumen Financiero', description: 'Vista general de ingresos, gastos y ahorros', icon: PieChart },
    { id: 'detailed', title: 'Análisis Detallado', description: 'Desglose completo por categorías y transacciones', icon: BarChart3 },
    { id: 'trends', title: 'Análisis de Tendencias', description: 'Patrones de gasto y predicciones', icon: TrendingUp }
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const generateReport = () => {
    console.log('Generating report:', {
      type: reportType,
      period: selectedPeriod,
      categories: selectedCategories
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="report-container"
    >
      <div className="report-header">
        <div className="report-title-icon">
          <FileText className="report-icon" />
        </div>
        <div>
          <h1 className="report-title">Generador de Reportes</h1>
          <p className="report-subtitle">Crea reportes personalizados de tus finanzas</p>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-panel">
          <section className="report-section">
            <h3 className="report-section-title">
              <BarChart3 className="section-icon" /> Tipo de Reporte
            </h3>
            <div className="report-options">
              {reportTypes.map(({ id, icon: Icon, title, description }) => (
                <button
                  key={id}
                  onClick={() => setReportType(id)}
                  className={`report-option ${reportType === id ? 'selected' : ''}`}
                >
                  <Icon className={`option-icon ${reportType === id ? 'active' : ''}`} />
                  <h4 className="option-title">{title}</h4>
                  <p className="option-description">{description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="report-section">
            <h3 className="report-section-title">
              <Calendar className="section-icon" /> Período de Tiempo
            </h3>
            <div className="report-periods">
              {['weekly', 'monthly', 'quarterly', 'yearly'].map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedPeriod(id)}
                  className={`period-button ${selectedPeriod === id ? 'active' : ''}`}
                >
                  {id === 'weekly' && 'Esta Semana'}
                  {id === 'monthly' && 'Este Mes'}
                  {id === 'quarterly' && 'Este Trimestre'}
                  {id === 'yearly' && 'Este Año'}
                </button>
              ))}
            </div>
          </section>

          <section className="report-section">
            <h3 className="report-section-title">
              <Filter className="section-icon" /> Filtrar por Categorías
            </h3>
            <div className="category-list">
              {categories.map((cat) => (
                <label key={cat} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="report-side">
          <section className="preview-box">
            <h3 className="preview-title">Vista Previa</h3>
            <div className="preview-details">
              <div><span>Tipo:</span><span>{reportTypes.find(r => r.id === reportType)?.title}</span></div>
              <div><span>Período:</span><span>{selectedPeriod}</span></div>
              <div><span>Categorías:</span><span>{selectedCategories.length || 'Todas'}</span></div>
            </div>
          </section>

          <section className="actions-box">
            <h3 className="preview-title">Acciones</h3>
            <div className="action-buttons">
              <button className="action-primary" onClick={generateReport}>
                <FileText className="action-icon" /> Generar Reporte
              </button>
              <button className="action-secondary">
                <Download className="action-icon" /> Descargar PDF
              </button>
              <button className="action-secondary">
                <Mail className="action-icon" /> Enviar por Email
              </button>
            </div>
          </section>

          <section className="recent-reports">
            <h3 className="preview-title">Reportes Recientes</h3>
            <div className="recent-list">
              {[
                { name: 'Resumen Diciembre 2024', date: '2025-01-01' },
                { name: 'Análisis Anual 2024', date: '2024-12-31' },
                { name: 'Tendencias Q4 2024', date: '2024-12-15' }
              ].map((r, i) => (
                <div key={i} className="recent-item">
                  <div>
                    <p>{r.name}</p>
                    <small>{r.date}</small>
                  </div>
                  <Download className="action-icon" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
