import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Flame, Trophy, Dumbbell, TrendingUp, ArrowRight, Clock, LayoutTemplate, Plus, Zap } from 'lucide-react';
import axios from '../lib/axiosConfig';
import { useAuth } from '../components/auth/AuthContext';
import Navbar from './Navbar';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

function fmtDuration(s) {
  if (!s) return null;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m/60)}h ${m%60}m`;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();

  const [templates,    setTemplates]    = useState([]);
  const [sessions,     setSessions]     = useState([]);
  const [overview,     setOverview]     = useState(null);
  const [activeSession,setActiveSession]= useState(null);
  const [loading,      setLoading]      = useState(true);
  const [starting,     setStarting]     = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get('/templates/').catch(() => ({ data: [] })),
      axios.get('/workout-sessions/').catch(() => ({ data: [] })),
      axios.get('/stats/overview/').catch(() => ({ data: null })),
      axios.get('/active-workout/current/').catch(() => ({ data: null })),
    ]).then(([tRes, sRes, oRes, aRes]) => {
      setTemplates((tRes.data || []).slice(0, 4));
      setSessions((sRes.data || []).slice(0, 3));
      setOverview(oRes.data);
      setActiveSession(aRes.data);
      setLoading(false);
    });
  }, []);

  const thisWeekCount = (() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions.filter(s => s.session_date >= weekAgo.toISOString().slice(0,10)).length;
  })();

  const streak = (() => {
    const dates = [...new Set(sessions.map(s => s.session_date))].sort().reverse();
    let count = 0, current = new Date();
    for (const d of dates) {
      const diff = Math.round((current - new Date(d)) / 86400000);
      if (diff <= 1) { count++; current = new Date(d); } else break;
    }
    return count;
  })();

  const handleStartTemplate = async (t) => {
    setStarting(t.id);
    try {
      await axios.post('/active-workout/', { template_id: t.id, workout_name: t.name });
      navigate('/workout/active');
    } catch (e) {
      if (e?.response?.status === 400) navigate('/workout/active');
      else console.error(e);
    }
    finally { setStarting(null); }
  };

  const handleQuickStart = async () => {
    setStarting('quick');
    try {
      await axios.post('/active-workout/', { workout_name: 'Quick Workout' });
      navigate('/workout/active');
    } catch (e) {
      if (e?.response?.status === 400) navigate('/workout/active');
      else console.error(e);
    }
    finally { setStarting(null); }
  };

  return (
    <div className="min-h-screen bg-[#0d0d17] text-white">
      <Navbar />

      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative lg:ml-60 pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Greeting */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-bold text-white mt-1">
              {greeting()}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
          </div>

          {/* Active workout banner */}
          {activeSession && (
            <button
              onClick={() => navigate('/workout/active')}
              className="w-full mb-5 flex items-center gap-4 p-4 rounded-2xl bg-green-950/50 border border-green-500/30
                hover:bg-green-950/70 transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-green-500/20 flex-shrink-0">
                <Dumbbell className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-green-300 font-semibold">Workout in progress</p>
                <p className="text-green-600 text-xs">{activeSession.workout_name} — tap to resume</p>
              </div>
              <ArrowRight className="w-5 h-5 text-green-400 flex-shrink-0" />
            </button>
          )}

          {/* Start / Resume workout CTA */}
          <div className="mb-6">
            {activeSession ? (
              <button
                onClick={() => navigate('/workout/active')}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600
                  text-white font-bold text-lg shadow-xl shadow-green-900/40
                  hover:from-green-500 hover:to-emerald-500 transition-all
                  flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6 fill-current" />
                Resume Workout
              </button>
            ) : (
              <button
                onClick={handleQuickStart}
                disabled={starting === 'quick'}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600
                  text-white font-bold text-lg shadow-xl shadow-purple-900/40
                  hover:from-purple-500 hover:to-violet-500 transition-all
                  flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {starting === 'quick'
                  ? <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  : <Play className="w-6 h-6 fill-current" />}
                Start Workout
              </button>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'This Week', value: thisWeekCount, unit: 'workouts', icon: Flame,     color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
              { label: 'Streak',    value: streak,        unit: 'days',     icon: TrendingUp,color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'PRs',       value: overview?.total_prs || 0, unit: 'total', icon: Trophy,    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
            ].map(({ label, value, unit, icon: Icon, color, bg }) => (
              <div key={label} className={`rounded-2xl border p-4 ${bg}`}>
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <p className="text-2xl font-bold text-white leading-none">
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Recent templates */}
          {templates.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-purple-400" />
                  Templates
                </h2>
                <button onClick={() => navigate('/templates')}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors">
                  All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map(t => (
                  <div key={t.id}
                    className="bg-[#13131f] border border-white/5 rounded-2xl p-4
                      hover:border-purple-500/30 transition-all group flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-600/15 border border-purple-500/20 flex-shrink-0">
                      <Dumbbell className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{t.name}</p>
                      <p className="text-gray-600 text-xs capitalize">{t.difficulty || 'intermediate'}</p>
                    </div>
                    <button
                      onClick={() => handleStartTemplate(t)}
                      disabled={!!starting}
                      className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors
                        flex-shrink-0 disabled:opacity-60"
                    >
                      {starting === t.id
                        ? <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        : <Play className="w-4 h-4 fill-current" />}
                    </button>
                  </div>
                ))}

                {/* Create template shortcut */}
                <button onClick={() => navigate('/templates/new')}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-4 flex items-center gap-3
                    hover:border-purple-500/30 hover:bg-white/5 transition-all text-left">
                  <div className="p-2.5 rounded-xl bg-white/5 flex-shrink-0">
                    <Plus className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-sm">New Template</p>
                </button>
              </div>
            </div>
          )}

          {/* Recent sessions */}
          {sessions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Recent Workouts
                </h2>
                <button onClick={() => navigate('/history')}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors">
                  History <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {sessions.map(s => (
                  <div key={s.id}
                    className="bg-[#13131f] border border-white/5 rounded-xl px-4 py-3
                      flex items-center gap-4">
                    <div>
                      <p className="text-white font-medium text-sm">{s.workout_name}</p>
                      <p className="text-gray-500 text-xs">{s.session_date}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
                      {s.duration_seconds > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {fmtDuration(s.duration_seconds)}
                        </span>
                      )}
                      {s.total_volume_kg > 0 && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {s.total_volume_kg.toLocaleString()}kg
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state — no templates and no sessions */}
          {!loading && templates.length === 0 && sessions.length === 0 && (
            <div className="text-center py-12 bg-[#13131f] border border-white/5 rounded-2xl">
              <Dumbbell className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Ready to train?</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                Create a template for your workout routine, or start a quick session right now.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate('/templates/new')}
                  className="px-5 py-2.5 rounded-xl border border-purple-500/30 text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors">
                  Create Template
                </button>
                <button onClick={handleQuickStart}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors">
                  Quick Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
