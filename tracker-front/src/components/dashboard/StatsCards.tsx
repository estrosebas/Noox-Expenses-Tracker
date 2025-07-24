
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import './StatsCards.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const formatCurrency = (value: number) =>
  value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 });

export const StatsCards: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('noox_token') || localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/summary/monthly`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener datos');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Gastos del Mes',
      value: data ? formatCurrency(data.expenses) : '--',
      icon: DollarSign,
      colorClass: 'gradient-red',
      trend: data && data.expenses > 0 ? 'up' : 'down',
      change: ''
    },
    {
      title: 'Ingresos',
      value: data ? formatCurrency(data.income) : '--',
      icon: TrendingUp,
      colorClass: 'gradient-green',
      trend: data && data.income > 0 ? 'up' : 'down',
      change: ''
    },
    {
      title: 'Ahorro',
      value: data ? formatCurrency(data.savings) : '--',
      icon: Target,
      colorClass: 'gradient-blue',
      trend: data && data.savings >= 0 ? 'up' : 'down',
      change: ''
    },
    {
      title: 'Presupuesto Restante',
      value: data ? formatCurrency(data.budget_left) : '--',
      icon: TrendingDown,
      colorClass: 'gradient-purple',
      trend: data && data.budget_left >= 0 ? 'up' : 'down',
      change: ''
    }
  ];

  if (loading) return <div className="stats-grid"><div className="stats-card">Cargando...</div></div>;
  if (error) return <div className="stats-grid"><div className="stats-card error">{error}</div></div>;

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
              {/* Puedes agregar badges de tendencia real aquí si lo deseas */}
            </div>
            <h3 className="stats-title">{stat.title}</h3>
            <p className="stats-value">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
