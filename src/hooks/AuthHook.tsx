import { createContext, useContext } from 'react';

import type { ResponseUserType, AuthResponseType,LoginType, RegisterType, SendMailPasswordType, RecoverPasswordType } from '../types/Types';

// Définir les types pour le contexte
interface AuthContextType {
  user: ResponseUserType | undefined;
  isAdmin: () => boolean;
  login: ({ email, password }: LoginType) => Promise<void | { status: number; response: AuthResponseType } | undefined>;
  register: (data: RegisterType) => Promise<void | { status: number; response: AuthResponseType }>;
  logout: () => Promise<void>;
  recoverPassword: (data: RecoverPasswordType) => Promise<void | { status: number; response: AuthResponseType }>;
  sendMailPassword: (data: SendMailPasswordType) => Promise<void | { status: number; response: AuthResponseType }>;
  getUser: () => Promise<ResponseUserType | undefined>;
}

// Créer le contexte avec des valeurs par défaut
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};