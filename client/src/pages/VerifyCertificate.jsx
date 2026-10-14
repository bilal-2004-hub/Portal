import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import { verifyCertificate } from '../api/api';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const [verification] = await Promise.allSettled([
        verifyCertificate(certificateId),
        new Promise((resolve) => window.setTimeout(resolve, 1000)),
      ]);

      if (verification.status === 'rejected') throw verification.reason;
      setResult(verification.value.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Verify certificate</h1>
        <p className="mt-2 text-sm text-slate-600">Enter a certificate ID to verify its authenticity.</p>

        <form onSubmit={handleVerify} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Certificate ID
            <input
              type="text"
              required
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value.trim())}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500"
              placeholder="CERT-XXXXXX"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Verifying...
              </span>
            ) : 'Verify'}
          </button>
        </form>

        {error && <div className="mt-5"><ErrorMessage message={error} /></div>}

        {result && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <div className="text-lg font-bold">Certificate Verified ✓</div>
            <div className="mt-3 space-y-1 text-sm">
              <p><span className="font-semibold">Student:</span> {result.studentName}</p>
              <p><span className="font-semibold">Course:</span> {result.courseName}</p>
              <p><span className="font-semibold">Score:</span> {result.score}%</p>
              <p><span className="font-semibold">Issued:</span> {new Date(result.issuedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
