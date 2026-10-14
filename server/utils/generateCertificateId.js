const generateCertificateId = () => {
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `CERT-${randomPart}`;
};

module.exports = generateCertificateId;
