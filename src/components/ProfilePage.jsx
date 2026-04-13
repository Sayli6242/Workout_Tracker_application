import React, { useState, useEffect } from 'react';
import { User, Dumbbell, Trophy, TrendingUp, Plus, Trash2, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';
import { useAuth } from './auth/AuthContext';

const MEASUREMENT_FIELDS = [
  { key: 'weight_kg',    label: 'Weight',    unit: 'kg'  },
  { key: 'body_fat_pct', label: 'Body Fat',  unit: '%'   },
  { key: 'chest_cm',     label: 'Chest',     unit: 'cm'  },
  { key: 'waist_cm',     label: 'Waist',     unit: 'cm'  },
  { key: 'hips_cm',      label: 'Hips',      unit: 'cm'  },
  { key: 'arms_cm',      label: 'Arms',      unit: 'cm'  },
  { key: 'legs_cm',      label: 'Legs',      unit: 'cm'  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [overview,      setOverview]      = useState(null);
  const [measurements,  setMeasurements]  = useState([]);
  const [showForm,      setShowForm]      = useState(false);
  const [form,          setForm]          = useState({ weight_kg:'', body_fat_pct:'', chest_cm:'', waist_cm:'', hips_cm:'', arms_cm:'', legs_cm:'' });
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    axios.get('/stats/overview/').then(r => setOverview(r.data)).catch(() => {});
    axios.get('/measurements/').then(r => setMeasurements(r.data || [])).catch(() => {});
  }, []);

  const handleSaveMeasurement = async () => {
    const filled = Object.entries(form).filter(([, v]) => v !== '');
    if (!filled.length) return;
    setSaving(true);
    try {
      await axios.post('/measurements/', Object.fromEntries(
        filled.map(([k, v]) => [k, parseFloat(v)])
      ));
      const { data } = await axios.get('/measurements/');
      setMeasurements(data || []);
      setShowForm(false);
      setForm({ weight_kg:'', body_fat_pct:'', chest_cm:'', waist_cm:'', hips_cm:'', arms_cm:'', legs_cm:'' });
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDeleteMeasurement = async (id) => {
    try {
      await axios.delete(`/measurements/${id}/`);
      setMeasurements(prev => prev.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
  };

  const sorted = [...measurements].sort((a, b) =>
    new Date(a.logged_at || a.created) - new Date(b.logged_at || b.created)
  );

  const weightData = sorted
    .filter(m => m.weight_kg)
    .map(m => ({
      date:   new Date(m.logged_at || m.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(m.weight_kg),
    }));

  const latest = sorted[sorted.length - 1];

  return (
    <div className="min-h-screen bg-[#0d0d17]">
      <Navbar />
      <main className="lg:ml-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* User card */}
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-5 mb-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{user?.name || user?.email?.split('@')[0] || 'Athlete'}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          {overview && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Workouts',   value: overview.total_sessions,                      icon: Dumbbell,  color: 'text-purple-400' },
                { label: 'Volume',     value: `${(overview.total_volume_kg/1000).toFixed(1)}t`, icon: TrendingUp, color: 'text-blue-400'   },
                { label: 'PRs Set',    value: overview.total_prs,                           icon: Trophy,    color: 'text-yellow-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-[#13131f] border border-white/5 rounded-2xl p-4 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Weight chart */}
          {weightData.length > 1 && (
            <div className="bg-[#13131f] border border-white/5 rounded-2xl p-4 mb-5">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                Weight Trend
              </h2>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto','auto']} hide />
                  <Tooltip content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="bg-[#1a1a2e] border border-blue-500/30 rounded-xl px-3 py-2 shadow-lg">
                        <p className="text-gray-400 text-xs">{label}</p>
                        <p className="text-white font-bold">{payload[0]?.value} kg</p>
                      </div>
                    ) : null} />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Measurements */}
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Body Measurements</h2>
              <button onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Latest readings */}
            {latest && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {MEASUREMENT_FIELDS.filter(f => latest[f.key]).map(f => (
                  <div key={f.key} className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-white font-bold">{latest[f.key]}</p>
                    <p className="text-gray-500 text-[10px]">{f.label} ({f.unit})</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add form */}
            {showForm && (
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <p className="text-white font-medium text-sm mb-3">New Measurement</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {MEASUREMENT_FIELDS.map(f => (
                    <div key={f.key}>
                      <label className="text-[10px] text-gray-500 block mb-1">{f.label} ({f.unit})</label>
                      <input type="number" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder="—"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs text-center
                          focus:outline-none focus:ring-1 focus:ring-purple-500" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSaveMeasurement} disabled={saving}
                    className="flex-1 py-2 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-500 transition-colors disabled:opacity-60">
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-xl bg-white/5 text-gray-400 font-medium text-sm hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* History list */}
            {sorted.length === 0 ? (
              <p className="text-center text-gray-600 text-sm py-6">No measurements yet</p>
            ) : (
              <div className="space-y-2">
                {[...sorted].reverse().slice(0, 10).map(m => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-xs">
                      {new Date(m.logged_at || m.created).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      {m.weight_kg    && <span className="text-white">{m.weight_kg}kg</span>}
                      {m.body_fat_pct && <span className="text-gray-400">{m.body_fat_pct}% BF</span>}
                      {m.waist_cm     && <span className="text-gray-400">{m.waist_cm}cm waist</span>}
                    </div>
                    <button onClick={() => handleDeleteMeasurement(m.id)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-2">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
