// authService.tsx
import type {
  ResponseUserType,
  AuthResponseType,
  LoginType,
  RegisterType,
  SendMailPasswordType,
  RecoverPasswordType,
} from "../types/Types";

export class AuthService {
  private static instance: AuthService;
  private user: ResponseUserType | undefined;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async csrf(): Promise<string> {
    const token = await fetch(`${import.meta.env.VITE_API_URL}/csrf`, {
      method: "GET",
      credentials: "include",
    });
    const csrfToken = await token.json();

    return csrfToken.token;
  }

  public async login({
    email,
    password,
  }: LoginType): Promise<ResponseUserType | AuthResponseType | undefined> {
    const csrf = await this.csrf();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-csrf-token": csrf,
      },
      body: JSON.stringify({ username: email, password }),
    });

    console.log("response", response);
    if (!response.ok) {
      const errorData = await response.json();
      const res = {
        status: response.status,
        response: errorData.errors ?? errorData.message,
      };
      console.error("Login failed:", errorData);
      return res;
    }

    const responseData = await response.json();
    console.log("responseData", responseData);
    if (responseData) {
      this.user = responseData.user;
      return this.user;
    }
  }
  public async register(
    data: RegisterType,
  ): Promise<ResponseUserType | AuthResponseType | undefined> {
    const csrf = await this.csrf();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-csrf-token": csrf,
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const res = {
        status: response.status,
        response: errorData.errors ?? errorData.message,
      };
      return res;
    } else {
      const responseData = await response.json();
      if (responseData) {
        this.user = responseData.user;
        return this.user;
      }
    }
  }

  public async recoverPassword(
    data: RecoverPasswordType,
  ): Promise<ResponseUserType | AuthResponseType | undefined> {
    const csrf = await this.csrf();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/recovery/recover-password`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-csrf-token": csrf,
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      const res = {
        status: response.status,
        response: errorData.errors ?? errorData.message,
      };
      return res;
    } else {
      const responseData = await response.json();
      if (responseData) {
        const res = {
          status: response.status,
          response: responseData.message,
        };
        return res;
      }
    }
  }

  public async sendMailPassword(
    data: SendMailPasswordType,
  ): Promise<AuthResponseType | undefined> {
    const csrf = await this.csrf();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/recovery/send-mail`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-csrf-token": csrf,
        },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      const res = {
        status: response.status,
        response: errorData.errors ?? errorData.message,
      };
      return res;
    } else {
      const responseData = await response.json();
      console.log(responseData);
      if (responseData) {
        const res = {
          status: response.status,
          response: responseData.status,
        };
        return res;
      }
    }
  }

  private deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }
  public async logout(): Promise<void> {
    const csrf = await this.csrf();
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-csrf-token": csrf,
      },
    })
      .then(() => {
        this.user = undefined;
        this.deleteAllCookies();
      })
      .catch((err) => {
        throw new Error("Erreur de déconnexion: " + err.message);
      });
  }

  public async getUser(): Promise<ResponseUserType | undefined> {
    if (!this.user) {
      const csrf = await this.csrf();
      await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "x-csrf-token": csrf,
        },
      })
        .then(async (res) => {
          if (res.ok) {
            const response = await res.json();
            this.user = await response.user;
            console.log("getUser", this.user);
          } else {
            this.user = undefined;
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user", err);
          this.user = undefined;
        });
    }
    return this.user;
  }
}
