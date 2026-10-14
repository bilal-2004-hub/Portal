import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileForm from '../components/ProfileForm';
import { getProfile, updateProfile } from '../api/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', profileImage: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const userData = response.data.data;
        setProfile(userData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          profileImage: userData.profileImage || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    const minimumLoader = new Promise((resolve) => window.setTimeout(resolve, 1000));

    try {
      const [response] = await Promise.all([updateProfile(formData), minimumLoader]);
      setProfile(response.data.data);
    } catch (err) {
      await minimumLoader;
      setError(err.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  if (!profile) {
    return <ErrorMessage message={error || 'Profile not found.'} />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white text-2xl font-bold text-indigo-600">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              profile.name?.charAt(0)?.toUpperCase() || 'S'
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-indigo-100">Student ID: {profile.studentId}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Enrolled courses</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{profile.enrolledCourses || 0}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Completed courses</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{profile.completedCourses || 0}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Certificates</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{profile.certificates || 0}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ProfileForm user={profile} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={saving} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Profile details</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Name</span>
              <span className="font-medium text-slate-900">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Student ID</span>
              <span className="font-medium text-slate-900">{profile.studentId}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Email</span>
              <span className="font-medium text-slate-900">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Phone</span>
              <span className="font-medium text-slate-900">{profile.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Registration Date</span>
              <span className="font-medium text-slate-900">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default Profile;
