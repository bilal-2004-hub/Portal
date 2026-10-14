import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiBaseUrl = configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:5000' : '');
const API_URL = apiBaseUrl
  ? `${apiBaseUrl.replace(/(?:\/api)+\/?$/i, '').replace(/\/+$/, '')}/api`
  : '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (!API_URL) {
    return Promise.reject(new Error('VITE_API_URL must be set to the deployed backend URL.'));
  }

  if (!import.meta.env.DEV) {
    try {
      const apiOrigin = new URL(API_URL).origin;
      if (apiOrigin === window.location.origin || /^(localhost|127\.0\.0\.1)$/.test(new URL(API_URL).hostname)) {
        return Promise.reject(new Error('VITE_API_URL must point to the deployed backend, not localhost or this frontend.'));
      }
    } catch (error) {
      return Promise.reject(new Error('VITE_API_URL must be an absolute backend URL.'));
    }
  }

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
