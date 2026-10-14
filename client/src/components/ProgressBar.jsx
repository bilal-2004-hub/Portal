const ProgressBar = ({ value = 0, height = 'h-2.5' }) => (
  <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${height}`}>
    <div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

export default ProgressBar;
