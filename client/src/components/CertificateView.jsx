import { forwardRef } from 'react';

const CertificateView = forwardRef(({ certificate, userName }, ref) => (
  <div ref={ref} className="certificate-print mx-auto max-w-3xl rounded-3xl border-4 border-indigo-200 bg-white p-8 shadow-xl">
    <div className="text-center">
      <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-indigo-600">Certificate of Completion</div>
      <h2 className="text-3xl font-bold text-slate-900">This certificate is proudly presented to</h2>
      <h3 className="mt-6 text-4xl font-extrabold text-indigo-700">{userName}</h3>
      <p className="mt-6 text-xl text-slate-700">for successfully completing</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{certificate.courseName}</p>
      <p className="mt-4 text-lg text-slate-700">with a final score of {certificate.score}%.</p>
    </div>

    <div className="mt-10 grid gap-4 border-t border-slate-200 pt-6 text-sm text-slate-700 md:grid-cols-2">
      <div>
        <div className="font-semibold text-slate-900">Date:</div>
        <div>{new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
      </div>
      <div>
        <div className="font-semibold text-slate-900">Certificate ID:</div>
        <div>{certificate.certificateId}</div>
      </div>
    </div>
    <div className="mt-10 text-center text-xl font-semibold text-slate-800">Student Portal</div>
  </div>
));

CertificateView.displayName = 'CertificateView';

export default CertificateView;
