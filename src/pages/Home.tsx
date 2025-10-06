import style from "../styles/Home.module.scss";
import ButtonComponent from "../components/ButtonComponent";
import InputsComponent from "../components/InputsComponent";
import { useReducer, useState } from "react";
import RequestService from "../services/requestService";
import { useEffect } from "react";
import { useAuth } from "../hooks/AuthHook";
import AdminLayout from "../layouts/AdminLayout";
function Home() {
  const { user } = useAuth();
  const requestService = RequestService.getInstance();
  type QuizData = {
    question: string;
    answer: string;
    categoryId: string;
    difficulty: "facile" | "normal" | "difficile";
    badAnswer1: string;
    badAnswer2: string;
    badAnswer3: string;
  };
  const initialState: QuizData = {
    question: "",
    answer: "",
    categoryId: "",
    difficulty: "facile",
    badAnswer1: "",
    badAnswer2: "",
    badAnswer3: "",
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
  const [count, setCount] = useState<number>(0)
  const getCount = async () => {
    const resCount = await requestService.get(import.meta.env.VITE_API_URL + "/quiz/count")
    setCount(resCount.response)
    console.log("COUNT", resCount)
  }
  useEffect(function () {
    getCat()
    getCount()
  }, [])
  const [message, setMessage] = useState<string>("");
  const [msgStatus, setMsgStatus] = useState<number>();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await requestService.post(
      import.meta.env.VITE_API_URL + "/quiz",
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
  };
  const content = (
    <div className={style.container}>
      <header className={style.header}>
        <h1>Simple Quiz API</h1>
      </header>
      <main className={style.main}>
        <div className={style.statsRow}>
          <div className={style.counterCard} aria-live="polite">
            <div className={style.counterIcon} aria-hidden>✨</div>
            <div className={style.counterValue}>{count}</div>
            <div className={style.counterLabel}>Quiz disponibles</div>
          </div>
          <div className={style.introCard}>
            <h2>Une API simple et ouverte</h2>
            <p>
              Il s’agit d’une API conçue pour permettre à chacun d’ajouter des quiz
              sur son site ou son application, facilement et en toute autonomie.
              Tout le monde peut contribuer à la constitution de la base de données
              en proposant des questions; une modération légère garantit la qualité
              et la cohérence du contenu.
            </p>
          </div>
        </div>
        <div className={style.insertQuestion}>
          <h2 className={style.questionTitle}>Proposez vos questions !</h2>
          <p className={style.questionSubtitle}>
            L'API se construit grâce à la communauté. Vous pouvez proposer vos
            questions en remplissant le formulaire suivant :
          </p>
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
                { id: "facile", label: "Facile" },
                { id: "normal", label: "Normal" },
                { id: "difficile", label: "Difficile" },
              ]}
              radioName="difficulty"
            />
            <ButtonComponent id="submitQuiz" label="Soumettre la question" />
          </form>
        </div>

        <div id="exemple" className={style.example}>
          <h2>Une API pour créer des quiz dans vos applis !</h2>
          <div>
            <p className={style.exampleSubtitle}>Exemple de requête :</p>
            <code>
              https://quizzapi.jomoreschi.fr/api/v2/quiz?limit=5&category=tv_cinema&difficulty=facile
            </code>
            <p className={style.exampleSubtitle}>Structure de la réponse :</p>
            <code>
              {"{"}
              <br />
              <span className="">"count":</span>
              1,
              <br />
              <span className="">"quizzes"</span>: [<br />
              {"{"}
              <br />
              <span className="">"_id":</span>
              "634661448f0049033d2eadb2",
              <br />
              <span className="">"question":</span>
              "Lequel de ces films n'a pas été réalisé par Quentin Tarentino ?",
              <br />
              <span className="">"answer":</span>
              "Matrix",
              <br />
              <span className="">"badAnswers":</span>
              [<br />
              "Pulp Fiction",
              <br />
              "Kill Bill",
              <br />
              "Les huit salopards"
              <br />
              ],
              <br />
              <span className="">"category":</span>
              "tv_cinema",
              <br />
              <span className="">"difficulty":</span>
              "facile",
              <br />
              {"}"}
              <br />
              ]<br />
              {"}"}
            </code>
            <p className={style.exampleSubtitle}>Slug des catégories :</p>
            <code>
              {options.length > 0 ? options.map((o, i) => {
                return (
                  <div key={i}>
                    {o.name} : {o.slug}
                  </div>
                )
              }) : null
              }
            </code>
          </div>
        </div>
      </main>

      <footer className={style.footer}>
        <h3>
          Réalisé par{" "}
          <a href="https://www.linkedin.com/in/jomoreschi/">
            Jonathan Moreschi.
          </a>
        </h3>
        <p>
          Lien vers le gitHub du projet :
          <a href="https://github.com/Eromnoj/quizAPI" className="">
            https://github.com/Eromnoj/quizAPI
          </a>
        </p>
      </footer>
    </div>
  );

  return user ? (
    <AdminLayout>{content}</AdminLayout>
  ) : (
    content
  );
}

export default Home;
