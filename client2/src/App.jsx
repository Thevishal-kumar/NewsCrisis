import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Verification from './pages/Verification';
import Donation from './pages/Donation';
import AuthPage from './pages/AuthPage';
import MapView from './components/MapView.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="verify" element={<Verification />} />
          <Route path="donate" element={<Donation />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="map" element={<MapView/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;