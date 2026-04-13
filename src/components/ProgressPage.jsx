import React, { useState, useEffect } from 'react';
import { TrendingUp, Trophy, Dumbbell, Search, BarChart2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';
import { EXERCISES, MUSCLE_GROUP_COLORS, MUSCLE_GROUP_LABELS } from '../lib/exerciseData';

const CHART_TABS = ['Weight', 'Volume', '1RM'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold">{payload[0]?.value?.toFixed(1)} {payload[0]?.name === 'Volume' ? 'kg vol' : 'kg'}</p>
    </div>
  );
};

export default function ProgressPage() {
  const [selectedEx,    setSelectedEx]    = useState(null);
  const [chartTab,      setChartTab]      = useState('Weight');
  const [chartData,     setChartData]     = useState([]);
  const [prs,           setPrs]           = useState([]);
  const [weeklyStats,   setWeeklyStats]   = useState([]);
  const [overview,      setOverview]      = useState(null);
  const [search,        setSearch]        = useState('');
  const [showSearch,    setShowSearch]    = useState(false);
  const [loadingChart,  setLoadingChart]  = useState(false);

  useEffect(() => {
    axios.get('/personal-records/').then(r => setPrs(r.data)).catch(() => {});
    axios.get('/stats/weekly/').then(r => setWeeklyStats(r.data)).catch(() => {});
    axios.get('/stats/overview/').then(r => setOverview(r.data)).catch(() => {});
  }, []);

  const loadChart = async (exercise) => {
    setSelectedEx(exercise);
    setShowSearch(false);
    setSearch('');
    setLoadingChart(true);
    try {
      const { data } = await axios.get('/exercise-logs/chart/', { params: { exercise_id: exercise.id } });
      setChartData(data.map(d => ({
        date:   new Date(d.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Weight: d.weight_kg,
        Volume: d.volume,
        '1RM':  d.weight_kg > 0 && d.reps > 0 ? parseFloat((d.weight_kg * (1 + d.reps / 30)).toFixed(1)) : d.weight_kg,
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingChart(false);
    }
  };

  const filteredExercises = EXERCISES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20);

  const exPr = prs.find(pr => pr.exercise_library_id === selectedEx?.id);

  return (
    <div className="min-h-screen bg-[#0d0d17]">
      <Navbar />
      <main className="lg:ml-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">

          <h1 className="text-2xl font-bold text-white mb-1">Progress</h1>
          <p className="text-gray-500 text-sm mb-6">Track your gains over time</p>

          {/* Lifetime stats */}
          {overview && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Sessions',   value: overview.total_sessions,                icon: Dumbbell,  color: 'text-purple-400' },
                { label: 'Total Vol',  value: `${(overview.total_volume_kg/1000).toFixed(1)}t`, icon: TrendingUp, color: 'text-blue-400' },
                { label: 'PRs',        value: overview.total_prs,                     icon: Trophy,    color: 'text-yellow-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-[#13131f] border border-white/5 rounded-2xl p-4 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Weekly volume chart */}
          {weeklyStats.length > 0 && (
            <div className="bg-[#13131f] border border-white/5 rounded-2xl p-4 mb-6">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                Weekly Volume
              </h2>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={weeklyStats} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="week_label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="bg-[#1a1a2e] border border-purple-500/30 rounded-xl px-3 py-2 shadow-lg">
                          <p className="text-gray-400 text-xs">{label}</p>
                          <p className="text-white font-bold">{payload[0]?.value?.toLocaleString()} kg</p>
                          <p className="text-gray-500 text-xs">{payload[1]?.value} sessions</p>
                        </div>
                      ) : null}
                  />
                  <Bar dataKey="volume_kg"     fill="#7c3aed" radius={[4,4,0,0]} name="volume_kg" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Exercise chart selector */}
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-4 mb-6 relative">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Exercise Progress</h2>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 font-medium"
              >
                <Search className="w-4 h-4" />
                {selectedEx ? 'Change' : 'Select Exercise'}
              </button>
            </div>

            {/* Search dropdown */}
            {showSearch && (
              <div className="mb-3">
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
                    placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 mb-2" />
                <div className="bg-[#0d0d17] rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                  {filteredExercises.map(ex => (
                    <button key={ex.id} onClick={() => loadChart(ex)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
                        ${MUSCLE_GROUP_COLORS[ex.muscle_group] || 'bg-gray-500/20 text-gray-400'}`}>
                        {MUSCLE_GROUP_LABELS[ex.muscle_group]}
                      </span>
                      <span className="text-white text-sm">{ex.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedEx ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-medium">{selectedEx.name}</p>
                  {exPr && (
                    <div className="flex gap-3 text-xs">
                      <span className="text-yellow-400">PR: <span className="font-bold">{exPr.max_weight_kg}kg</span></span>
                      <span className="text-blue-400">1RM: <span className="font-bold">~{exPr.best_1rm_estimate?.toFixed(1)}kg</span></span>
                    </div>
                  )}
                </div>
                {/* Chart tabs */}
                <div className="flex gap-1 mb-3">
                  {CHART_TABS.map(tab => (
                    <button key={tab} onClick={() => setChartTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${chartTab === tab ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
                {loadingChart ? (
                  <div className="h-32 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey={chartTab} stroke="#7c3aed" strokeWidth={2}
                        dot={{ fill: '#7c3aed', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#a78bfa' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-32 flex items-center justify-center">
                    <p className="text-gray-600 text-sm">No data yet for this exercise</p>
                  </div>
                )}
              </>
            ) : (
              <div className="h-32 flex items-center justify-center">
                <p className="text-gray-600 text-sm">Select an exercise to see your progress chart</p>
              </div>
            )}
          </div>

          {/* Personal records list */}
          {prs.length > 0 && (
            <div className="bg-[#13131f] border border-white/5 rounded-2xl p-4">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Personal Records
              </h2>
              <div className="space-y-2">
                {prs.map(pr => (
                  <div key={pr.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <span className="text-white text-sm">{pr.exercise_name}</span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-yellow-400">{pr.max_weight_kg}kg</span>
                      <span className="text-blue-400">×{pr.max_reps} reps</span>
                      <span className="text-gray-500">1RM ~{pr.best_1rm_estimate?.toFixed(1)}kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
