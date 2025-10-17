import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import RequestService from "../services/requestService";
import ActionComponent from "./ActionComponent";
import ButtonComponent from "./ButtonComponent";
import InputsComponent from "./InputsComponent";
import UpdateUserRoleModalComponent from "./UpdateUserRoleModalComponent";
import style from "../styles/components/PendingComponent.module.scss";

type User = {
  id: string;
  email: string;
  role: string;
  name: string;
};

type CreateUserState = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type FeedbackState = {
  text: string;
  status: number;
};

const initialFormState: CreateUserState = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

function UserComponent() {
  const requestService = RequestService.getInstance();
  const [users, setUsers] = useState<User[]>([]);
  const [formState, setFormState] = useState<CreateUserState>(initialFormState);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hasUsers = useMemo(() => users.length > 0, [users]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const res = await requestService.get(
        `${import.meta.env.VITE_API_URL}/admin/users`,
      );
      const { response } = res;
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray((response as { users?: User[] }).users)) {
        setUsers((response as { users: User[] }).users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const formatResponseMessage = (res: unknown): string => {
    if (!res) {
      return "Une erreur est survenue";
    }
    if (typeof res === "string") {
      return res;
    }
    if (typeof res === "object") {
      if ("msg" in res && typeof res.msg === "string") {
        return res.msg;
      }
      if ("message" in res && typeof res.message === "string") {
        return res.message;
      }
      if ("errors" in res && res.errors && typeof res.errors === "object") {
        const errors = Object.entries(res.errors as Record<string, string[]>);
        if (errors.length > 0) {
          return errors
            .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
            .join(" | ");
        }
      }
    }
    return "Requête exécutée";
  };

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const res = await requestService.post(
      `${import.meta.env.VITE_API_URL}/admin/users`,
      formState,
    );
    const { status, response } = res;
    if (status >= 200 && status < 300) {
      setFeedback({ text: formatResponseMessage(response), status });
      resetForm();
      await getUsers();
    } else {
      setFeedback({ text: formatResponseMessage(response), status });
    }
  };

  const deleteUser = async (id: string) => {
    setFeedback(null);
    const res = await requestService.delete(
      `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
    );
    const { status, response } = res;
    if (status >= 200 && status < 300) {
      setFeedback({ text: formatResponseMessage(response), status });
      await getUsers();
    } else {
      setFeedback({ text: formatResponseMessage(response), status });
    }
  };

  const toggleUserModal = (user: User) => {
    setSelectedUser((prev) => (prev && prev.id === user.id ? null : user));
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <section className={style.section}>
        <h3 className={style.title}>Gestion des utilisateurs</h3>
        <div className={style.filterBox}>
          <form
            className={style.questionForm}
            name="createUser"
            id="createUser"
            onSubmit={submitForm}
          >
            <InputsComponent
              type="text"
              label="Nom"
              name="name"
              placeholder="Entrez le nom"
              value={formState.name}
              onChange={handleInputChange}
              tabIndex={1}
            />
            <InputsComponent
              type="email"
              label="Email"
              name="email"
              placeholder="Entrez l'email"
              value={formState.email}
              onChange={handleInputChange}
              tabIndex={2}
            />
            <InputsComponent
              type="password"
              label="Mot de passe"
              name="password"
              placeholder="Entrez le mot de passe"
              value={formState.password}
              onChange={handleInputChange}
              tabIndex={3}
            />
            <InputsComponent
              type="password"
              label="Confirmation"
              name="passwordConfirm"
              placeholder="Confirmez le mot de passe"
              value={formState.passwordConfirm}
              onChange={handleInputChange}
              tabIndex={4}
            />
            <ButtonComponent id="submitUser" label="Créer" />
          </form>
          {feedback ? (
            <div
              className={
                [
                  style.messageBox,
                  feedback.status >= 200 && feedback.status < 300
                    ? style.messageSuccess
                    : style.messageError,
                ].join(" ")
              }
              role="status"
            >
              {feedback.text}
            </div>
          ) : null}
        </div>
        <div className={style.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Identifiant</th>
                <th>Modifier</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {hasUsers ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className={style.quizId}>{user.id}</td>
                    <td>
                      <ActionComponent
                        label="Modifier le rôle"
                        type="action"
                        id={`update-${user.id}`}
                        onClick={() => toggleUserModal(user)}
                      />
                    </td>
                    <td>
                      <ActionComponent
                        label="Supprimer"
                        type="alert"
                        id={`delete-${user.id}`}
                        onClick={() => deleteUser(user.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    {isLoading ? "Chargement des utilisateurs..." : "Aucun utilisateur disponible"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {selectedUser ? (
        <UpdateUserRoleModalComponent
          user={selectedUser}
          onClose={closeModal}
          onSuccess={async () => {
            await getUsers();
          }}
          setFeedback={setFeedback}
        />
      ) : null}
    </>
  );
}

export default UserComponent;
