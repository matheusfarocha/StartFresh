import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Learn from './pages/Learn';
import Onboarding from './pages/Onboarding';
import Roadmap from './pages/Roadmap';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Login />} />
          <Route path="/learn"     element={<Learn />} />
          <Route path="/onboard"   element={<Onboarding />} />
          <Route path="/roadmap"   element={<Roadmap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
