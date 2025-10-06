import { useEffect, useState } from 'react';
import RequestService from '../services/requestService';
import UpdateModalComponent from './UpdateModalComponent';
import ActionComponent from './ActionComponent';
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
};
function PendingComponent() {
  const requestService = RequestService.getInstance()
  const [quizz, setQuizz] = useState<any | null>(null)
  const getQuizzes = async () => {
    const resQuizz = await requestService.get(import.meta.env.VITE_API_URL + "/quiz/pending")
    setQuizz(resQuizz.response)
    console.log(quizz)
  }
  useEffect(function () {
    getQuizzes()
  }, [])
  const deleteQuestion = async (id: any) => {
    await requestService.delete(import.meta.env.VITE_API_URL + "/quiz/" + id)
    getQuizzes()
  }
  const validateQuestion = async (id: any, status: boolean) => {
    await requestService.put(import.meta.env.VITE_API_URL + "/quiz/pending/" + id, { status })
    getQuizzes()
  }
  const [quizId, setQuizId] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  const toggleForm = (id: string, data: QuizData) => {
    setQuizId(prev => (prev === id ? null : id));
    setQuizData(prev => (prev === data ? null : data))
  };

  return (
    <section className={style.section}>
      <h3 className={style.title}>Questions en attente de modération</h3>
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
                    <td><ActionComponent label='Valider' type='confirm' id='validate' onClick={() => validateQuestion(q.id, !q.pending)} /></td>
                    <td><ActionComponent label='Supprimer' type='alert' id='delete' onClick={() => deleteQuestion(q.id)} /></td>
                  </tr>
                )
              }) : null
          }
        </tbody>
      </table>
      {quizId && quizData ?
        <div className={style.modal}>
          <UpdateModalComponent data={quizData} cb={() => getQuizzes()} toggle={() => toggleForm(quizId, quizData)} />
        </div>
        : null}
    </section>
  );
}

export default PendingComponent;
