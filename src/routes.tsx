import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import EstimateBudget from './pages/EstimateBudget';
import PlanTrip from './pages/PlanTrip';
import MusicRecommendations from './pages/MusicRecommendations';
import ProtectedRoute from './components/common/ProtectedRoute';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  protected?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false,
    protected: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
    protected: false,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <Signup />,
    visible: false,
    protected: false,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    visible: false,
    protected: true,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
    visible: false,
    protected: true,
  },
  {
    name: 'Estimate Budget',
    path: '/estimate-budget',
    element: (
      <ProtectedRoute>
        <EstimateBudget />
      </ProtectedRoute>
    ),
    visible: false,
    protected: true,
  },
  {
    name: 'Plan Trip',
    path: '/plan-trip',
    element: (
      <ProtectedRoute>
        <PlanTrip />
      </ProtectedRoute>
    ),
    visible: false,
    protected: true,
  },
  {
    name: 'Music Recommendations',
    path: '/music-recommendations',
    element: (
      <ProtectedRoute>
        <MusicRecommendations />
      </ProtectedRoute>
    ),
    visible: false,
    protected: true,
  },
];

export default routes;
