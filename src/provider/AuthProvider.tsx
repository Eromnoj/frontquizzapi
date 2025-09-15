import React, { useState, useEffect } from "react";
import { AuthService } from "../services/authService";
import type {
  ResponseUserType,
  LoginType,
  RegisterType,
  SendMailPasswordType,
  RecoverPasswordType,
} from "../types/Types";
// import { CircularProgress } from '@mui/material';
import { AuthContext } from "../hooks/AuthHook";

// Créer le provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ResponseUserType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Charger l'utilisateur au démarrage
    const fetchUser = async () => {
      try {
        const loggedInUser = await authService.getUser();
        setUser(loggedInUser);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [authService]);

  const login = async ({ email, password }: LoginType) => {
    try {
      const res = await authService.login({ email, password });
      if (typeof res === "object" && "status" in res && "response" in res) {
        return res;
      }
      const loggedInUser = await authService.getUser();
      setUser(loggedInUser);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const isAdmin = () => {
    if (!user) {
      return false;
    }
    return user?.role === "ADMIN";
  };
  const register = async (data: RegisterType) => {
    try {
      const res = await authService.register(data);
      if (typeof res === "object" && "status" in res && "response" in res) {
        return res;
      }
      const loggedInUser = await authService.getUser();
      setUser(loggedInUser);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(undefined);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const recoverPassword = async (data: RecoverPasswordType) => {
    console.log(data);
    try {
      const res = await authService.recoverPassword(data);
      if (typeof res === "object" && "status" in res && "response" in res) {
        return res;
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  const sendMailPassword = async (data: SendMailPasswordType) => {
    try {
      const res = await authService.sendMailPassword(data);
      if (typeof res === "object" && "status" in res && "response" in res) {
        return res;
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* <CircularProgress variant="indeterminate" size={60} /> */}
        <span style={{ marginLeft: "10px" }}>Chargement...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        logout,
        register,
        recoverPassword,
        sendMailPassword,
        getUser: authService.getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
