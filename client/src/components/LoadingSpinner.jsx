const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-slate-600">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;
