import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCode } from 'react-qr-code';
import { toPng } from 'html-to-image';
import { Download, Eye, Edit, CheckCircle, Home } from 'lucide-react';

export default function QRDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const profileUrl = `${window.location.origin}/profile/${id}`;

  useEffect(() => {
    // fetch(`http://localhost:4000/api/profiles/${id}`)
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/profiles/${id}`)
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
    const dataUrl = await toPng(qrRef.current, { pixelRatio: 3 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${pet?.name || 'pet'}-qr.png`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1530]">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🐾</div>
        <p className="text-slate-400 text-lg animate-pulse">Setting up your pet's profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1530] p-8">
      <div className="bg-red-900/30 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">😕</div>
        <p className="text-red-400 font-bold text-xl mb-2">Couldn't load profile</p>
        <p className="text-red-400/70 text-sm font-mono bg-red-900/20 rounded-xl px-4 py-2">{error}</p>
        <button
          onClick={() => navigate('/dashboard/create')}
          className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-semibold"
        >
          Create New Profile
        </button>
      </div>
    </div>
  );

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-[#0B1530]">

      {/* Top Nav */}
      <div className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-white font-extrabold text-xl">Smart Safety QR</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <Home size={16} /> Home
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Success banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold px-5 py-2.5 rounded-full mb-5">
            <CheckCircle size={16} /> Profile created successfully!
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-2">{pet.name}</h1>
          <p className="text-slate-400 text-lg">{pet.breed || 'Mixed Breed'}</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">

          {/* Left — QR Code */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Scan to view pet profile
            </p>
            <div
              ref={qrRef}
              className="flex justify-center items-center p-6 bg-white rounded-2xl"
            >
              <QRCode value={profileUrl} size={220} />
            </div>
            <div className="mt-6 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
              <p className="text-[11px] text-slate-400 text-center break-all leading-relaxed font-mono">
                {profileUrl}
              </p>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">
              🖨️ Print and attach to your pet's collar or tag
            </p>
          </div>

          {/* Right — Pet info + actions */}
          <div className="flex flex-col gap-5">

            {/* Pet summary card */}
            <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Profile Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🐕', label: 'Breed', value: pet.breed },
                  { icon: '🎂', label: 'Birthday', value: pet.birthday },
                  { icon: '⚖️', label: 'Weight', value: pet.weight },
                  { icon: '🎨', label: 'Color', value: pet.color },
                  { icon: '💉', label: 'Chip ID', value: pet.chip_id },
                  { icon: '📍', label: 'Location', value: pet.location },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl px-4 py-3">
                    <p className="text-xs text-slate-500 font-medium">{item.icon} {item.label}</p>
                    <p className="text-sm text-white font-semibold mt-0.5 truncate">{item.value || '—'}</p>
                  </div>
                ))}
              </div>
              {pet.bio && (
                <div className="mt-3 bg-white/5 rounded-2xl px-4 py-3">
                  <p className="text-xs text-slate-500 font-medium mb-1">📝 Bio</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{pet.bio}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] shadow-lg shadow-cyan-500/20 transition-all active:scale-95 hover:opacity-90"
              >
                {downloaded ? (
                  <><CheckCircle size={20} /> Downloaded!</>
                ) : (
                  <><Download size={20} /> Download QR as PNG</>
                )}
              </button>

              <button
                onClick={() => window.open(`/profile/${id}`, '_blank')}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base border-2 border-white/20 text-white transition-all active:scale-95 hover:bg-white/10"
              >
                <Eye size={20} /> View Public Profile
              </button>

              <button
                onClick={() => navigate('/dashboard/create')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-slate-400 text-sm font-medium border border-white/10 hover:bg-white/5 transition-all"
              >
                <Edit size={16} /> Create Another Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}