// src/pages/QRDashboard.jsx
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import { Download, Eye, Edit } from 'lucide-react';

export default function QRDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileUrl = `${window.location.origin}/profile/${id}`;

  useEffect(() => {
    fetch(`http://localhost:4000/api/profiles/${id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setPet(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadQR = async () => {
    if (!qrRef.current) return;
    const dataUrl = await toPng(qrRef.current);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${pet?.name || 'pet'}-qr.png`;
    a.click();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-400 text-lg animate-pulse">Loading... 🐾</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md w-full text-center">
        <p className="text-red-500 font-bold text-lg mb-2">Error loading profile</p>
        <p className="text-red-400 text-sm font-mono">{error}</p>
        <p className="text-slate-400 text-xs mt-4">ID: {id}</p>
      </div>
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-orange-400 text-lg">No pet data returned.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-2xl font-extrabold text-[#0B1530] mb-1">{pet.name}</h2>
        <p className="text-slate-400 text-sm mb-6">{pet.breed}</p>

        <div
          ref={qrRef}
          className="flex justify-center p-4 bg-white rounded-2xl border border-slate-100 mb-4"
        >
          <QRCode value={profileUrl} size={180} />
        </div>

        <p className="text-xs text-slate-400 mb-6 break-all">{profileUrl}</p>

        <div className="space-y-3">
          <button
            onClick={downloadQR}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B1530] text-white font-semibold"
          >
            <Download size={18} /> Download QR as PNG
          </button>
          <button
            onClick={() => window.open(`/profile/${id}`, '_blank')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-[#2DD4BF] text-[#0B1530] font-semibold"
          >
            <Eye size={18} /> View Public Profile
          </button>
          <button
            onClick={() => navigate('/dashboard/create')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 text-slate-500 font-medium text-sm"
          >
            <Edit size={16} /> Create Another Profile
          </button>
        </div>
      </div>
    </div>
  );
}