import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { enrollCourse, getCourse, getEnrollment } from '../api/api';
import ErrorMessage from '../components/ErrorMessage';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseResponse, enrollmentResponse] = await Promise.all([
          getCourse(courseId),
          getEnrollment(courseId).catch(() => null),
        ]);
        setCourse(courseResponse.data.data);
        setEnrolled(Boolean(enrollmentResponse?.data?.data));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    setActionLoading(true);
    setError('');

    try {
      await enrollCourse(courseId);
      setEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to enroll in course.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading course details..." />;
  if (!course) return <ErrorMessage message={error || 'Course not found.'} />;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} alt={course.title} className="h-72 w-full object-cover" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">{course.category}</span>
                <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${course.type === 'Elective' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {course.type || 'Core'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!enrolled) handleEnroll();
                else navigate(`/courses/${courseId}/quiz`);
              }}
              disabled={actionLoading}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {actionLoading ? 'Please wait...' : enrolled ? 'Start Learning' : 'Enroll Now'}
            </button>
          </div>

          <p className="mt-6 text-slate-600">{course.description}</p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Instructor</div>
              <div className="mt-2 font-semibold text-slate-900">{course.instructor}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Duration</div>
              <div className="mt-2 font-semibold text-slate-900">{course.duration}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Difficulty</div>
              <div className="mt-2 font-semibold text-slate-900">{course.difficulty}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Lessons</div>
              <div className="mt-2 font-semibold text-slate-900">{course.lessons || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Requirements</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            {(course.requirements || []).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Learning outcomes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            {(course.learningOutcomes || []).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
