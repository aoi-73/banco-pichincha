import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/layout/PrivateRoute.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Sidebar from './components/layout/Sidebar.jsx'

import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ScoringPage from './pages/ScoringPage.jsx'
import CarteraPage from './pages/CarteraPage.jsx'
import SolicitudesBandejaPage from './pages/SolicitudesBandejaPage.jsx'
import SolicitudNuevaPage from './pages/SolicitudNuevaPage.jsx'
import SolicitudDetallePage from './pages/SolicitudDetallePage.jsx'
import CreditoDetallePage from './pages/CreditoDetallePage.jsx'
import AhorrosPage from './pages/AhorrosPage.jsx'
import ClientePage from './pages/ClientePage.jsx'
import RecuperacionesPage from './pages/RecuperacionesPage.jsx'

/**
 * Layout protegido: Navbar superior + Sidebar lateral + contenido.
 * Envuelve todas las páginas privadas.
 */
function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <div className="franja-top" />
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Privadas — protegidas por PrivateRoute */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/scoring"
        element={
          <PrivateRoute>
            <AppLayout>
              <ScoringPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/cartera"
        element={
          <PrivateRoute>
            <AppLayout>
              <CarteraPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/solicitudes"
        element={
          <PrivateRoute>
            <AppLayout>
              <SolicitudesBandejaPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/solicitudes/nueva"
        element={
          <PrivateRoute>
            <AppLayout>
              <SolicitudNuevaPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/solicitudes/:codsolicitud"
        element={
          <PrivateRoute>
            <AppLayout>
              <SolicitudDetallePage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/creditos/:codcuentacredito"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreditoDetallePage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/ahorros"
        element={
          <PrivateRoute roles={['administrador', 'gerencia', 'operaciones']}>
            <AppLayout>
              <AhorrosPage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes/:codcliente"
        element={
          <PrivateRoute>
            <AppLayout>
              <ClientePage />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/recuperaciones"
        element={
          <PrivateRoute roles={['asesor', 'administrador', 'riesgos', 'gerencia', 'analista']}>
            <AppLayout>
              <RecuperacionesPage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
