import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import './StatsCards.css';

export const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Gastos del Mes',
      value: 'S/ 2,450.00',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      colorClass: 'gradient-red'
    },
    {
      title: 'Ingresos',
      value: 'S/ 4,200.00',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      colorClass: 'gradient-green'
    },
    {
      title: 'Ahorro',
      value: 'S/ 1,750.00',
      change: '-5%',
      trend: 'down',
      icon: Target,
      colorClass: 'gradient-blue'
    },
    {
      title: 'Presupuesto Restante',
      value: 'S/ 850.00',
      change: '68%',
      trend: 'up',
      icon: TrendingDown,
      colorClass: 'gradient-purple'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="stats-card"
          >
            <div className="stats-card-header">
              <div className={`icon-wrapper ${stat.colorClass}`}>
                <Icon className="icon" />
              </div>
              <span className={`badge ${stat.trend === 'up' ? 'badge-up' : 'badge-down'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="stats-title">{stat.title}</h3>
            <p className="stats-value">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
