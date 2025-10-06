import React from 'react';
import type { ReactNode } from 'react';
import style from '../styles/AdminLayout.module.scss'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/AuthHook'


type AdminLayoutProps = {
  children: ReactNode;
};

function AdminLayout({ children }: AdminLayoutProps): React.JSX.Element {
  const { logout } = useAuth();
  return (
    <>
      <header className={style.header}>
        <div className={style.bar}>
          <h1 className={style.brand}>Quiz Admin</h1>
          <div className={style.spacer} />
          <nav className={style.nav}>
            <Link to="/">Accueil</Link>
            <Link to="/admin">Panneau</Link>
            <button onClick={() => logout()}>Déconnexion</button>
          </nav>
        </div>
      </header>
      <main className={style.main}>{children}</main>
    </>
  );
}

export default AdminLayout;
