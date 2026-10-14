import { useEffect, useState } from 'react';
import CourseList from '../components/CourseList';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCourses, getMyCourses } from '../api/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [coursesResponse, myCoursesResponse] = await Promise.all([getCourses(), getMyCourses()]);
        setCourses(coursesResponse.data.data || []);
        setMyCourses(myCoursesResponse.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <LoadingSpinner message="Loading courses..." />;

  const enrolledCourseIds = myCourses.map((course) => (typeof course.courseId === 'string' ? course.courseId : course.courseId?._id)).filter(Boolean);
  const availableCourses = courses.filter((course) => !enrolledCourseIds.includes(course._id));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Available courses</h1>
        <p className="mt-2 text-slate-600">Explore new learning paths and enroll in your next course.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-indigo-50 px-3 py-1">Minimum 1 course</span>
          <span className="rounded-full bg-indigo-50 px-3 py-1">Max 6 total</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Max 4 core</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Max 2 electives</span>
        </div>
      </div>

      {availableCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
          You’re enrolled in all available courses.
        </div>
      ) : (
        <CourseList courses={availableCourses} />
      )}
    </div>
  );
};

export default Courses;
