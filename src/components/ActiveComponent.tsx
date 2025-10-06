import { useEffect, useState, useReducer } from 'react';
import RequestService from '../services/requestService';
import UpdateModalComponent from './UpdateModalComponent';
import ActionComponent from './ActionComponent';
import InputsComponent from './InputsComponent';
import ButtonComponent from './ButtonComponent';
import style from '../styles/components/PendingComponent.module.scss'
type QuizData = {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  difficulty: "facile" | "normal" | "difficile";
  badAnswer1: string;
  badAnswer2: string;
  badAnswer3: string;
  pending: boolean
};
type SearchData = {
  search: string;
  categoryId: string;
  difficulty: "facile" | "normal" | "difficile" | "";
};
type PaginationData = {
  page: number;
  totalPages: number;
  count: number;
}
type PaginationAction =
  | { type: "increase" }
  | { type: "initZero" }
  | { type: "decrease" }
  | { type: "resVal"; value: PaginationData };

function ActiveComponent() {
  const requestService = RequestService.getInstance()
  const [quizz, setQuizz] = useState<any | null>(null)

  const initialState: SearchData = {
    search: "",
    categoryId: "",
    difficulty: "",
  };
  const [searchData, setSearchData] = useReducer(
    (state: SearchData, action: Partial<SearchData>) => ({ ...state, ...action }),
    initialState,
  );
  const initialStatePage: PaginationData = {
    page: 1,
    totalPages: 0,
    count: 0,
  };
 const [paginationData, setPaginationData] = useReducer(
  (state: PaginationData, action: PaginationAction): PaginationData => {
    
      switch (action.type) {
        case "initZero":
          return {...state, page: 1};
        case "increase":
          return state.page < state.totalPages
            ? { ...state, page: state.page + 1 }
            : state;
        case "decrease":
          return state.page > 0
            ? { ...state, page: state.page - 1 }
            : state;
        case "resVal":
          return action.value
        default:
          return state;
      }
  },
  initialStatePage
);
 
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setSearchData({ [name]: value });
    console.log(searchData)
  };
  const [options, setOptions] = useState<{ id: string, name: string, slug: string }[] | []>([])
  const getCat = async () => {
    const resCat = await requestService.get(import.meta.env.VITE_API_URL + "/quiz/categories")
    setOptions(resCat.response)
  }
  const getQuizzes = async (page: number) => {
    const resQuizz = await requestService.get(import.meta.env.VITE_API_URL + "/quiz/getAll?page=" + page + "&search=" + searchData.search + "&category=" + searchData.categoryId + "&difficulty=" + searchData.difficulty)
    setQuizz(resQuizz.response.quizzes)
    setPaginationData({type: "resVal", value: {
      page: resQuizz.response.page,
      totalPages: resQuizz.response.totalPages,
      count: resQuizz.response.count
    }})
    console.log(quizz)
  }
useEffect(function () {
    getQuizzes(paginationData.page)
  }, [paginationData.page])

  useEffect(function () {
    getCat()
  }, [])
  const deleteQuestion = async (id: any) => {
    await requestService.delete(import.meta.env.VITE_API_URL + "/quiz/" + id)
    getQuizzes(paginationData.page)
  }
  const validateQuestion = async (id: any, status: boolean) => {
    await requestService.put(import.meta.env.VITE_API_URL + "/quiz/pending/" + id, { status })
    getQuizzes(paginationData.page)
  }
  const [quizId, setQuizId] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  const toggleForm = (id: string, data: QuizData) => {
    setQuizId(prev => (prev === id ? null : id));
    setQuizData(prev => (prev === data ? null : data))
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    getQuizzes(1)
  }
  return (
    <section className={style.section}>
      <h3 className={style.title}>Toutes les questions disponibles</h3>
      <div className={style.filterBox}>
        <form
          className={style.questionForm}
          name="filterQuiz"
          id="filterQuiz"
          onSubmit={submitForm}
        >
          <InputsComponent
            type="text"
            label="Recherche (id, question, réponses...)"
            name="search"
            placeholder="Entrez votre question ici"
            value={searchData.search}
            onChange={handleInputChange}
            tabIndex={1}
          />

          <InputsComponent
            type="select"
            label="Catégorie"
            name="categoryId"
            placeholder="Sélectionnez une catégorie"
            value={searchData.categoryId}
            onChange={handleInputChange}
            tabIndex={6}
            options={options}
          />
          <InputsComponent
            type="radio"
            label="Difficulté"
            name="difficulty"
            value={searchData.difficulty}
            onChange={handleInputChange}
            tabIndex={7}
            radioOptions={[
              { id: "", label: "Tous" },
              { id: "facile", label: "Facile" },
              { id: "normal", label: "Normal" },
              { id: "difficile", label: "Difficile" },
            ]}
            radioName="difficulty"
          />
          <ButtonComponent id="searchQuiz" label="Chercher" />
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Réponse</th>
            <th>Mauvais 1</th>
            <th>Mauvais 2</th>
            <th>Mauvais 3</th>
            <th>Difficulté</th>
            <th>Modifier</th>
            <th>Valider</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {
            quizz && quizz != null ?
              quizz.map((q: any) => {
                return (
                  <tr key={q.id}>
                    <td>{q.question}</td>
                    <td>{q.answer}</td>
                    <td>{q.badAnswer1}</td>
                    <td>{q.badAnswer2}</td>
                    <td>{q.badAnswer3}</td>
                    <td>{q.difficulty}</td>
                    <td><ActionComponent label='Modifier' type='action' id='modify' onClick={() => toggleForm(q.id, q)} /></td>
                    <td><ActionComponent label={q.pending ? 'Valider' : 'Cacher'} type={q.pending ? 'confirm' : 'alert'} id='validate' onClick={() => validateQuestion(q.id, !q.pending)} /></td>
                    <td><ActionComponent label='Supprimer' type='alert' id='delete' onClick={() => deleteQuestion(q.id)} /></td>
                  </tr>
                )
              }) : null
          }
        </tbody>
      </table>
      <div className={style.pagination}>
        <button onClick={() => {
          setPaginationData({type:"decrease"})
        }} disabled={paginationData.page <= 1 }>Precedent</button>
        <div>
          {paginationData.page} / {paginationData.totalPages}
        </div>

        <button onClick={() => {
          setPaginationData({type:"increase"})
        }} disabled={paginationData.page >= paginationData.totalPages }>Suivant</button>
      </div>
      {quizId && quizData ?
        <div className={style.modal}>
          <UpdateModalComponent data={quizData} cb={() => getQuizzes(paginationData.page)} toggle={() => toggleForm(quizId, quizData)} />
        </div>
        : null}
    </section>
  );
}

export default ActiveComponent;
