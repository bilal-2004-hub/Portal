import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import QuizQuestion from '../components/QuizQuestion';
import { getQuiz, getQuizAttempts, submitQuiz } from '../api/api';

const Quiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [answers, setAnswers] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState({});
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const [quizResponse, attemptsResponse] = await Promise.all([
          getQuiz(courseId),
          getQuizAttempts(courseId),
        ]);

        setQuiz(quizResponse.data.data);
        setAnswers({});
        setActiveIndex(0);
        setQuestionStartedAt({});
        setNow(Date.now());
        setAttempts(attemptsResponse.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load quiz.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  useEffect(() => {
    if (!quiz?.questions[activeIndex]) return;

    const startedAt = Date.now();
    const questionId = quiz.questions[activeIndex]._id;
    setNow(startedAt);
    setQuestionStartedAt((previous) => (
      previous[questionId] ? previous : { ...previous, [questionId]: startedAt }
    ));
  }, [quiz, activeIndex]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleAnswerChange = (questionId, value) => {
    const startedAt = questionStartedAt[questionId];
    if (!startedAt || Date.now() >= startedAt + 30000) return;

    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const response = await submitQuiz(courseId, answers);
      navigate('/quiz-result', { state: { result: response.data.data, courseId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading quiz..." />;
  if (!quiz) return <ErrorMessage message={error || 'Quiz not found.'} />;

  const currentQuestion = quiz.questions[activeIndex];
  const startedAt = questionStartedAt[currentQuestion._id];
  const remainingSeconds = startedAt
    ? Math.max(0, Math.min(30, Math.ceil((startedAt + 30000 - now) / 1000)))
    : 30;
  const isQuestionLocked = remainingSeconds === 0;
  const isLastQuestion = activeIndex === quiz.questions.length - 1;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
        <p className="mt-2 text-slate-600">Passing percentage: {quiz.passingPercentage}%</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>Question {activeIndex + 1} of {quiz.questions.length}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${((activeIndex + 1) / quiz.questions.length) * 100}%` }} />
        </div>
      </div>

      <QuizQuestion
        key={currentQuestion._id}
        index={activeIndex}
        question={currentQuestion}
        answer={answers[currentQuestion._id]}
        remainingSeconds={remainingSeconds}
        isLocked={isQuestionLocked}
        onSelect={handleAnswerChange}
      />

      {isQuestionLocked && (
        <p className="text-sm font-medium text-rose-700">Time is up. This question is locked and will count as incorrect if unanswered.</p>
      )}

      {error && <ErrorMessage message={error} />}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
          disabled={activeIndex === 0 || submitting}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        {isLastQuestion ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveIndex((index) => Math.min(quiz.questions.length - 1, index + 1))}
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            Next question
          </button>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Previous attempts</h2>
          <div className="space-y-2 text-sm text-slate-700">
            {attempts.map((attempt) => (
              <div key={attempt._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span>{new Date(attempt.attemptedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span>{attempt.percentage}% • {attempt.passed ? 'Passed' : 'Failed'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
