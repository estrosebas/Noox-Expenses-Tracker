import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthPage from '../components/AuthPage';
import './FaceLoginPage.css';

export const FaceLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { } = useAuth();
  const [, ] = useState(false);
  
  // Get email from query param if available
  const params = new URLSearchParams(location.search);
  const emailParam = params.get('email') || '';
  
  // Custom props to pass to AuthPage to set initial email and mode
  const authPageProps = {
    initialEmail: emailParam,
    initialMode: 'face' as const,
    onSuccessfulLogin: () => {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  // Initialize facial login automatically if we have an email
  useEffect(() => {
    if (emailParam) {
      console.log('Email parameter detected, initializing facial login...');
    }
  }, [emailParam]);

  return (
    <div className="face-login-page">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <AuthPage 
          onBack={handleBack} 
          initialEmail={authPageProps.initialEmail}
          initialMode={authPageProps.initialMode}
          onSuccessfulLogin={authPageProps.onSuccessfulLogin}
        />
      </div>
    </div>
  );
};
