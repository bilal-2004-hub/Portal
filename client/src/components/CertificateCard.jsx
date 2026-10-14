import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CertificateView from './CertificateView';
import downloadCertificatePdf from '../utils/downloadCertificatePdf';

const CertificateCard = ({ certificate }) => {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const handleDownload = async () => {
    if (!certificateRef.current || downloading) return;

    setDownloading(true);
    setDownloadError('');
    try {
      await downloadCertificatePdf(certificateRef.current, certificate.courseName);
    } catch (error) {
      setDownloadError('Unable to download certificate.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Certificate</div>
      <h3 className="text-lg font-bold text-slate-900">{certificate.courseName}</h3>
      <p className="mt-2 text-sm text-slate-600">Score: {certificate.score}%</p>
      <p className="text-sm text-slate-600">
        Issued: {new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>
      <div className="mt-4 flex gap-3">
        <Link to={`/certificates/${certificate._id}`} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          View Certificate
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
        >
          {downloading ? 'Preparing...' : 'Download'}
        </button>
      </div>
      {downloadError && <p className="mt-2 text-sm text-red-600">{downloadError}</p>}
      <div aria-hidden="true" className="pointer-events-none fixed left-[-10000px] top-0 w-[768px]">
        <CertificateView
          ref={certificateRef}
          certificate={certificate}
          userName={certificate.studentName || 'Student'}
        />
      </div>
    </div>
  );
};

export default CertificateCard;
