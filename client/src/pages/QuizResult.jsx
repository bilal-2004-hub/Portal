import { Link, useLocation } from 'react-router-dom';

const QuizResult = () => {
  const { state } = useLocation();
  const result = state?.result;
  const courseId = state?.courseId;

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-700">No quiz result found.</p>
        <Link to="/my-courses" className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className={`mb-5 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {result.passed ? 'Passed' : 'Failed'}
      </div>

      <h1 className="text-3xl font-bold text-slate-900">{result.passed ? 'Congratulations! You passed the quiz.' : 'You did not pass the quiz. Please try again.'}</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Score</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{result.score}/{result.totalQuestions}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Percentage</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{result.percentage}%</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Status</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{result.passed ? 'Pass' : 'Retry'}</div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        {result.attempt?._id && courseId && (
          <Link to={`/courses/${courseId}/quiz/attempts/${result.attempt._id}/review`} className="rounded-xl border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
            Review incorrect answers
          </Link>
        )}
        <Link to="/my-courses" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
          Back to My Courses
        </Link>
        {!result.passed && (
          <Link to="/courses" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Retake Quiz
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizResult;
