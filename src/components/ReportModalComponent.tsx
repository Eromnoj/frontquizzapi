import { useState } from "react";
import { createPortal } from "react-dom";
import RequestService from "../services/requestService";
import InputsComponent from "./InputsComponent";
import ActionComponent from "./ActionComponent";
import modalStyle from "../styles/components/UpdateModalComponent.module.scss";
import buttonStyle from "../styles/components/ButtonComponent.module.scss";

type ReportModalProps = {
  onClose: () => void;
};

function ReportModalComponent({ onClose }: ReportModalProps) {
  const requestService = RequestService.getInstance();
  const [quizId, setQuizId] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setQuizId("");
    setReason("");
  };

  const closeModal = () => {
    resetForm();
    setMessage("");
    setStatus(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quizId.trim()) {
      setMessage("Merci d'indiquer l'identifiant du quiz.");
      setStatus(400);
      return;
    }
    setIsSubmitting(true);
    const response = await requestService.post(
      `${import.meta.env.VITE_API_URL}/quiz/${quizId}/report`,
      { reason }
    );

    setStatus(response.status);
    setMessage(response.response?.msg ?? "Signalement envoyé.");
    setIsSubmitting(false);
    if (response.status >= 200 && response.status < 300) {
      resetForm();
    }
  };

  return createPortal(
    <div className={modalStyle.overlay} role="dialog" aria-modal="true">
      <div className={modalStyle.insertQuestion}>
        <div className={modalStyle.closeButton}>
          <ActionComponent
            label="Fermer"
            type="alert"
            id="close-report-modal"
            onClick={closeModal}
          />
        </div>
        <h2 className={modalStyle.questionTitle}>Signaler une question</h2>
        <p className={modalStyle.questionSubtitle}>
          Indiquez l'identifiant du quiz ainsi que la raison de votre signalement.
        </p>
        <form className={modalStyle.questionForm} onSubmit={handleSubmit}>
          <InputsComponent
            type="text"
            label="Identifiant du quiz"
            name="quizId"
            placeholder="Ex: 123456"
            value={quizId}
            onChange={(event) => setQuizId(event.target.value)}
            tabIndex={1}
          />
          <InputsComponent
            type="textarea"
            label="Raison du signalement"
            name="reason"
            placeholder="Décrivez brièvement le problème"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            tabIndex={2}
          />
          {message.length > 0 ? (
            <div
              className={
                status && status >= 400
                  ? `${modalStyle.questionMessage} ${modalStyle.msgError}`
                  : `${modalStyle.questionMessage} ${modalStyle.msgValid}`
              }
            >
              {message}
            </div>
          ) : null}
          <div className={buttonStyle.buttonContainer}>
            <button
              className={buttonStyle.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi..." : "Signaler la question"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default ReportModalComponent;
