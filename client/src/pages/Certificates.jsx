import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CertificateCard from '../components/CertificateCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCertificates } from '../api/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await getCertificates();
        setCertificates(response.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) return <LoadingSpinner message="Loading certificates..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
      </div>

      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">You haven’t earned any certificates yet.</p>
          <p className="mt-2 text-slate-500">Complete a course and pass its quiz to earn one.</p>
          <Link to="/courses" className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate._id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
