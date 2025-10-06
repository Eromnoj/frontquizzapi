import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthHook';
import AdminLayout from './AdminLayout';

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps): React.JSX.Element {
  const { user } = useAuth();
  if (user == undefined) {
    return <Navigate to='/' />
  }
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}

export default MainLayout;
