
import React from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import './categoryBreakdown.css';
import './CategoryBreakdownGrid.css';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

export const CategoryBreakdown: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchBreakdown = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('noox_token') || localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/expenses/categories/breakdown?period=monthly`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener desglose');
        const json = await res.json();
        setCategories(json);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchBreakdown();
  }, []);

  const data = {
    labels: categories.map((c: any) => c.name),
    datasets: [
      {
        data: categories.map((c: any) => c.amount),
        backgroundColor: categories.map((c: any) => c.color),
        borderColor: '#1F2937',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#D1D5DB',
          font: { size: 12, weight: 500 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: S/ ${context.parsed.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  if (loading) return <div className="breakdown-container"><div className="breakdown-chart">Cargando...</div></div>;
  if (error) return <div className="breakdown-container"><div className="breakdown-chart error">{error}</div></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="breakdown-container"
    >
      <div className="breakdown-header">
        <h3 className="breakdown-title">Gastos por Categoría</h3>
        <span className="breakdown-period">Este mes</span>
      </div>

      <div className="breakdown-grid">
        <div className="breakdown-chart">
          <Doughnut data={data} options={options} />
        </div>

        <div className="category-list-grid-wrapper">
          <div className="category-list-grid">
            {categories.map((category: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="category-item-grid"
              >
                <div className="category-info-grid">
                  <div className="category-dot" style={{ backgroundColor: category.color }} />
                  <span className="category-name-grid" title={category.name}>{category.name}</span>
                </div>
                <div className="category-stats-grid">
                  <p className="amount-grid">S/ {category.amount.toLocaleString()}</p>
                  <p className="percentage-grid">{category.percentage}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
