const DashboardCard = ({ title, value, subtitle, accent = 'indigo' }) => {
  const accentStyles = {
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex rounded-xl px-3 py-2 text-xs font-semibold ${accentStyles[accent] || accentStyles.indigo}`}>
        {title}
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {subtitle && <div className="mt-2 text-sm text-slate-500">{subtitle}</div>}
    </div>
  );
};

export default DashboardCard;
