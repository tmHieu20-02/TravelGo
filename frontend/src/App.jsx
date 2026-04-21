import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage'; // Import trang mới
import CountryDetail from './pages/CountryDetail';
import AdminCountryPage from './pages/AdminCountryPage';
import AdminBookingPage from './pages/AdminBookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // Import component bảo vệ

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destination/:slug" element={<CountryDetail />} />
        
        {/* Route được bảo vệ: Chỉ dành cho Admin */}
        <Route path="/admin/countries" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminCountryPage />
          </ProtectedRoute>
        } />

        <Route path="/admin/bookings" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminBookingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
