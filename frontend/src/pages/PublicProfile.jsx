import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Syringe, Heart, Shield, Info } from 'lucide-react';

function VaxStatus({ expiry }) {
  if (!expiry) return null;
  const today = new Date();
  const exp = new Date(expiry);
  const diff = (exp - today) / (1000 * 60 * 60 * 24);
  if (diff < 0) return <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold">Expired</span>;
  if (diff < 30) return <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-600 font-semibold">Expiring Soon</span>;
  return <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 font-semibold">Valid ✓</span>;
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#0B1530] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🐾</div>
        <p className="text-slate-400 animate-pulse text-lg">Loading profile...</p>
      </div>
    </div>
  );
}

const formatDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return d; }
};

export default function PublicProfile() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    // fetch(`http://localhost:4000/api/profiles/${id}`)
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/profiles/${id}`)

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
      <h2 className="text-3xl font-bold mb-3">Profile Not Found</h2>
      <p className="text-slate-400 max-w-sm">This pet profile doesn't exist or may have been removed.</p>
    </div>
  );

  const tabs = [
    { label: 'Vaccinations', icon: <Syringe size={15} /> },
    { label: 'Medical', icon: <Shield size={15} /> },
    { label: 'About', icon: <Info size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero header — full width */}
      <div className="bg-[#0B1530] px-6 pt-12 pb-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl">
              {pet.imageurl ? (
                <img src={pet.imageurl} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1e3a5f] to-[#0B1530] flex items-center justify-center text-7xl">
                  🐶
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-emerald-400 rounded-xl border-2 border-[#0B1530] flex items-center justify-center shadow-lg">
              <Heart size={15} className="text-white fill-white" />
            </div>
          </div>

          {/* Pet name + info */}
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              Active Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{pet.name}</h1>
            <p className="text-[#2DD4BF] font-semibold text-lg mb-2">{pet.breed || 'Mixed Breed'}</p>
            {pet.location && (
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-400 text-sm">
                <MapPin size={14} /> {pet.location}
              </div>
            )}
          </div>

          {/* Contact buttons — show in header on desktop */}
          <div className="flex-shrink-0 flex gap-3 hidden md:flex">
            {pet.phone && (
              <a
                href={`tel:${pet.phone}`}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-bold text-sm shadow-lg"
              >
                <Phone size={17} /> Call Owner
              </a>
            )}
            {pet.whatsapp && (
              <a
                href={`https://wa.me/${pet.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm shadow-lg"
              >
                <MessageCircle size={17} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap gap-6 justify-center md:justify-start">
          {[
            { icon: '🎂', label: 'Birthday', value: formatDate(pet.birthday) },
            { icon: '⚖️', label: 'Weight', value: pet.weight },
            { icon: '🎨', label: 'Color', value: pet.color },
            { icon: '💉', label: 'Chip ID', value: pet.chip_id },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-xs text-slate-400 font-medium leading-none">{b.label}</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{b.value || '—'}</p>
              </div>
              {i < 3 && <div className="w-px h-8 bg-slate-100 ml-4 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column — bio + contact (mobile contact too) */}
          <div className="space-y-5">

            {pet.bio && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">About {pet.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{pet.bio}</p>
              </div>
            )}

            {/* Contact card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Owner</h3>
              <div className="space-y-3">
                {pet.phone ? (
                  <a
                    href={`tel:${pet.phone}`}
                    className="flex items-center gap-3 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-bold text-sm"
                  >
                    <Phone size={17} /> Call Owner
                    <span className="ml-auto text-white/70 text-xs font-normal">{pet.phone}</span>
                  </a>
                ) : null}
                {pet.whatsapp ? (
                  <a
                    href={`https://wa.me/${pet.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm"
                  >
                    <MessageCircle size={17} /> WhatsApp
                    <span className="ml-auto text-white/70 text-xs font-normal">{pet.whatsapp}</span>
                  </a>
                ) : null}
                {!pet.phone && !pet.whatsapp && (
                  <p className="text-slate-400 text-sm text-center py-2">No contact info provided</p>
                )}
              </div>
            </div>

            {/* Quick details card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Breed', value: pet.breed, icon: '🐕' },
                  { label: 'Birthday', value: formatDate(pet.birthday), icon: '🎂' },
                  { label: 'Location', value: pet.location, icon: '📍' },
                  { label: 'Weight', value: pet.weight, icon: '⚖️' },
                  { label: 'Color', value: pet.color, icon: '🎨' },
                  { label: 'Chip ID', value: pet.chip_id, icon: '💉' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-400 flex items-center gap-2">
                      <span>{item.icon}</span> {item.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{item.value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Tab header */}
              <div className="flex border-b border-slate-100">
                {tabs.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTab(i)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${
                      tab === i
                        ? 'border-[#2DD4BF] text-[#0B1530] bg-cyan-50/50'
                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Tab body */}
              <div className="p-6">

                {/* Vaccinations */}
                {tab === 0 && (
                  <div>
                    {!pet.vaccinations || pet.vaccinations.length === 0 ? (
                      <div className="text-center py-16">
                        <Syringe size={40} className="mx-auto mb-3 text-slate-200" />
                        <p className="text-slate-500 font-semibold">No vaccinations added yet</p>
                        <p className="text-slate-400 text-sm mt-1">The owner hasn't added any vaccine records</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pet.vaccinations.map((v, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">💉</div>
                              <div>
                                <p className="text-sm font-bold text-[#0B1530]">{v.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {v.expiry ? `Expires ${formatDate(v.expiry)}` : 'No expiry date'}
                                </p>
                              </div>
                            </div>
                            <VaxStatus expiry={v.expiry} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Medical */}
                {tab === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Weight', value: pet.weight, icon: '⚖️', desc: 'Body weight' },
                      { label: 'Color / Coat', value: pet.color, icon: '🎨', desc: 'Coat description' },
                      { label: 'Microchip ID', value: pet.chip_id, icon: '💉', desc: 'RFID chip number' },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                        <p className="text-base font-extrabold text-[#0B1530] mt-1">{item.value || '—'}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* About */}
                {tab === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Breed', value: pet.breed, icon: '🐕' },
                      { label: 'Birthday', value: formatDate(pet.birthday), icon: '🎂' },
                      { label: 'Location', value: pet.location, icon: '📍' },
                      { label: 'Weight', value: pet.weight, icon: '⚖️' },
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex gap-3 items-center">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                          <p className="text-sm font-bold text-[#0B1530] mt-0.5">{item.value || '—'}</p>
                        </div>
                      </div>
                    ))}
                    {pet.bio && (
                      <div className="sm:col-span-2 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-100 rounded-2xl px-5 py-4">
                        <p className="text-xs text-slate-400 font-medium mb-2">📝 Bio</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{pet.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only fixed bottom bar */}
      {(pet.phone || pet.whatsapp) && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-5 py-4 flex gap-3 z-50">
          {pet.phone && (
            <a
              href={`tel:${pet.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-bold text-sm"
            >
              <Phone size={18} /> Call Owner
            </a>
          )}
          {pet.whatsapp && (
            <a
              href={`https://wa.me/${pet.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}