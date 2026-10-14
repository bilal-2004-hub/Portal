import { Link } from 'react-router-dom';

const CourseCard = ({ course, isEnrolled = false }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} alt={course.title} className="h-44 w-full object-cover" />
    <div className="p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{course.category}</span>
        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${course.type === 'Elective' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {course.type || 'Core'}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{course.description}</p>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p><span className="font-semibold text-slate-800">Instructor:</span> {course.instructor}</p>
        <p><span className="font-semibold text-slate-800">Duration:</span> {course.duration}</p>
        <p><span className="font-semibold text-slate-800">Level:</span> {course.difficulty}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Link to={`/courses/${course._id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          View Course
        </Link>
        {!isEnrolled ? (
          <Link to={`/courses/${course._id}`} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Enroll Now
          </Link>
        ) : (
          <Link to={`/courses/${course._id}`} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
            Continue Course
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default CourseCard;
