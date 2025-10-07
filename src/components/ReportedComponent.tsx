import { useCallback, useEffect, useState } from "react";
import RequestService from "../services/requestService";
import UpdateModalComponent from "./UpdateModalComponent";
import ActionComponent from "./ActionComponent";
import style from "../styles/components/PendingComponent.module.scss";

type Report = {
  id: string;
  reason: string;
  createdAt: string;
  quizId: string;
};

type QuizData = {
  id: string;
  question: string;
  answer: string;
  badAnswer1: string;
  badAnswer2: string;
  badAnswer3: string;
  difficulty: "facile" | "normal" | "difficile";
  pending: boolean;
  categoryId: string;
  reports?: Report[];
};

function normalizeResponse(payload: unknown): QuizData[] {
  if (Array.isArray(payload)) {
    return payload as QuizData[];
  }
  if (payload && typeof payload === "object") {
    const maybeArray = (payload as { quizzes?: QuizData[] }).quizzes;
    if (Array.isArray(maybeArray)) {
      return maybeArray;
    }
  }
  return [];
}

function ReportedComponent() {
  const requestService = RequestService.getInstance();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);

  const getReportedQuizzes = useCallback(async () => {
    const response = await requestService.get(`${import.meta.env.VITE_API_URL}/quiz/reported`);
    const normalized = normalizeResponse(response.response);
    setQuizzes(normalized);
  }, [requestService]);

  useEffect(() => {
    void getReportedQuizzes();
  }, [getReportedQuizzes]);

  const deleteQuestion = async (quizId: string) => {
    await requestService.delete(`${import.meta.env.VITE_API_URL}/quiz/${quizId}`);
    void getReportedQuizzes();
  };

  const clearReports = async (quizId: string) => {
    await requestService.delete(`${import.meta.env.VITE_API_URL}/quiz/${quizId}/reports`);
    void getReportedQuizzes();
  };

  const deleteSingleReport = async (reportId: string) => {
    await requestService.delete(`${import.meta.env.VITE_API_URL}/quiz/reports/${reportId}`);
    void getReportedQuizzes();
  };

  const togglePendingStatus = async (quiz: QuizData) => {
    await requestService.put(`${import.meta.env.VITE_API_URL}/quiz/pending/${quiz.id}`, {
      status: !quiz.pending,
    });
    void getReportedQuizzes();
  };

  const toggleModal = (quiz: QuizData) => {
    setSelectedQuiz(prev => (prev && prev.id === quiz.id ? null : quiz));
  };

  return (
    <>
      <section className={style.section}>
        <h3 className={style.title}>Questions signalées</h3>
        <div className={style.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Signalements</th>
                <th>Modifier</th>
                <th>Lever signalements</th>
                <th>Statut</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <tr key={quiz.id}>
                    <td className={style.quizId}>{quiz.id}</td>
                    <td>{quiz.question}</td>
                    <td>
                      {quiz.reports && quiz.reports.length > 0 ? (
                        <ul className={style.reportList}>
                          {quiz.reports.map(report => (
                            <li key={report.id}>
                              <div className={style.reportDetails}>
                                <span className={style.reportReason}>{report.reason}</span>
                                <span className={style.reportDate}>{new Date(report.createdAt).toLocaleString()}</span>
                              </div>
                              <button
                                type="button"
                                className={style.reportDelete}
                                onClick={() => deleteSingleReport(report.id)}
                              >
                                Supprimer
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>Aucun signalement</span>
                      )}
                    </td>
                    <td>
                      <ActionComponent
                        label="Modifier"
                        type="action"
                        id={`modify-${quiz.id}`}
                        onClick={() => toggleModal(quiz)}
                      />
                    </td>
                    <td>
                      <ActionComponent
                        label="Tout effacer"
                        type="confirm"
                        id={`clear-${quiz.id}`}
                        onClick={() => clearReports(quiz.id)}
                      />
                    </td>
                    <td>
                      <ActionComponent
                        label={quiz.pending ? "Valider" : "Masquer"}
                        type="confirm"
                        id={`toggle-${quiz.id}`}
                        onClick={() => togglePendingStatus(quiz)}
                      />
                    </td>
                    <td>
                      <ActionComponent
                        label="Supprimer"
                        type="alert"
                        id={`delete-${quiz.id}`}
                        onClick={() => deleteQuestion(quiz.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Aucun quiz signalé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {selectedQuiz ? (
        <UpdateModalComponent
          data={selectedQuiz}
          cb={getReportedQuizzes}
          toggle={() => toggleModal(selectedQuiz)}
        />
      ) : null}
    </>
  );
}

export default ReportedComponent;
