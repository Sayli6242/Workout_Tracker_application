import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Dumbbell, Clock, ChevronRight, Trash2, Play, LayoutTemplate } from 'lucide-react';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';

const DIFFICULTY_COLORS = {
  beginner:     'bg-green-500/20 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  advanced:     'bg-red-500/20 text-red-400 border-red-500/20',
};

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [starting,  setStarting]  = useState(null);

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await axios.get('/templates/');
      // Enrich with exercise count
      const enriched = await Promise.all(data.map(async t => {
        try {
          const { data: detail } = await axios.get(`/templates/${t.id}/`);
          return { ...t, exercise_count: detail.exercises?.length || 0 };
        } catch { return { ...t, exercise_count: 0 }; }
      }));
      setTemplates(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (template) => {
    setStarting(template.id);
    try {
      await axios.post('/active-workout/', {
        template_id:  template.id,
        workout_name: template.name,
      });
      navigate('/workout/active');
    } catch (e) {
      console.error(e);
    } finally {
      setStarting(null);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this template?')) return;
    try {
      await axios.delete(`/templates/${id}/`);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#0d0d17]">
      <Navbar />
      <main className="lg:ml-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">My Templates</h1>
              <p className="text-gray-500 text-sm mt-0.5">Build once, start instantly</p>
            </div>
            <button
              onClick={() => navigate('/templates/new')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600
                text-white font-medium text-sm shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-violet-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <LayoutTemplate className="w-9 h-9 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No Templates Yet</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">Create a reusable workout plan to start your session with one tap.</p>
              <button
                onClick={() => navigate('/templates/new')}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors"
              >
                Create First Template
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map(t => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/templates/${t.id}`)}
                  className="group relative bg-[#13131f] border border-white/5 rounded-2xl p-4 cursor-pointer
                    hover:border-purple-500/30 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-purple-600/15 border border-purple-500/20 flex-shrink-0">
                      <Dumbbell className="w-5 h-5 text-purple-400" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold truncate">{t.name}</h3>
                        {t.difficulty && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0
                            ${DIFFICULTY_COLORS[t.difficulty] || DIFFICULTY_COLORS.intermediate}`}>
                            {t.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-3 h-3" />
                          {t.exercise_count} exercise{t.exercise_count !== 1 ? 's' : ''}
                        </span>
                        {t.estimated_duration_min > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{t.estimated_duration_min}m
                          </span>
                        )}
                        {t.last_used_at && (
                          <span className="hidden sm:flex items-center gap-1">
                            Last used {new Date(t.last_used_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(t.id, e); }}
                        className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleStart(t); }}
                        disabled={starting === t.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium
                          hover:bg-purple-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {starting === t.id ? (
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        Start
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
