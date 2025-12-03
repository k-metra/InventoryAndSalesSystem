
import './App.css'
import LoginPage from './pages/login'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Dashboard from './pages/dashboard';
import { AuthProvider, type User } from './contexts/AuthContext';
import { lazy, Suspense, use } from 'react';
import LoadingScreen from './pages/loadingScreen';
import fetchUserPromise from './utils/fetchUser'; 

import { ConfirmationProvider } from './contexts/ConfirmationContext';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ToastProvider } from './contexts/ToastContext';
import CategoriesPage from './pages/dashboard/categoriesPage';


const DashboardHome = lazy(() => import('./pages/dashboard/dashboardHome'));
const ProductsPage = lazy(() => import('./pages/dashboard/productsPage'));

function AppContent() {
  // Use React 18's use() hook directly with a Promise
  const initialUser: User | null = use(fetchUserPromise);

  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <ConfirmationProvider>
        <AuthProvider initialUser={initialUser}>
        <BrowserRouter>
          <Routes>    
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />

              <Route 
                path="products"
                element={
                  <ProductsPage />
                }
              />

              <Route 
                path="categories"
                element={ <CategoriesPage />}
              />
            </Route>

            <Route path="/dashboard/*" element={
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
      </ConfirmationProvider>
      </QueryClientProvider>
    </>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Suspense>
  )
}

export default App
