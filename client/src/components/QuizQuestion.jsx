const QuizQuestion = ({ question, index, answer, remainingSeconds, isLocked, onSelect }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <p className="text-lg font-semibold text-slate-800">
        {index + 1}. {question.question}
      </p>
      <div className={`shrink-0 rounded-lg px-3 py-2 text-sm font-bold tabular-nums ${remainingSeconds <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700'}`} aria-live="polite">
        {isLocked ? 'Locked' : `${remainingSeconds}s left`}
      </div>
    </div>
    <div className="space-y-3">
      {question.options.map((option) => (
        <label key={option} className={`flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50'}`}>
          <input
            type="radio"
            name={`answer-${question._id}`}
            value={option}
            checked={answer === option}
            onChange={() => onSelect(question._id, option)}
            disabled={isLocked}
            className="h-4 w-4 text-indigo-600"
          />
          <span className="text-slate-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export default QuizQuestion;
