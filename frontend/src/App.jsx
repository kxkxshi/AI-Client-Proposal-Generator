import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateProposalPage from './pages/CreateProposalPage'
import ProposalViewPage from './pages/ProposalViewPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global Mesh Gradient Background */}
        <div className="fixed inset-0 bg-base z-[-2]"></div>
        <div className="fixed inset-0 bg-mesh-gradient opacity-40 animate-pulse-slow pointer-events-none z-[-1]"></div>
        
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateProposalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/:id"
            element={
              <ProtectedRoute>
                <ProposalViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
