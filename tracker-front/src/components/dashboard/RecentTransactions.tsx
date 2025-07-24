import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import './RecentTransactions.css';

export const RecentTransactions: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('noox_token') || localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/transactions/recent?limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al obtener transacciones');
        const json = await res.json();
        setTransactions(json);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) return <div className="transactions-container"><div className="transactions-list">Cargando...</div></div>;
  if (error) return <div className="transactions-container"><div className="transactions-list error">{error}</div></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="transactions-container"
    >
      <div className="transactions-header">
        <h3 className="transactions-title">Transacciones Recientes</h3>
        <button className="see-all-button">Ver todas</button>
      </div>

      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="transaction-item"
          >
            <div className="transaction-info">
              <div className={`transaction-icon ${transaction.type === 'income' ? 'income-icon' : 'expense-icon'}`}>
                {transaction.type === 'income' ? (
                  <ArrowDownLeft className="icon-size" />
                ) : (
                  <ArrowUpRight className="icon-size" />
                )}
              </div>

              <div>
                <h4 className="transaction-title">{transaction.title}</h4>
                <div className="transaction-meta">
                  <span className="md-visible">{transaction.time}</span>
                </div>
              </div>
            </div>

            <div className="transaction-amount-options">
              <div className="transaction-amount">
                <p className={`amount-text ${transaction.type === 'income' ? 'income-text' : 'expense-text'}`}>
                  {transaction.type === 'income' ? '+' : '-'}S/ {transaction.amount.toFixed(2)}
                </p>
                <p className="transaction-date sm-visible">{transaction.date}</p>
              </div>

              <button className="options-button lg-visible">
                <MoreHorizontal className="icon-size-small" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
