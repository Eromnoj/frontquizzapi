import style from '../styles/Home.module.scss'
import InputsComponent from '../components/InputsComponent'
import { useReducer } from 'react'
import RequestService from '../services/requestService'


function Home() {
  const requestService = RequestService.getInstance()
  type QuizData = {
    question: string,
    answer: string,
    categoryId: string,
    difficulty: 'facile' | 'normal' | 'difficile',
    badAnswer1: string,
    badAnswer2: string,
    badAnswer3: string,
  }
  const initialState: QuizData = {
    question: '',
    answer: '',
    categoryId: '',
    difficulty: 'facile',
    badAnswer1: '',
    badAnswer2: '',
    badAnswer3: '',
  }
  const [quizData, setQuizData] = useReducer((state: QuizData, action: Partial<QuizData>) => ({ ...state, ...action }), initialState);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuizData({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    requestService.post(import.meta.env.VITE_API_URL + '/quiz', {
      question: quizData.question,
      answer: quizData.answer,
      categoryId: quizData.categoryId,
      difficulty: quizData.difficulty,
      badAnswer1: quizData.badAnswer1,
      badAnswer2: quizData.badAnswer2,
      badAnswer3: quizData.badAnswer3,
    })
  };
  return (

    <div className={style.container}>
      <header className={style.header}>
        <h1 className="">Simple Quiz API</h1>

      </header>
      <main className={style.main}>

        <div className="">
          <h2 className="">Proposez vos questions !</h2>
          <p className="">L'API se construit grâce à la communauté. Vous pouvez proposer vos questions en remplissant le formulaire suivant :</p>


          <div id="message" className=""></div>
          <form className="" name="submitQuestion" id="submitQuestion" onSubmit={handleSubmit}>
            <InputsComponent type="text" label="Question" name="question" placeholder="Entrez votre question ici" value={quizData.question} onChange={handleInputChange} tabIndex={1} />
            <InputsComponent type="text" label="Bonne réponse" name="answer" placeholder="Entrez la bonne réponse ici" value={quizData.answer} onChange={handleInputChange} tabIndex={2} />
            <InputsComponent type="text" label="Mauvaise réponse 1" name="badAnswer1" placeholder="Entrez une mauvaise réponse ici" value={quizData.badAnswer1} onChange={handleInputChange} tabIndex={3} />
            <InputsComponent type="text" label="Mauvaise réponse 2" name="badAnswer2" placeholder="Entrez une autre mauvaise réponse ici" value={quizData.badAnswer2} onChange={handleInputChange} tabIndex={4} />
            <InputsComponent type="text" label="Mauvaise réponse 3" name="badAnswer3" placeholder="Entrez encore une autre mauvaise réponse ici" value={quizData.badAnswer3} onChange={handleInputChange} tabIndex={5} />
            <InputsComponent type="select" label="Catégorie" name="categoryId" placeholder="Sélectionnez une catégorie" value={quizData.categoryId} onChange={handleInputChange} tabIndex={6}
              options={[
                { id: 'tv_cinema', label: 'TV & Cinéma' },
                { id: 'geographie', label: 'Géographie' },
                { id: 'histoire', label: 'Histoire' },
                { id: 'sciences', label: 'Sciences' },
                { id: 'sport', label: 'Sport' },
                { id: 'musique', label: 'Musique' },
              ]}
            />
            <InputsComponent type="radio" label="Difficulté" name="difficulty" value={quizData.difficulty} onChange={handleInputChange} tabIndex={7}
              radioOptions={[
                { id: 'facile', label: 'Facile' },
                { id: 'normal', label: 'Normal' },
                { id: 'difficile', label: 'Difficile' },
              ]}
              radioName="difficulty"
            />
            <div className="">
              <button className="" id="submitQuiz">Soumettre la question</button>
            </div>
          </form>
        </div>



        <div id="exemple" className="">
          <h3 className="">Une API pour créer des quiz dans vos applis !</h3>
          <p className="">
            Cette API est facile à utiliser, référez-vous à la documentation en suivant ce lien :
            <a href="/documentation" className="">Documentation</a>
          </p>
          <div>
            <p className="">Exemple de requête :
            </p>
            <div className="">
              <code>https://quizzapi.jomoreschi.fr/api/v2/quiz?limit=5&category=tv_cinema&difficulty=facile</code>
            </div>
            <p className="">Structure de la réponse :
            </p>
            <div className="">
              <code>{'{'}<br />
                <span className="">"count":</span>
                1,<br />
                <span className="">"quizzes"</span>: [<br />
                {'{'}<br />
                <span className="">
                  "_id":</span>
                "634661448f0049033d2eadb2",<br />
                <span className="">"question":</span>
                "Lequel de ces films n'a pas été réalisé par Quentin Tarentino ?",<br />
                <span className="">"answer":</span>
                "Matrix",<br />
                <span className="">"badAnswers":</span>
                [<br />
                "Pulp Fiction",<br />
                "Kill Bill",<br />
                "Les huit salopards"<br />
                ],<br />
                <span className="">"category":</span>
                "tv_cinema",<br />
                <span className="">"difficulty":</span>
                "facile",<br />
                {'}'}<br />
                ]<br />
                {'}'}</code>
            </div>
          </div>
        </div>
      </main>

      <footer className={style.footer}>
        <h3>Réalisé par Jonathan Moreschi.</h3>
        <p>Lien vers le gitHub du projet :
          <a href="https://github.com/Eromnoj/quizAPI" className="">https://github.com/Eromnoj/quizAPI</a>
        </p>

      </footer>
    </div>
  )
}

export default Home