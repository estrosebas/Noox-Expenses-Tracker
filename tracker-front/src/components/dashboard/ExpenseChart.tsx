import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './ExpenseChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ExpenseChart: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('noox_token') || localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/expenses/chart?period=monthly`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener datos');
        const json = await res.json();
        setChartData(json);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, []);

  const data = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Gastos',
        data: chartData.expenses,
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(6, 182, 212)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Ingresos',
        data: chartData.income,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  } : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#D1D5DB',
        font: { size: 12, weight: 'bold' as 'bold' },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: S/ ${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9CA3AF',
          font: { size: 11 },
          callback: (val: any) => 'S/ ' + val.toLocaleString()
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  if (loading) return <div className="chart-container"><div className="chart-body">Cargando...</div></div>;
  if (error) return <div className="chart-container"><div className="chart-body error">{error}</div></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="chart-container"
    >
      <div className="chart-header">
        <h3 className="chart-title">Tendencia Financiera</h3>
        <select className="chart-select">
          <option>Últimos 7 meses</option>
          <option>Último año</option>
          <option>Últimos 2 años</option>
        </select>
      </div>
      <div className="chart-body">
        {data && <Line data={data} options={options} />}
      </div>
    </motion.div>
  );
};
