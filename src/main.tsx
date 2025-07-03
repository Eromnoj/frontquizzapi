import { StrictMode } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import Home from './pages/Home.tsx';
import Admin from './pages/Admin.tsx';
import Register from './pages/Register.tsx';
import Connexion from './pages/Connexion.tsx';
import { AuthProvider } from './provider/AuthProvider.tsx';
import MainLayout from './layouts/MainLayout.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element:
      <MainLayout>
        <Admin />
      </MainLayout>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/connexion",
    element: <Connexion />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
