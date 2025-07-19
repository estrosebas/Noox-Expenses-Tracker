import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import './RecentTransactions.css';

export const RecentTransactions: React.FC = () => {
  const transactions = [
    { id: 1, type: 'expense', title: 'Supermercado Plaza Vea', category: 'Alimentación', amount: 127.50, date: '2025-01-15', time: '10:30 AM', method: 'Yape' },
    { id: 2, type: 'income', title: 'Pago Freelance', category: 'Ingresos', amount: 850.00, date: '2025-01-14', time: '3:45 PM', method: 'Transferencia' },
    { id: 3, type: 'expense', title: 'Uber', category: 'Transporte', amount: 15.80, date: '2025-01-14', time: '8:20 AM', method: 'Plin' },
    { id: 4, type: 'expense', title: 'Netflix', category: 'Servicios', amount: 35.90, date: '2025-01-13', time: '12:00 PM', method: 'Tarjeta' },
    { id: 5, type: 'expense', title: 'Restaurante Maido', category: 'Entretenimiento', amount: 180.00, date: '2025-01-13', time: '7:30 PM', method: 'Yape' },
    { id: 6, type: 'income', title: 'Salario', category: 'Ingresos', amount: 3200.00, date: '2025-01-01', time: '9:00 AM', method: 'Transferencia' }
  ];

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
                  <span>{transaction.category}</span>
                  <span className="dot sm-visible">•</span>
                  <span>{transaction.method}</span>
                  <span className="dot md-visible">•</span>
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
