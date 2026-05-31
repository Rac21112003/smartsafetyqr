import { useNavigate } from 'react-router-dom';
import { QrCode, Scan, Phone } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0B1530] flex flex-col items-center justify-center px-6 text-white">
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] bg-clip-text text-transparent">
          DoggiePass
        </h1>
        <p className="text-lg text-slate-300 mb-8">Your pet's identity, always on them.</p>
        <button
          onClick={() => navigate('/dashboard/create')}
          className="px-8 py-4 rounded-2xl font-semibold text-white text-lg bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] shadow-xl hover:scale-105 transition-transform"
        >
          Create Your Pet's Profile
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8 max-w-md w-full">
        {[
          { icon: <QrCode size={28} />, label: 'QR Identity' },
          { icon: <Scan size={28} />, label: 'Instant Scan' },
          { icon: <Phone size={28} />, label: 'Owner Contact' },
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center bg-white/10 rounded-2xl p-4 gap-2">
            <div className="text-[#2DD4BF]">{f.icon}</div>
            <span className="text-sm text-slate-200 text-center">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}