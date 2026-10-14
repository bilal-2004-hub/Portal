import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import CertificateView from '../components/CertificateView';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCertificate } from '../api/api';
import { useAuth } from '../context/AuthContext';
import downloadCertificatePdf from '../utils/downloadCertificatePdf';

const CertificateDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await getCertificate(id);
        setCertificate(response.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    await downloadCertificatePdf(certificateRef.current, certificate?.courseName);
  };

  if (loading) return <LoadingSpinner message="Loading certificate..." />;
  if (!certificate) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Certificate not found.</div>;

  return (
    <div className="space-y-6">
      <div className="no-print flex justify-end">
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Download PDF
        </button>
      </div>

      <CertificateView ref={certificateRef} certificate={certificate} userName={user?.name || 'Student'} />
    </div>
  );
};

export default CertificateDetails;
