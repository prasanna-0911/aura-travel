import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import { Home } from '@/pages/Home';
import { Weaver } from '@/pages/Weaver';
import { LiveTrip } from '@/pages/LiveTrip';
import { Explore } from '@/pages/Explore';
import { Bookings } from '@/pages/Bookings';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Profile } from '@/pages/Profile';
import { Admin } from '@/pages/Admin';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weaver" element={<Weaver />} />
            <Route path="/live-trip" element={<LiveTrip />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={(
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/admin"
              element={(
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              )}
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
