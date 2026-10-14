import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Certificates', to: '/certificates' },
  { label: 'Profile', to: '/profile' },
  { label: 'Verify Certificate', to: '/verify-certificate' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const isCoursesSection = pathname === '/my-courses' || pathname.startsWith('/courses');
  const [coursesOpen, setCoursesOpen] = useState(isCoursesSection);

  useEffect(() => {
    if (isCoursesSection) setCoursesOpen(true);
  }, [isCoursesSection]);

  return (
    <aside className="no-print h-full w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        {navItems.slice(0, 1).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <div>
          <div
            className={`flex w-full items-center justify-between rounded-xl px-4 py-2 transition ${
              isCoursesSection ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <NavLink to="/my-courses" end className="flex flex-1 items-center py-1 text-left text-sm font-medium">
              Courses
            </NavLink>
            <button
              type="button"
              aria-label={coursesOpen ? 'Collapse Courses submenu' : 'Expand Courses submenu'}
              aria-expanded={coursesOpen}
              aria-controls="courses-submenu"
              onClick={() => setCoursesOpen((open) => !open)}
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
                isCoursesSection ? 'border-white/25 bg-white/10' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <span aria-hidden="true" className={`h-2 w-2 border-b-2 border-r-2 transition-transform duration-200 ${coursesOpen ? 'translate-y-0.5 rotate-[225deg]' : '-translate-y-0.5 rotate-45'}`} />
            </button>
          </div>

          {coursesOpen && (
            <div id="courses-submenu" className="mt-1 space-y-1 pl-3">
              <NavLink
                to="/my-courses"
                end
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                My Courses
              </NavLink>
              <NavLink
                to="/courses"
                end
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                Available Courses
              </NavLink>
            </div>
          )}
        </div>

        {navItems.slice(1).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
      </div>
    </aside>
  );
};

export default Sidebar;
