import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import MyCourses from './pages/MyCourses';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import QuizReview from './pages/QuizReview';
import Certificates from './pages/Certificates';
import CertificateDetails from './pages/CertificateDetails';
import VerifyCertificate from './pages/VerifyCertificate';

const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-100">
    <Navbar />
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/verify-certificate" element={<VerifyCertificate />} />

      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />

      <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><Dashboard /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProtectedLayout><Profile /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><ProtectedLayout><Courses /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/courses/:courseId" element={<ProtectedRoute><ProtectedLayout><CourseDetails /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/my-courses" element={<ProtectedRoute><ProtectedLayout><MyCourses /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/courses/:courseId/quiz" element={<ProtectedRoute><ProtectedLayout><Quiz /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/quiz-result" element={<ProtectedRoute><ProtectedLayout><QuizResult /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/courses/:courseId/quiz/attempts/:attemptId/review" element={<ProtectedRoute><ProtectedLayout><QuizReview /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><ProtectedLayout><Certificates /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/certificates/:id" element={<ProtectedRoute><ProtectedLayout><CertificateDetails /></ProtectedLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
