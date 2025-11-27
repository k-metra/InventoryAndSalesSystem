
import './App.css'
import LoginPage from './pages/login'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>

    
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div>Dashboard Page - Protected</div>
            </ProtectedRoute>
          } />

          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
