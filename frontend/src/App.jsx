import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from './components/Loader';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Lazy-loaded routes for code splitting
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const AllFiles = lazy(() => import('./pages/AllFiles.jsx'));

const WorkspaceOverview = lazy(() => import('./pages/workspace/WorkspaceOverview.jsx'));
const WorkspaceDocuments = lazy(() => import('./pages/workspace/WorkspaceDocuments.jsx'));
const WorkspaceEmployees = lazy(() => import('./pages/workspace/WorkspaceEmployees.jsx'));
const WorkspacePartners = lazy(() => import('./pages/workspace/WorkspacePartners.jsx'));
const WorkspaceVehicles = lazy(() => import('./pages/workspace/WorkspaceVehicles.jsx'));
const WorkspaceBanking = lazy(() => import('./pages/workspace/WorkspaceBanking.jsx'));
const WorkspaceInvoices = lazy(() => import('./pages/workspace/WorkspaceInvoices.jsx'));
const WorkspaceSettings = lazy(() => import('./pages/workspace/WorkspaceSettings.jsx'));

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Company Workspace Routes */}
        <Route
          path="/workspace/:companyId"
          element={
            <ProtectedRoute>
              <WorkspaceOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:companyId/documents"
          element={
            <ProtectedRoute>
              <WorkspaceDocuments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:companyId/employees"
          element={
            <ProtectedRoute>
              <WorkspaceEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:companyId/partners"
          element={
            <ProtectedRoute>
              <WorkspacePartners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:companyId/vehicles"
          element={
            <ProtectedRoute>
              <WorkspaceVehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:companyId/banking"
          element={
            <ProtectedRoute>
              <WorkspaceBanking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:companyId/invoices"
          element={
            <ProtectedRoute>
              <WorkspaceInvoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:companyId/settings"
          element={
            <ProtectedRoute>
              <WorkspaceSettings />
            </ProtectedRoute>
          }
        />

        {/* Global File Vault */}
        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <AllFiles />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
