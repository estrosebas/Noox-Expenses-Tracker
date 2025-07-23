import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { Chatbot } from '../components/dashboard/Chatbot';
import { ReportsGenerator } from '../components/dashboard/ReportsGenerator';
import { Analytics } from '../components/dashboard/Analytics';
import { Categories } from '../components/dashboard/Categories';
import { Settings } from '../components/dashboard/Settings';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'analytics': return <Analytics />;
      case 'categories': return <Categories />;
      case 'reports': return <ReportsGenerator />;
      case 'settings': return <Settings />;
      case 'overview':
      default:
        return (
          <div className="dashboard-overview">
            <StatsCards />
            <div className="dashboard-charts">
              <ExpenseChart />
              <CategoryBreakdown />
            </div>
            <RecentTransactions />
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="dashboard-main">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="dashboard-content">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};
