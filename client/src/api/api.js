import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studentPortalToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studentPortalToken');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

export const signup = (payload) => api.post('/auth/signup', payload);
export const login = (payload) => api.post('/auth/login', payload);
export const getMe = () => api.get('/auth/me');
export const getProfile = () => api.get('/students/profile');
export const updateProfile = (payload) => api.put('/students/profile', payload);
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const enrollCourse = (courseId) => api.post('/enrollments', { courseId });
export const getMyCourses = () => api.get('/enrollments/my-courses');
export const getEnrollment = (courseId) => api.get(`/enrollments/${courseId}`);
export const getQuiz = (courseId) => api.get(`/quizzes/${courseId}`);
export const submitQuiz = (courseId, answers) => api.post(`/quizzes/${courseId}/submit`, { answers });
export const getQuizAttempts = (courseId) => api.get(`/quizzes/${courseId}/attempts`);
export const getQuizAttemptReview = (courseId, attemptId) => api.get(`/quizzes/${courseId}/attempts/${attemptId}/review`);
export const getCertificates = () => api.get('/certificates');
export const getCertificate = (id) => api.get(`/certificates/${id}`);
export const verifyCertificate = (certificateId) => api.get(`/certificates/verify/${certificateId}`);

export default api;
