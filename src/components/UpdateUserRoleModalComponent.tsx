import {
  useMemo,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import style from "../styles/components/UpdateModalComponent.module.scss";
import ActionComponent from "./ActionComponent";
import ButtonComponent from "./ButtonComponent";
import InputsComponent from "./InputsComponent";
import RequestService from "../services/requestService";
import type { FeedbackState } from "./UserComponent";

type User = {
  id: string;
  email: string;
  role: string;
  name: string;
};

type UpdateUserRoleModalComponentProps = {
  user: User;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  setFeedback: Dispatch<SetStateAction<FeedbackState | null>>;
};

function UpdateUserRoleModalComponent({
  user,
  onClose,
  onSuccess,
  setFeedback,
}: UpdateUserRoleModalComponentProps) {
  const requestService = RequestService.getInstance();
  const [role, setRole] = useState<string>(user.role);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const roleOptions = useMemo(() => {
    const baseRoles = ["USER", "ADMIN"];
    if (user.role && !baseRoles.includes(user.role)) {
      baseRoles.unshift(user.role);
    }
    return Array.from(new Set(baseRoles));
  }, [user.role]);

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
        const entries = Object.entries(res.errors as Record<string, string[]>);
        if (entries.length > 0) {
          return entries
            .map(([key, messages]) => `${key}: ${messages.join(", ")}`)
            .join(" | ");
        }
      }
    }
    return "Requête exécutée";
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    const res = await requestService.put(
      `${import.meta.env.VITE_API_URL}/admin/users/${user.id}/role`,
      { role },
    );
    const { status: responseStatus, response } = res;
    const formattedMessage = formatResponseMessage(response);
    setStatus(responseStatus);
    setMessage(formattedMessage);
    setFeedback({ text: formattedMessage, status: responseStatus });

    if (responseStatus >= 200 && responseStatus < 300) {
      await onSuccess();
      onClose();
    }

    setIsSubmitting(false);
  };

  return createPortal(
    <div className={style.overlay} role="dialog" aria-modal="true">
      <div className={style.insertQuestion}>
        <div className={style.closeButton}>
          <ActionComponent label="Fermer" type="alert" id="close" onClick={onClose} />
        </div>
        <h2 className={style.questionTitle}>Modifier le rôle</h2>
        <p className={style.questionSubtitle}>
          {user.name} · {user.email}
        </p>
        {message.length > 0 ? (
          <div
            id="userRoleMessage"
            className={
              status && status >= 200 && status < 300
                ? [style.questionMessage, style.msgValid].join(" ")
                : [style.questionMessage, style.msgError].join(" ")
            }
          >
            {message}
          </div>
        ) : null}
        <form className={style.questionForm} onSubmit={handleSubmit}>
          <InputsComponent
            type="radio"
            label="Rôle"
            radioName="role"
            onChange={handleChange}
            radioOptions={roleOptions.map((option) => ({
              id: option,
              label: option,
              checked: role === option,
            }))}
          />
          <ButtonComponent id="updateUserRole" label={isSubmitting ? "Mise à jour..." : "Mettre à jour"} />
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default UpdateUserRoleModalComponent;
