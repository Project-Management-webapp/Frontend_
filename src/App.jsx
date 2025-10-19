import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import ManagerLayout from "./pages/manager/ManagerLayout";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
const Unauthorized = () => <div style={{ color: 'white', padding: '2rem' }}><h1>403 - Unauthorized</h1><p>You do not have permission to access this page.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/manager/*" 
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;