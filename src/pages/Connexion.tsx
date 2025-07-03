import { useReducer } from 'react'
import { useAuth } from '../hooks/AuthHook'
// import { Navigate } from 'react-router-dom'
import type { LoginType } from '../types/Types'

type LoginReducer = {
  name: string;
  value: string;
};


function Connexion() {
  const { user, login } = useAuth();
  console.log("userConnexion", user);
  function reducer(state: LoginType, action: LoginReducer) {
    return { ...state, [action.name]: action.value }
  }
  const [state, dispatch] = useReducer(reducer, {
    email: '',
    password: ''
  })

  // Si l'utilisateur est déjà connecté, on le redirige vers la page d'accueil
  // if (user) {
  //   return <Navigate to="/admin" replace />;
  // }
  // const [error, setError] = React.useState<LoginType | null>(null);
  return (
    <>
      <h1>Connexion</h1>
      <div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await login({ email: state.email, password: state.password });
            if (res && 'status' in res && res.status !== 200) {
              console.error(res.response);
            }
          } catch (error) {
            console.error((error as Error).message);
          }
        }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={state.email}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={state.password}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </>
  )
}

export default Connexion