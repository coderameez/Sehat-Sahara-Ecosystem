import { Navigate, useLocation } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import { store } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const location = useLocation();

  if (!state.session.isAuthenticated) {
    // Redirect to onboarding if they hit root, else login
    if (location.pathname === '/') {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
