import React, { useState } from 'react';
import { Search, Plus, X, ChevronRight, Filter } from 'lucide-react';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';
import { EXERCISES, MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS, EQUIPMENT_LABELS } from '../lib/exerciseData';

function CustomExerciseModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', muscle_group: 'chest', equipment: 'barbell',
    category: 'strength', difficulty: 'intermediate',
    description: '', instructions: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const { data } = await axios.post('/exercise-library/custom/', form);
      onSave(data);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const field = (label, key, type = 'text', opts) => (
    <div>
      <label className="text-xs text-gray-400 font-medium mb-1 block">{label}</label>
      {opts ? (
        <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm
            focus:outline-none focus:ring-1 focus:ring-purple-500 capitalize">
          {opts.map(o => <option key={o} value={o} className="bg-[#13131f]">{o.replace('_',' ')}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm
            focus:outline-none focus:ring-1 focus:ring-purple-500"
          placeholder={`Enter ${label.toLowerCase()}...`} />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#13131f] rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
          <h3 className="text-white font-semibold">Custom Exercise</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          {field('Exercise Name', 'name')}
          <div className="grid grid-cols-2 gap-3">
            {field('Muscle Group', 'muscle_group', 'text', Object.keys(MUSCLE_GROUP_LABELS))}
            {field('Equipment', 'equipment', 'text', Object.keys(EQUIPMENT_LABELS))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('Category', 'category', 'text', ['strength','cardio','flexibility'])}
            {field('Difficulty', 'difficulty', 'text', ['beginner','intermediate','advanced'])}
          </div>
          {field('Description (optional)', 'description')}
          {field('Instructions (optional)', 'instructions')}
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving || !form.name.trim()}
              className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Create Exercise'}
            </button>
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseDetailModal({ exercise, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#13131f] rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
          <h3 className="text-white font-semibold truncate pr-4">{exercise.name}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 flex-shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${MUSCLE_GROUP_COLORS[exercise.muscle_group] || 'bg-gray-500/20 text-gray-400'}`}>
              {MUSCLE_GROUP_LABELS[exercise.muscle_group] || exercise.muscle_group}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300 capitalize">
              {exercise.equipment?.replace('_',' ')}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300 capitalize">
              {exercise.difficulty}
            </span>
          </div>
          {exercise.secondary_muscles && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">Secondary muscles</p>
              <p className="text-gray-300 text-sm capitalize">{exercise.secondary_muscles.replace(/,/g, ', ')}</p>
            </div>
          )}
          {exercise.description && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">Description</p>
              <p className="text-gray-300 text-sm">{exercise.description}</p>
            </div>
          )}
          {exercise.instructions && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">How to perform</p>
              <p className="text-gray-300 text-sm leading-relaxed">{exercise.instructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExerciseLibraryPage() {
  const [search,      setSearch]      = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment,   setEquipment]   = useState('');
  const [showCustom,  setShowCustom]  = useState(false);
  const [selected,    setSelected]    = useState(null);
  const [customExs,   setCustomExs]   = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = [...EXERCISES, ...customExs].filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchGroup  = !muscleGroup || e.muscle_group === muscleGroup;
    const matchEquip  = !equipment || e.equipment === equipment;
    return matchSearch && matchGroup && matchEquip;
  });

  // Group by muscle group
  const grouped = filtered.reduce((acc, ex) => {
    const g = ex.muscle_group;
    if (!acc[g]) acc[g] = [];
    acc[g].push(ex);
    return acc;
  }, {});

  const muscleGroups = Object.keys(MUSCLE_GROUP_LABELS);

  return (
    <div className="min-h-screen bg-[#0d0d17]">
      <Navbar />
      <main className="lg:ml-60 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white">Exercise Library</h1>
              <p className="text-gray-500 text-sm mt-0.5">{filtered.length} exercises</p>
            </div>
            <button onClick={() => setShowCustom(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600
                text-white font-medium text-sm shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-violet-500 transition-all">
              <Plus className="w-4 h-4" />
              Custom
            </button>
          </div>

          {/* Search + filter */}
          <div className="space-y-2 mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exercises..."
                className="w-full pl-9 pr-10 py-3 bg-[#13131f] border border-white/10 rounded-xl text-white text-sm
                  placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500" />
              <button onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors
                  ${showFilters || muscleGroup || equipment ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {showFilters && (
              <div className="bg-[#13131f] border border-white/5 rounded-xl p-3 space-y-2">
                {/* Muscle group filter */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  <button onClick={() => setMuscleGroup('')}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                      ${!muscleGroup ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    All Muscles
                  </button>
                  {muscleGroups.map(g => (
                    <button key={g} onClick={() => setMuscleGroup(g === muscleGroup ? '' : g)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                        ${muscleGroup === g ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {MUSCLE_GROUP_LABELS[g]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grouped list */}
          {Object.keys(grouped).map(group => (
            <div key={group} className="mb-5">
              <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
                {MUSCLE_GROUP_LABELS[group] || group} ({grouped[group].length})
              </h2>
              <div className="bg-[#13131f] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                {grouped[group].map(ex => (
                  <button key={ex.id} onClick={() => setSelected(ex)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
                      ${MUSCLE_GROUP_COLORS[ex.muscle_group] || 'bg-gray-500/20 text-gray-400'}`}>
                      {ex.equipment?.replace('_',' ')}
                    </span>
                    <span className="text-white text-sm flex-1 truncate">{ex.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ex.is_custom && <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Custom</span>}
                      <span className="text-gray-600 text-xs capitalize">{ex.difficulty}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No exercises match your search</p>
            </div>
          )}
        </div>
      </main>

      {showCustom && (
        <CustomExerciseModal
          onSave={ex => { setCustomExs(prev => [...prev, ex]); setShowCustom(false); }}
          onClose={() => setShowCustom(false)}
        />
      )}
      {selected && <ExerciseDetailModal exercise={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
