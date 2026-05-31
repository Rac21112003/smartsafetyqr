import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { createProfile } from '../api';
import { Plus, Trash2 } from 'lucide-react';

export default function CreateProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', breed: '', birthday: '', weight: '', color: '',
    chip_id: '', location: '', imageUrl: '', phone: '', whatsapp: '', bio: ''
  });
  const [vaccinations, setVaccinations] = useState([{ name: '', expiry: '' }]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addVax = () => setVaccinations(v => [...v, { name: '', expiry: '' }]);
  const removeVax = (i) => setVaccinations(v => v.filter((_, idx) => idx !== i));
  const setVax = (i, k, v) => setVaccinations(prev =>
    prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item)
  );

 const handleSubmit = async () => {
  if (!form.name) return alert('Pet name is required');
  setLoading(true);
  try {
    // const res = await fetch('http://localhost:4000/api/profiles', {

    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, vaccinations })
    });
    const data = await res.json();
    navigate(`/dashboard/profile/${data.id}`);
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Error saving profile');
  } finally {
    setLoading(false);
  }
};

  const fields = [
    { key: 'name', label: 'Pet Name *', type: 'text' },
    { key: 'breed', label: 'Breed', type: 'text' },
    { key: 'birthday', label: 'Birthday', type: 'date' },
    { key: 'weight', label: 'Weight (e.g. 12 kg)', type: 'text' },
    { key: 'color', label: 'Color / Coat', type: 'text' },
    { key: 'chip_id', label: 'Microchip ID', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'imageUrl', label: 'Pet Image URL', type: 'url' },
    { key: 'phone', label: 'Owner Phone', type: 'tel' },
    { key: 'whatsapp', label: 'Owner WhatsApp', type: 'tel' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-[#0B1530] mb-1">Create Pet Profile</h1>
        <p className="text-slate-500 mb-8">Fill in your pet's details to generate a QR code.</p>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-600 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            />
          </div>

          {/* Vaccinations */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-600">Vaccinations</label>
              <button onClick={addVax} className="flex items-center gap-1 text-xs text-[#0EA5E9] font-medium">
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {vaccinations.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    placeholder="Vaccine name"
                    value={v.name}
                    onChange={e => setVax(i, 'name', e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                  />
                  <input
                    type="date"
                    value={v.expiry}
                    onChange={e => setVax(i, 'expiry', e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                  />
                  {vaccinations.length > 1 && (
                    <button onClick={() => removeVax(i)} className="text-red-400">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] mt-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : '✨ Generate QR & Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}