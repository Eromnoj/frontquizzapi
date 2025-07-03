import { useReducer } from 'react'
import { useAuth } from '../hooks/AuthHook'
import { Navigate } from 'react-router-dom'
import type { RegisterType } from '../types/Types'

type LoginReducer = {
  name: string;
  value: string;
};


function Register() {
  const { user, register } = useAuth();

  function reducer(state: RegisterType, action: LoginReducer) {
    return { ...state, [action.name]: action.value }
  }
  const [state, dispatch] = useReducer(reducer, {
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    role: 'USER' // Assuming 'USER' is a valid role, adjust as necessary
  })

  // Si l'utilisateur est déjà connecté, on le redirige vers la page d'accueil
  if (user) {
    return <Navigate to="/admin" replace />;
  }
  // const [error, setError] = React.useState<LoginType | null>(null);
  return (
    <>
      <h1>Inscription</h1>
      <div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await register({ email: state.email, password: state.password, passwordConfirm: state.passwordConfirm, name: state.name, role: state.role });
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
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirmer le mot de passe"
            value={state.passwordConfirm}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <button type="submit">S'enregistrer</button>
        </form>
      </div>
    </>
  )
}

export default Register