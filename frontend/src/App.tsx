
import './App.css'
import LoginPage from './pages/login'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Dashboard from './pages/dashboard';
import { AuthProvider, type User } from './contexts/AuthContext';
import { Suspense, use } from 'react';
import LoadingScreen from './pages/loadingScreen';
import fetchUserPromise from './utils/fetchUser';

function AppContent() {
  // Use React 18's use() hook directly with a Promise
  const initialUser: User | null = use(fetchUserPromise);

  return (
    <>
        <AuthProvider initialUser={initialUser}>
        <BrowserRouter>
          <Routes>    
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AppContent />
    </Suspense>
  )
}

export default App
