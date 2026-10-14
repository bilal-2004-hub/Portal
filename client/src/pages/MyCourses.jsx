import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import { getMyCourses } from '../api/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await getMyCourses();
        setCourses(response.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your courses..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">My courses</h1>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">You have not enrolled in any courses yet.</p>
          <Link to="/courses" className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {courses.map((item) => (
            <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{item.courseId?.title || 'Course'}</h2>
                  <p className="mt-1 text-sm text-slate-500">Enrollment date: {new Date(item.enrolledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-3">
                  <Link to={`/courses/${item.courseId?._id}`} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                    Continue
                  </Link>
                  <Link to={`/courses/${item.courseId?._id}/quiz`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    Take Quiz
                  </Link>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-900">{item.progress || 0}%</span>
                </div>
                <ProgressBar value={item.progress || 0} />
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Status</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
