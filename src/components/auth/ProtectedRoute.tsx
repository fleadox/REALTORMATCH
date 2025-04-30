import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Always render children since we're removing auth
  return <>{children}</>;
};

export default ProtectedRoute;