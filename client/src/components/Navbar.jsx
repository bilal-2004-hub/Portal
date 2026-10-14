import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            S
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">Student Portal</div>
            <div className="text-xs text-slate-500">Learning Hub</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-slate-800">{user?.name || 'Student'}</div>
            <div className="text-xs text-slate-500">{user?.studentId || 'Student ID'}</div>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
