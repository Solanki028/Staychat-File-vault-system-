import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AllFiles from './pages/AllFiles.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import WorkspaceBanking from './pages/workspace/WorkspaceBanking.jsx';
import WorkspaceDocuments from './pages/workspace/WorkspaceDocuments.jsx';
import WorkspaceEmployees from './pages/workspace/WorkspaceEmployees.jsx';
import WorkspaceInvoices from './pages/workspace/WorkspaceInvoices.jsx';
import WorkspaceOverview from './pages/workspace/WorkspaceOverview.jsx';
import WorkspacePartners from './pages/workspace/WorkspacePartners.jsx';
import WorkspaceSettings from './pages/workspace/WorkspaceSettings.jsx';
import WorkspaceVehicles from './pages/workspace/WorkspaceVehicles.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
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
  );
}

export default App;
