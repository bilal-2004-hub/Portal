import CourseCard from './CourseCard';

const CourseList = ({ courses, enrolledCourseIds = [] }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {courses.map((course) => (
      <CourseCard
        key={course._id}
        course={course}
        isEnrolled={enrolledCourseIds.includes(course._id)}
      />
    ))}
  </div>
);

export default CourseList;
