import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Testimony from './pages/Testimony';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddVehicle from './pages/AddVehicle';
import ActiveVehicles from './pages/ActiveVehicles';
import CompletedVehicles from './pages/CompletedVehicles';
import Reports from './pages/Reports';
import RateSettings from './pages/RateSettings';
import ParkingCapacity from './pages/ParkingCapacity';
import NotFound from './pages/NotFound';
import PaymentReturn from './pages/PaymentReturn';

// Import components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import auth provider and hook
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>
        {/* Public routes with navbar and footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar />
            <About />
            <Footer />
          </>
        } />
        <Route path="/services" element={
          <>
            <Navbar />
            <Services />
            <Footer />
          </>
        } />
        <Route path="/testimony" element={
          <>
            <Navbar />
            <Testimony />
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        } />
        
        {/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/add-vehicle" element={<AddVehicle />} />
                      <Route path="/active-vehicles" element={<ActiveVehicles />} />
                      <Route path="/completed-vehicles" element={<CompletedVehicles />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/rate-settings" element={<RateSettings />} />
                      <Route path="/parking-capacity" element={<ParkingCapacity />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Payment return routes - public, no navbar */}
        <Route path="/payment/return" element={<PaymentReturn />} />
        <Route path="/payment/callback" element={<PaymentReturn />} />

        {/* Catch all route */}
        <Route path="*" element={
          <>
            <Navbar />
            <NotFound />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
