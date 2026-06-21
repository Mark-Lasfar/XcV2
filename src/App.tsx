import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { EditModeProvider } from './context/EditModeContext';
import { ProfileProvider } from './context/ProfileContext';

// Pages
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyPage from './pages/auth/VerifyPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { OAuthCallback } from './components/auth/SocialLogin';

// Components
import { ErrorBoundary } from './components/common/ErrorBoundary';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <SocketProvider>
                <NotificationProvider>
                  <ProfileProvider>
                    <EditModeProvider>
                      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                        <Routes>
                          {/* Auth Routes */}
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/verify" element={<VerifyPage />} />
                          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                          <Route path="/reset-password" element={<ResetPasswordPage />} />
                          <Route path="/auth/callback" element={<OAuthCallback />} />

                          {/* Profile Routes */}
                          <Route path="/profile/:nickname?" element={<ProfilePage />} />
                          
                          {/* Default */}
                          <Route path="/" element={<Navigate to="/profile/me" replace />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        
                        <Toaster
                          position="top-right"
                          toastOptions={{
                            duration: 4000,
                            style: {
                              background: 'var(--profile-card-bg)',
                              color: 'var(--profile-text)',
                              borderRadius: '12px',
                              padding: '16px',
                            },
                          }}
                        />
                      </div>
                    </EditModeProvider>
                  </ProfileProvider>
                </NotificationProvider>
              </SocketProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;