import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Calendar, Target, AlertCircle } from 'lucide-react';
import './Analytics.css';

export const Analytics: React.FC = () => {
  const insights = [
    { title: 'Tendencia de Gastos', value: '+15%', description: 'Incremento respecto al mes anterior', trend: 'up', color: 'insight--red' },
    { title: 'Categoría Principal', value: 'Alimentación', description: '34.7% del total de gastos', trend: 'neutral', color: 'insight--cyan' },
    { title: 'Días con Mayor Gasto', value: 'Viernes', description: 'Promedio S/ 180 por día', trend: 'up', color: 'insight--purple' },
    { title: 'Meta de Ahorro', value: '68%', description: 'Progreso hacia tu objetivo mensual', trend: 'up', color: 'insight--green' }
  ];

  const predictions = [
    { month: 'Febrero 2025', predicted: 2650, current: 2450, confidence: 85 },
    { month: 'Marzo 2025', predicted: 2580, current: 2450, confidence: 78 },
    { month: 'Abril 2025', predicted: 2720, current: 2450, confidence: 72 }
  ];

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
        {insights.map((insight, i) => (
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
            <p className={`insight-card__value ${insight.color}`}>{insight.value}</p>
            <p className="insight-card__desc">{insight.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="analytics__section">
        <div className="analytics__section-header">
          <Target />
          <h3>Predicciones de Gasto</h3>
        </div>
        <div className="analytics__predictions">
          {predictions.map((p, i) => (
            <motion.div
              key={i}
              className="prediction-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="prediction-card__left">
                <Calendar />
                <div>
                  <h4>{p.month}</h4>
                  <p>Confianza: {p.confidence}%</p>
                </div>
              </div>
              <div className="prediction-card__right">
                <p>S/ {p.predicted.toLocaleString()}</p>
                <p className={p.predicted > p.current ? 'trend-up' : 'trend-down'}>
                  {p.predicted > p.current ? '+' : ''}
                  {((p.predicted - p.current) / p.current * 100).toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
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
