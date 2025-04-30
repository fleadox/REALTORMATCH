import React from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Always render children since we're removing auth
  return <>{children}</>;
};

export default AdminRoute;