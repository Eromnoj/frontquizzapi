
import style from "../styles/components/UpdateModalComponent.module.scss";
import ButtonComponent from "./ButtonComponent";
import ActionComponent from "./ActionComponent";
import InputsComponent from "./InputsComponent";
import { useReducer, useState } from "react";
import { createPortal } from "react-dom";
import RequestService from "../services/requestService";
type CatData = {
  id: string;
  name: string;
  slug: string;
};
function UpdateModalComponent({ data, cb, toggle }: { data: CatData, cb: () => Promise<void>, toggle: () => void }) {
  const requestService = RequestService.getInstance();

  const initialState: CatData = {
    id: data.id,
    name: data.name,
    slug: data.slug,
  };
  const [catData, setCatData] = useReducer(
    (state: CatData, action: Partial<CatData>) => ({ ...state, ...action }),
    initialState,
  );
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setCatData({ [name]: value });
  };
  const [message, setMessage] = useState<string>("");
  const [msgStatus, setMsgStatus] = useState<number>();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await requestService.put(
      import.meta.env.VITE_API_URL + "/admin/categories/" + catData.id,
      {
        name: catData.name,
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
        <h2 className={style.questionTitle}>Modification de la catégorie id : {data.id}</h2>
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
          name="submitCat"
          id="submitCat"
          onSubmit={handleSubmit}
        >
          <InputsComponent
            type="text"
            label="Nom"
            name="name"
            placeholder="Entrez votre catégorie ici"
            value={catData.name}
            onChange={handleInputChange}
            tabIndex={1}
          />
          <ButtonComponent id="submitQuiz" label="Soumettre la catégorie" />
        </form>
      </div>
    </div>,
    document.body
  )
}

export default UpdateModalComponent
