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
  const [displayedCount, setDisplayedCount] = useState<number>(0)
  const getCount = async () => {
    const resCount = await requestService.get(import.meta.env.VITE_API_URL + "/quiz/count")
    setCount(resCount.response)
    console.log("COUNT", resCount)
  }
  useEffect(function () {
    getCat()
    getCount()
  }, [])
  // Count-up animation when count updates
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = displayedCount
    const to = count
    const duration = 1200
    const tick = (t: number) => {
      const elapsed = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - elapsed, 3) // easeOutCubic
      const value = Math.round(from + (to - from) * eased)
      setDisplayedCount(value)
      if (elapsed < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count])

  // Magnetic hover for CTAs
  const handleCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    el.style.transform = `translate(${x * 8}px, ${y * 8}px)`
  }
  const handleCtaLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = ''
  }
  const [message, setMessage] = useState<string>("");
  const [msgStatus, setMsgStatus] = useState<number>();
  // Particles count for background
  const particles = Array.from({ length: 20 })

  // Generic tilt effect for cards (not on the form element itself)
  const handleTiltCard = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - y) * 8 // rotateX range
    const ry = (x - 0.5) * 10 // rotateY range
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }
  const handleTiltLeave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.transform = ''
  }
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
        <div className={style.particles} aria-hidden>
          {particles.map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <section className={style.hero}>
          <div className={style.heroContent}>
            <div className={style.kicker}>Open-source API</div>
            <h2 className={style.heroTitle}>Construis des Quiz <span>connectés</span></h2>
            <p className={style.heroSubtitle}>
              Une API contributive, prête à brancher dans vos applications. Créez, intégrez et
              partagez facilement des questions; faites grandir une base commune de quiz ouverte
              et collaborative.
            </p>
            <div className={style.ctaRow}>
              <a href="#submitQuestion" className={style.primaryCta} onMouseMove={handleCtaMove} onMouseLeave={handleCtaLeave}>Proposer une question</a>
              <a href="#exemple" className={style.secondaryCta} onMouseMove={handleCtaMove} onMouseLeave={handleCtaLeave}>Voir des exemples</a>
            </div>
            <div className={style.badges}>
              <span className={style.badge}>REST</span>
              <span className={style.badge}>TypeScript</span>
              <span className={style.badge}>Open Data</span>
            </div>
          </div>
          <div className={style.heroAside}>
            <div
              className={[style.counterCard, style.tilt].join(' ')}
              aria-live="polite"
              onMouseMove={handleTiltCard}
              onMouseLeave={handleTiltLeave}
            >
              <div className={style.counterValue}>{displayedCount}</div>
              <div className={style.counterLabel}>Quiz disponibles</div>
            </div>
            <div className={style.terminal}>
              <div className={style.termHeader}>
                <span />
                <span />
                <span />
              </div>
              <pre>
                {`curl -s "https://quizzapi.jomoreschi.fr/api/v2/quiz?limit=3&category=tv_cinema&difficulty=facile" | jq`}
              </pre>
            </div>
          </div>
        </section>
        <div
          id="submitQuestion"
          className={[style.insertQuestion, style.tilt].join(' ')}
          onMouseMove={handleTiltCard}
          onMouseLeave={handleTiltLeave}
        >
          <h2 className={style.questionTitle}>Proposez vos questions !</h2>
          <p className={style.questionSubtitle}>
            L'API se construit grâce à la communauté. Vous pouvez proposer vos
            questions en remplissant le formulaire suivant :
          </p>
          <form
            className={style.questionForm}
            name="submitQuestion"
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
            <ButtonComponent id="submitQuiz" label="Soumettre la question" />
          </form>
        </div>

        <div
          id="exemple"
          className={[style.example, style.tilt].join(' ')}
          onMouseMove={handleTiltCard}
          onMouseLeave={handleTiltLeave}
        >
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
          <a href="https://github.com/Eromnoj/quizzAPIv2" className="">
            https://github.com/Eromnoj/quizzAPIv2
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
