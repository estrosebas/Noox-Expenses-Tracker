import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Target, AlertCircle } from 'lucide-react';
import './Analytics.css';

export const Analytics: React.FC = () => {
  // Mockdata para predicciones y recomendaciones (puedes conectar a endpoint si lo tienes)
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('noox_token') || localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/analytics/insights`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener insights');
        const json = await res.json();
        setInsights(json);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) return <div className="analytics"><div className="analytics__insights-grid">Cargando...</div></div>;
  if (error) return <div className="analytics"><div className="analytics__insights-grid error">{error}</div></div>;

  // Si el backend responde con un mensaje de error o no hay insights válidos
  const noInsights =
    (Array.isArray(insights) && insights.length === 0) ||
    (Array.isArray(insights) && insights[0] && insights[0].message === 'fail');

  return (
    <motion.div 
      className="analytics" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="analytics__header">
        <div className="analytics__icon">
          <BarChart3 />
        </div>
        <div>
          <h1 className="analytics__title">Análisis Avanzado</h1>
          <p className="analytics__subtitle">Insights inteligentes sobre tus finanzas</p>
        </div>
      </div>

      <div className="analytics__insights-grid">
        {noInsights ? (
          <div className="insight-card insight-card--alert">
            {insights[0] && insights[0].data ? insights[0].data : 'No hay datos suficientes para mostrar insights.'}
          </div>
        ) : (
          insights.map((insight: any, i: number) => (
            <motion.div
              key={i}
              className="insight-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="insight-card__header">
                <span className="insight-card__title">{insight.title}</span>
                {insight.trend === 'up' && <TrendingUp className="insight-card__icon trend-up" />}
                {insight.trend === 'down' && <TrendingDown className="insight-card__icon trend-down" />}
              </div>
              <p className={`insight-card__value ${insight.color || ''}`}>{insight.value}</p>
              <p className="insight-card__desc">{insight.description}</p>
            </motion.div>
          ))
        )}
      </div>

      <div className="analytics__section">
        <div className="analytics__section-header">
          <Target />
          <h3>Predicciones de Gasto</h3>
        </div>
        <div className="analytics__predictions">
          <div className="prediction-card prediction-card--info">En desarrollo</div>
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__section-header">
          <AlertCircle />
          <h3>Recomendaciones</h3>
        </div>
        <div className="recommendation-list">
          <div className="recommendation yellow">
            <h4>Optimización de Gastos</h4>
            <p>Reduce gastos en entretenimiento un 20% para cumplir tu meta.</p>
          </div>
          <div className="recommendation green">
            <h4>Oportunidad de Ahorro</h4>
            <p>Redujiste transporte, puedes ahorrar S/ 50 más.</p>
          </div>
          <div className="recommendation blue">
            <h4>Patrón Detectado</h4>
            <p>Gastas más los viernes, crea un presupuesto especial.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
