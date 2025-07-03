import React from 'react';
import type { ReactNode } from 'react';


type AdminLayoutProps = {
  children: ReactNode;
};

function AdminLayout({ children }: AdminLayoutProps): React.JSX.Element {
  return (
    <>
      <menu>
        <h1>Admin Dashboard</h1>
      </menu>
      <main>
        {children}  
      </main>
    </>
  );
}

export default AdminLayout;