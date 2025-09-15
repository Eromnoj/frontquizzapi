import { useReducer, useState } from "react";
import { useAuth } from "../hooks/AuthHook";
import { Navigate } from "react-router-dom";
import type { LoginType } from "../types/Types";
import InputsComponent from "../components/InputsComponent";
import ButtonComponent from "../components/ButtonComponent";
import style from "../styles/Auth.module.scss";
type LoginReducer = {
  name: string;
  value: string;
};

function Connexion() {
  const { user, login } = useAuth();
  console.log("userConnexion", user);
  function reducer(state: LoginType, action: LoginReducer) {
    return { ...state, [action.name]: action.value };
  }
  const [state, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  // Si l'utilisateur est déjà connecté, on le redirige vers la page d'accueil
  if (user) {
    return <Navigate to="/admin" replace />;
  }
  return (
    <div className={style.main}>
      <div className={style.box}>
        <h1>Connexion</h1>
        {error !== null ? (
          <div className={style.errorMessage}>{error}</div>
        ) : null}
        <form
          className={style.questionForm}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await login({
                email: state.email,
                password: state.password,
              });
              if (res && "status" in res && res.status !== 200) {
                console.error("ICI", res);
                if (typeof res.response == "string") setError(res.response);
              }
            } catch (error) {
              console.error((error as Error).message);
            }
          }}
        >
          <InputsComponent
            type="email"
            name="email"
            label="E-mail"
            placeholder="Email"
            value={state.email}
            onChange={(e) =>
              dispatch({ name: e.target.name, value: e.target.value })
            }
          />
          <InputsComponent
            type="password"
            name="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            value={state.password}
            onChange={(e) =>
              dispatch({ name: e.target.name, value: e.target.value })
            }
          />
          <ButtonComponent id="submitCredentials" label="Se connecter" />
        </form>
      </div>
    </div>
  );
}

export default Connexion;
