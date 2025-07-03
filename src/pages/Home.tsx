import RequestService from "../services/requestService"
import { useEffect, useState } from "react"


type Quizzes = {
      id: string,
      question: string,
      answer: string,
      categoryId: string,
      category: string,
      difficulty: string,
      badAnswers: string[]
    }
function Home() {

  const requestService = RequestService.getInstance()
  const [quizzes, setQuizzes] = useState<Quizzes[]>([])

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await requestService.get(`${import.meta.env.VITE_API_URL}/quiz`);
        console.log("response", response.quizzes);
        if (response.quizzes) {
          setQuizzes(response.quizzes);
        } else {
          console.error("Erreur lors de la récupération des quizzes:", response.response);
        }
      } catch (error) {
        console.error("Erreur de réseau ou autre:", error);
      }
    };

    fetchQuizzes();
  }, [requestService, setQuizzes]);
  // Si l'utilisateur est déjà connecté, on le redirige vers la page d'accueil

  console.log("quizzes", quizzes);
  // const [error, setError] = React.useState<LoginType | null>(null);
  return (
    <>
    </>
  )
}

export default Home