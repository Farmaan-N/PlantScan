import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import PlantResultPage from './pages/PlantResultPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './components/AppLayout';
import { useAuth } from './hooks/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public Routes */}
          <Route path="/"            element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/login"       element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
          <Route path="/signup"      element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

          {/* Protected App Routes */}
          <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/scan"        element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
          <Route path="/result"      element={<ProtectedRoute><PlantResultPage /></ProtectedRoute>} />
          <Route path="/history"     element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/settings"    element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* 404 Handling */}
          <Route path="*"            element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
