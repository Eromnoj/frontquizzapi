import { useReducer, useState } from 'react'
import { useAuth } from '../hooks/AuthHook'
import { Navigate } from 'react-router-dom'
import type { RegisterType } from '../types/Types'
import InputsComponent from '../components/InputsComponent'
import ButtonComponent from '../components/ButtonComponent'
import style from '../styles/Register.module.scss'

type LoginReducer = {
  name: string;
  value: string;
};


function Register() {
  const { user, register } = useAuth();
  const [error, setError] = useState<string | null>(null)

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
    <div className={style.main}>
      <div className={style.box}>
        <h1 className={style.title}>Inscription</h1>
        {error && <div className={style.errorMessage}>{error}</div>}
        <form
          className={style.questionForm}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await register({ email: state.email, password: state.password, passwordConfirm: state.passwordConfirm, name: state.name, role: state.role });
              if (res && 'status' in res && res.status !== 200) {
                if (typeof res.response === 'string') setError(res.response)
                else setError('Une erreur est survenue.')
              }
            } catch (err) {
              setError((err as Error).message)
            }
          }}
        >
          <InputsComponent
            type="email"
            name="email"
            label="E-mail"
            placeholder="Email"
            value={state.email}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <InputsComponent
            type="password"
            name="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            value={state.password}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <InputsComponent
            type="password"
            name="passwordConfirm"
            label="Confirmer le mot de passe"
            placeholder="Confirmer le mot de passe"
            value={state.passwordConfirm}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <InputsComponent
            type="text"
            name="name"
            label="Nom"
            placeholder="Nom"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.name, value: e.target.value })}
          />
          <ButtonComponent id="registerSubmit" label={"S'enregistrer"} />
        </form>
      </div>
    </div>
  )
}

export default Register
