import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCertificates, getMyCourses, getProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileResponse, myCoursesResponse, certificatesResponse] = await Promise.all([
          getProfile(),
          getMyCourses(),
          getCertificates(),
        ]);

        setProfile(profileResponse.data.data);
        setMyCourses(myCoursesResponse.data.data || []);
        setCertificates(certificatesResponse.data.data || []);
      } catch (error) {
        console.error('Dashboard load failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const totalEnrolled = myCourses.length;
  const completed = myCourses.filter((item) => item.status === 'completed').length;
  const pending = Math.max(totalEnrolled - completed, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Welcome back</p>
        <h1 className="mt-3 text-3xl font-bold">Welcome back, {user?.name || 'Student'} 👋</h1>
        <p className="mt-3 max-w-xl text-indigo-100">Continue learning and complete your courses to earn certificates and master new skills.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Enrolled Courses" value={totalEnrolled} subtitle="Active learning" accent="indigo" />
        <DashboardCard title="Completed" value={completed} subtitle="Courses finished" accent="emerald" />
        <DashboardCard title="Pending" value={pending} subtitle="Courses left" accent="amber" />
        <DashboardCard title="Certificates" value={certificates.length} subtitle="Earned so far" accent="purple" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent courses</h2>
            <Link to="/courses" className="text-sm font-semibold text-indigo-600">Browse all</Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              You haven’t enrolled in any courses yet.
            </div>
          ) : (
            <div className="space-y-4">
              {myCourses.slice(0, 3).map((item) => (
                <div key={item._id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.courseId?.title || 'Course'}</h3>
                      <p className="text-sm text-slate-500">Status: {item.status}</p>
                    </div>
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{item.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Student overview</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Student ID</span>
              <span className="font-medium text-slate-900">{profile?.studentId || user?.studentId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span className="font-medium text-slate-900">{profile?.email || user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Certificates</span>
              <span className="font-medium text-slate-900">{certificates.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completed courses</span>
              <span className="font-medium text-slate-900">{profile?.completedCourses || completed}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
