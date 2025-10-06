
import style from "../styles/components/UpdateModalComponent.module.scss";
import ButtonComponent from "../components/ButtonComponent";
import ActionComponent from "../components/ActionComponent";
import InputsComponent from "../components/InputsComponent";
import { useReducer, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import RequestService from "../services/requestService";
type QuizData = {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  difficulty: "facile" | "normal" | "difficile";
  badAnswer1: string;
  badAnswer2: string;
  badAnswer3: string;
};
function UpdateModalComponent({ data, cb, toggle }: { data: QuizData, cb: () => Promise<void>, toggle: () => void }) {
  const requestService = RequestService.getInstance();

  const initialState: QuizData = {
    id: data.id,
    question: data.question,
    answer: data.answer,
    categoryId: data.categoryId,
    difficulty: data.difficulty,
    badAnswer1: data.badAnswer1,
    badAnswer2: data.badAnswer2,
    badAnswer3: data.badAnswer3,
  };
  const [quizData, setQuizData] = useReducer(
    (state: QuizData, action: Partial<QuizData>) => ({ ...state, ...action }),
    initialState,
  );
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setQuizData({ [name]: value });
  };
  const [options, setOptions] = useState<{ id: string, name: string, slug: string }[] | []>([])
  const getCat = async () => {
    const resCat = await requestService.get(import.meta.env.VITE_API_URL + "/quiz/categories")
    setOptions(resCat.response)
  }

  useEffect(function () {
    getCat()
  }, [])
  const [message, setMessage] = useState<string>("");
  const [msgStatus, setMsgStatus] = useState<number>();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await requestService.put(
      import.meta.env.VITE_API_URL + "/quiz/" + quizData.id,
      {
        question: quizData.question,
        answer: quizData.answer,
        categoryId: quizData.categoryId,
        difficulty: quizData.difficulty,
        badAnswer1: quizData.badAnswer1,
        badAnswer2: quizData.badAnswer2,
        badAnswer3: quizData.badAnswer3,
      },
    );
    const data = await res.response;
    setMessage(data.msg);
    setMsgStatus(res.status);
    cb()
    toggle()
  };
  return createPortal(
    <div className={style.overlay} role="dialog" aria-modal="true">
      <div className={style.insertQuestion}>
        <div className={style.closeButton}>
          <ActionComponent label='Fermer' type='alert' id='close' onClick={() => toggle()} />
        </div>
        <h2 className={style.questionTitle}>Modification du Quiz id : {data.id}</h2>
        {message.length > 0 ? (
          <div
            id="message"
            className={
              msgStatus == 400
                ? [style.questionMessage, style.msgError].join(" ")
                : [style.questionMessage, style.msgValid].join(" ")
            }
          >
            {message}
          </div>
        ) : null}
        <form
          className={style.questionForm}
          name="submitQuestion"
          id="submitQuestion"
          onSubmit={handleSubmit}
        >
          <InputsComponent
            type="text"
            label="Question"
            name="question"
            placeholder="Entrez votre question ici"
            value={quizData.question}
            onChange={handleInputChange}
            tabIndex={1}
          />
          <InputsComponent
            type="text"
            label="Bonne réponse"
            name="answer"
            placeholder="Entrez la bonne réponse ici"
            value={quizData.answer}
            onChange={handleInputChange}
            tabIndex={2}
          />
          <InputsComponent
            type="text"
            label="Mauvaise réponse 1"
            name="badAnswer1"
            placeholder="Entrez une mauvaise réponse ici"
            value={quizData.badAnswer1}
            onChange={handleInputChange}
            tabIndex={3}
          />
          <InputsComponent
            type="text"
            label="Mauvaise réponse 2"
            name="badAnswer2"
            placeholder="Entrez une autre mauvaise réponse ici"
            value={quizData.badAnswer2}
            onChange={handleInputChange}
            tabIndex={4}
          />
          <InputsComponent
            type="text"
            label="Mauvaise réponse 3"
            name="badAnswer3"
            placeholder="Entrez encore une autre mauvaise réponse ici"
            value={quizData.badAnswer3}
            onChange={handleInputChange}
            tabIndex={5}
          />
          <InputsComponent
            type="select"
            label="Catégorie"
            name="categoryId"
            placeholder="Sélectionnez une catégorie"
            value={quizData.categoryId}
            onChange={handleInputChange}
            tabIndex={6}
            options={options}
          />
          <InputsComponent
            type="radio"
            label="Difficulté"
            name="difficulty"
            value={quizData.difficulty}
            onChange={handleInputChange}
            tabIndex={7}
            radioOptions={[
              { id: "facile", label: "Facile", checked: "facile" === quizData.difficulty },
              { id: "normal", label: "Normal", checked: "normal" === quizData.difficulty },
              { id: "difficile", label: "Difficile", checked: "difficile" === quizData.difficulty },
            ]}
            radioName="difficulty"
          />
          <ButtonComponent id="submitQuiz" label="Soumettre la question" />
        </form>
      </div>
    </div>,
    document.body
  )
}

export default UpdateModalComponent
