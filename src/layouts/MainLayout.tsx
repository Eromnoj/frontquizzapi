import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthHook';
import AdminLayout from './AdminLayout';

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps): React.JSX.Element {
  const { user, logout } = useAuth();
  console.log("user", user);
  if (user == undefined) {
    return <Navigate to='/' />
  }
  return (
    <div>
      <header>
        <h1>Butxaca</h1>
        <a onClick={() => logout()} aria-label="Deconnection" role="menuitem">
          <div>Déconnexion</div>
        </a>
      </header>
        <AdminLayout>
          {children}
        </AdminLayout>
      <footer>
        <p>Jonathan Moreschi &copy; 2024</p>
      </footer>
    </div>
  );
}

export default MainLayout;