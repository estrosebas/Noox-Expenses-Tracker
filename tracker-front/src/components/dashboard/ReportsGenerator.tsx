import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, PieChart, BarChart3, TrendingUp, FileText } from 'lucide-react';
import './ReportsGenerator.css';

export const ReportsGenerator: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [reportType, setReportType] = useState('summary');
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        ? prev.filter((c: string) => c !== category)
        : [...prev, category]
    );
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setReportUrl(null);
    try {
      const token = localStorage.getItem('noox_token') || localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: reportType,
          period: selectedPeriod,
          categories: selectedCategories
        })
      });
      const json = await res.json();
      if (json.success && json.reportUrl) {
        // Si la url es relativa, prepéndela con BASE_URL
        const url = json.reportUrl.startsWith('http') ? json.reportUrl : `${BASE_URL}${json.reportUrl}`;
        setReportUrl(url);
      } else {
        setError(json.message || 'No se pudo generar el reporte');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
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
              <button className="action-primary" onClick={generateReport} disabled={loading}>
                <FileText className="action-icon" /> {loading ? 'Generando...' : 'Generar Reporte'}
              </button>
            </div>
            {reportUrl && (
              <div className="report-link">
                <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="report-download-link">
                  Descargar PDF generado
                </a>
              </div>
            )}
            {error && <div className="report-error">{error}</div>}
          </section>
        </div>
      </div>
    </motion.div>
  );
};
