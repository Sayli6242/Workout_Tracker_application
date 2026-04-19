import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GripVertical, Search, X, Check, ChevronDown } from 'lucide-react';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';
import { EXERCISES, MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS } from '../lib/exerciseData';

const WORKOUT_TYPES = ['gym', 'hiit', 'machine', 'equipment', 'beginner', 'intermediate', 'pro', 'yoga'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

function ExercisePickerModal({ onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [customExs, setCustomExs] = useState([]);

  useEffect(() => {
    axios.get('/exercise-library/', { params: { search: search || undefined, muscle_group: muscleGroup || undefined } })
      .then(r => setCustomExs(r.data.filter(e => e.is_custom)))
      .catch(() => { });
  }, [search, muscleGroup]);

  const filtered = EXERCISES.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchGroup = !muscleGroup || e.muscle_group === muscleGroup;
    return matchSearch && matchGroup;
  });

  const all = [...filtered, ...customExs];
  const unique = Array.from(new Map(all.map(e => [e.id, e])).values());

  const groups = Object.keys(MUSCLE_GROUP_LABELS);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#13131f] rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
          <h3 className="text-white font-semibold">Add Exercise</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white
                placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          {/* Muscle group chips */}
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            <button
              onClick={() => setMuscleGroup('')}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${!muscleGroup ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >All</button>
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setMuscleGroup(g === muscleGroup ? '' : g)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors
                  ${muscleGroup === g ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {MUSCLE_GROUP_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {unique.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">No exercises found</p>
          ) : (
            <div className="space-y-1">
              {unique.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => onSelect(ex)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-colors"
                >
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
                    ${MUSCLE_GROUP_COLORS[ex.muscle_group] || 'bg-gray-500/20 text-gray-400'}`}>
                    {MUSCLE_GROUP_LABELS[ex.muscle_group] || ex.muscle_group}
                  </span>
                  <span className="text-white text-sm flex-1 truncate">{ex.name}</span>
                  <span className="text-gray-600 text-xs flex-shrink-0 capitalize">{ex.equipment?.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TemplateBuilderPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(templateId);

  const [name, setName] = useState('');
  const [workoutType, setWorkoutType] = useState('gym');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [duration, setDuration] = useState(45);
  const [exercises, setExercises] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/templates/${templateId}/`).then(({ data }) => {
      setName(data.name || '');
      setWorkoutType(data.workout_type || 'gym');
      setDifficulty(data.difficulty || 'intermediate');
      setDuration(data.estimated_duration_min || 45);
      setExercises(data.exercises || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [templateId]);

  const handleAddExercise = async (ex) => {
    setShowPicker(false);
    const newEx = {
      exercise_library_id: ex.id,
      exercise_name: ex.name,
      order_index: exercises.length,
      target_sets: 3,
      target_reps: 10,
      target_weight_kg: 0,
      rest_seconds: 90,
      _local_id: Date.now(),
    };
    setExercises(prev => [...prev, newEx]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleExerciseUpdate = (index, field, value) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex));
  };

  const handleSave = async () => {
    if (!name.trim()) { alert('Please enter a template name'); return; }
    setSaving(true);
    try {
      let tmplId = templateId;
      if (isEdit) {
        await axios.put(`/templates/${templateId}/`, {
          name, workout_type: workoutType, difficulty,
          estimated_duration_min: duration,
        });
      } else {
        const { data } = await axios.post('/templates/', {
          name, workout_type: workoutType, difficulty,
          estimated_duration_min: duration,
        });
        tmplId = data.id;
      }

      // Save exercises — delete old ones if editing, then re-add
      if (isEdit) {
        const { data: existing } = await axios.get(`/templates/${tmplId}/`);
        await Promise.all((existing.exercises || []).map(ex =>
          axios.delete(`/templates/${tmplId}/exercises/${ex.id}/`).catch(() => { })
        ));
      }
      await Promise.all(exercises.map((ex, idx) =>
        axios.post(`/templates/${tmplId}/exercises/`, {
          exercise_library_id: ex.exercise_library_id,
          exercise_name: ex.exercise_name,
          order_index: idx,
          target_sets: parseInt(ex.target_sets) || 3,
          target_reps: parseInt(ex.target_reps) || 10,
          target_weight_kg: parseFloat(ex.target_weight_kg) || 0,
          rest_seconds: parseInt(ex.rest_seconds) || 90,
        })
      ));

      navigate('/templates');
    } catch (e) {
      console.error('Save failed:', e.response?.data ?? e);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d17] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d17]">
      <Navbar />
      <main className="lg:ml-60 pt-14 lg:pt-0 pb-24 lg:pb-6">
        <div className="max-w-2xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/templates')}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Template' : 'New Template'}</h1>
          </div>

          {/* Template info */}
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-4 mb-4 space-y-3">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Template Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Push Day, Leg Day..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                  placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">Type</label>
                <select value={workoutType} onChange={e => setWorkoutType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm
                    focus:outline-none focus:ring-1 focus:ring-purple-500 capitalize">
                  {WORKOUT_TYPES.map(t => <option key={t} value={t} className="bg-[#13131f]">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm
                    focus:outline-none focus:ring-1 focus:ring-purple-500 capitalize">
                  {DIFFICULTIES.map(d => <option key={d} value={d} className="bg-[#13131f]">{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">Duration (min)</label>
                <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value) || 45)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm
                    focus:outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-[#13131f] border border-white/5 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Exercises <span className="text-gray-500 font-normal text-sm">({exercises.length})</span></h2>
              <button onClick={() => setShowPicker(true)}
                className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Add Exercise
              </button>
            </div>

            {exercises.length === 0 ? (
              <button onClick={() => setShowPicker(true)}
                className="w-full py-8 border-2 border-dashed border-white/10 rounded-xl text-gray-500
                  hover:border-purple-500/40 hover:text-purple-400 transition-all text-sm">
                + Add exercises to get started
              </button>
            ) : (
              <div className="space-y-3">
                {exercises.map((ex, idx) => (
                  <div key={ex.id || ex._local_id || idx}
                    className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0 cursor-grab" />
                      <span className="text-white font-medium text-sm flex-1 truncate">{ex.exercise_name}</span>
                      <button onClick={() => handleRemoveExercise(idx)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Sets', field: 'target_sets', type: 'number' },
                        { label: 'Reps', field: 'target_reps', type: 'number' },
                        { label: 'kg', field: 'target_weight_kg', type: 'number' },
                        { label: 'Rest s', field: 'rest_seconds', type: 'number' },
                      ].map(({ label, field, type }) => (
                        <div key={field}>
                          <label className="text-[10px] text-gray-500 block mb-1">{label}</label>
                          <input
                            type={type}
                            value={ex[field] || ''}
                            onChange={e => handleExerciseUpdate(idx, field, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs
                              text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold
              shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-violet-500 transition-all
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Template')}
          </button>
        </div>
      </main>

      {showPicker && <ExercisePickerModal onSelect={handleAddExercise} onClose={() => setShowPicker(false)} />}
    </div>
  );
}
