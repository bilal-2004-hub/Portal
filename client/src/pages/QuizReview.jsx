import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getQuizAttemptReview } from '../api/api';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const QuizReview = () => {
  const { courseId, attemptId } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await getQuizAttemptReview(courseId, attemptId);
        setReview(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load quiz review.');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [courseId, attemptId]);

  if (loading) return <LoadingSpinner message="Loading quiz review..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-indigo-600">Answer review</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{review.title}</h1>
        <p className="mt-2 text-slate-600">
          {review.incorrectQuestions.length === 0
            ? 'You answered every question correctly.'
            : `${review.incorrectQuestions.length} question${review.incorrectQuestions.length === 1 ? '' : 's'} to review`}
        </p>
      </div>

      {review.incorrectQuestions.map((question, index) => (
        <section key={question._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {index + 1}. {question.question}
          </h2>
          <div className="space-y-2">
            {question.options.map((option) => {
              const isCorrect = option === question.correctAnswer;
              const isSelected = option === question.selectedAnswer;
              const optionStyle = isCorrect
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : isSelected
                  ? 'border-red-300 bg-red-50 text-red-800'
                  : 'border-slate-200 bg-white text-slate-700';

              return (
                <div key={option} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${optionStyle}`}>
                  <span>{option}</span>
                  <span className="shrink-0 text-xs font-semibold">
                    {isCorrect ? 'Correct answer' : isSelected ? 'Your answer' : ''}
                  </span>
                </div>
              );
            })}
          </div>
          {!question.selectedAnswer && (
            <p className="mt-3 text-sm font-medium text-red-700">You did not answer this question.</p>
          )}
        </section>
      ))}

      <Link to={`/courses/${courseId}/quiz`} className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
        Back to quiz
      </Link>
    </div>
  );
};

export default QuizReview;