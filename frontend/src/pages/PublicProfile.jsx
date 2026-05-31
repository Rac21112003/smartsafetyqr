import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { getProfile } from '../api';
import { Phone, MessageCircle, MapPin, Syringe} from 'lucide-react';

function VaxStatus({ expiry }) {
  if (!expiry) return null;
  const today = new Date();
  const exp = new Date(expiry);
  const diff = (exp - today) / (1000 * 60 * 60 * 24);
  if (diff < 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">Expired</span>;
  if (diff < 30) return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 font-medium">Expiring Soon</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-medium">Valid</span>;
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#0B1530] flex items-center justify-center">
      <div className="animate-pulse text-white text-lg">Loading profile... 🐾</div>
    </div>
  );
}

export default function PublicProfile() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState(0);

 useEffect(() => {
  fetch(`http://localhost:4000/api/profiles/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(data => setPet(data))
    .catch(() => setNotFound(true))
    .finally(() => setLoading(false));
}, [id]);

  if (loading) return <Skeleton />;
  if (notFound) return (
    <div className="min-h-screen bg-[#0B1530] flex flex-col items-center justify-center text-white text-center p-8">
      <div className="text-6xl mb-4">🐾</div>
      <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
      <p className="text-slate-400">This pet profile doesn't exist.</p>
    </div>
  );

  const badges = [
    { icon: '🎂', label: pet.birthday || '—' },
    { icon: '⚖️', label: pet.weight || '—' },
    { icon: '🎨', label: pet.color || '—' },
    { icon: '💉', label: pet.chip_id || '—' },
  ];

  const tabs = ['Vaccinations', 'Medical', 'About'];

  return (
    <div className="min-h-screen bg-[#0B1530] flex justify-center">
      <div className="w-full max-w-[430px] relative">

        {/* Header */}
        <div className="bg-[#0B1530] pt-12 pb-20 px-4 text-center relative">
          <div className="w-28 h-28 rounded-full border-4 border-white mx-auto overflow-hidden shadow-xl">
            {pet.imageurl ? (
              <img src={pet.imageurl} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#1e2d50] flex items-center justify-center text-5xl">🐶</div>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-4">{pet.name}</h1>
          <p className="text-[#2DD4BF] font-medium mt-1">{pet.breed || 'Mixed Breed'}</p>
          {pet.location && (
            <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mt-1">
              <MapPin size={13} /> {pet.location}
            </div>
          )}
        </div>

        {/* White curved card */}
        <div className="bg-white rounded-t-[2.5rem] -mt-8 min-h-screen px-5 pt-6 pb-32 relative z-10">

          {/* Badges */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
            {badges.map((b, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-1.5 bg-[#EFF6FF] text-[#0369A1] rounded-full px-3 py-1.5 text-xs font-medium">
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          {/* Bio */}
          {pet.bio && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex gap-3">
              <span className="text-xl">🐾</span>
              <p className="text-slate-600 text-sm leading-relaxed">{pet.bio}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 mb-4">
            {tabs.map((t, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tab === i ? 'bg-white shadow text-[#0B1530]' : 'text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === 0 && (
            <div>
              {!pet.vaccinations || pet.vaccinations.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Syringe size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No vaccinations added yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pet.vaccinations.map((v, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0B1530]">{v.name}</p>
                        <p className="text-xs text-slate-400">{v.expiry ? `Expires: ${v.expiry}` : 'No expiry'}</p>
                      </div>
                      <VaxStatus expiry={v.expiry} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 1 && (
            <div className="space-y-3">
              {[
                { label: 'Weight', value: pet.weight, icon: '⚖️' },
                { label: 'Color / Coat', value: pet.color, icon: '🎨' },
                { label: 'Microchip ID', value: pet.chip_id, icon: '💉' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-semibold text-[#0B1530]">{item.value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 2 && (
            <div className="space-y-3">
              {[
                { label: 'Breed', value: pet.breed },
                { label: 'Birthday', value: pet.birthday },
                { label: 'Location', value: pet.location },
                { label: 'About', value: pet.bio },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl px-4 py-3">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-[#0B1530] mt-0.5">{item.value || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Action Buttons */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 px-5 py-4 flex gap-3 z-50">
          {pet.phone && (
            <a
              href={`tel:${pet.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-bold text-sm shadow-lg"
            >
              <Phone size={18} /> Call Owner
            </a>
          )}
          {pet.whatsapp && (
            <a
              href={`https://wa.me/${pet.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm shadow-lg"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}