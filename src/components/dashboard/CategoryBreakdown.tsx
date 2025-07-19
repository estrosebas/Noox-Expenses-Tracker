import React from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './categoryBreakdown.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryBreakdown: React.FC = () => {
  const data = {
    labels: ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Compras', 'Otros'],
    datasets: [
      {
        data: [850, 420, 380, 350, 280, 170],
        backgroundColor: ['#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'],
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
          font: { size: 12, weight: '500' },
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
            const percentage = ((context.parsed / context.dataset.data.reduce((a: number, b: number) => a + b, 0)) * 100).toFixed(1);
            return `${context.label}: S/ ${context.parsed.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  const categories = [
    { name: 'Alimentación', amount: 850, color: '#06B6D4', percentage: 34.7 },
    { name: 'Transporte', amount: 420, color: '#8B5CF6', percentage: 17.1 },
    { name: 'Entretenimiento', amount: 380, color: '#10B981', percentage: 15.5 },
    { name: 'Servicios', amount: 350, color: '#F59E0B', percentage: 14.3 },
    { name: 'Compras', amount: 280, color: '#EF4444', percentage: 11.4 },
    { name: 'Otros', amount: 170, color: '#6B7280', percentage: 6.9 }
  ];

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

        <div className="category-list">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="category-item"
            >
              <div className="category-info">
                <div className="category-dot" style={{ backgroundColor: category.color }} />
                <span className="category-name">{category.name}</span>
              </div>
              <div className="category-stats">
                <p className="amount">S/ {category.amount.toLocaleString()}</p>
                <p className="percentage">{category.percentage}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
