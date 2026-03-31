import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import GlassDock, { MobileNav } from './components/GlassDock';
import ToastContainer from './components/Toast';
import Landing from './pages/Landing';
import Predict from './pages/Predict';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import ModelInfo from './pages/ModelInfo';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Landing />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user/:id" element={<UserProfile />} />
      <Route path="/model" element={<ModelInfo />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Simple CSS background instead of WebGL shader */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: 'linear-gradient(135deg, #0A0A1A 0%, #12103A 100%)'
      }} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen w-full">
        <AnimatedRoutes />
      </div>

      {/* Glass dock navigation */}
      <GlassDock />
      <MobileNav />

      {/* Toast notifications */}
      <ToastContainer />
    </BrowserRouter>
  );
}
