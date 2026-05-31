import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateProfile from './pages/CreateProfile';
import QRDashboard from './pages/QRDashboard';
import PublicProfile from './pages/PublicProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/create" element={<CreateProfile />} />
        <Route path="/dashboard/profile/:id" element={<QRDashboard />} />
        <Route path="/profile/:id" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}