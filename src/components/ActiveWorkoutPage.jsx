import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, X, Search, Dumbbell } from 'lucide-react';
import axios from '../lib/axiosConfig';
import Navbar from './Navbar';
import SetRow from './workout/SetRow';
import RestTimerBanner from './workout/RestTimerBanner';
import WorkoutSummaryModal from './workout/WorkoutSummaryModal';
import { useRestTimer } from '../hooks/useRestTimer';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { EXERCISES, MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS } from '../lib/exerciseData';

// Group sets by exercise
function groupSetsByExercise(sets) {
  const map = new Map();
  for (const s of sets) {
    const key = s.exercise_library_id;
    if (!map.has(key)) {
      map.set(key, { exercise_library_id: key, exercise_name: s.exercise_name, sets: [] });
    }
    map.get(key).sets.push(s);
  }
  // Sort sets within each exercise by set_number
  for (const group of map.values()) {
    group.sets.sort((a, b) => a.set_number - b.set_number);
  }
  return Array.from(map.values());
}

function ExercisePickerModal({ onSelect, onClose }) {
  const [search,      setSearch]      = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');

  const filtered = EXERCISES.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchGroup  = !muscleGroup || e.muscle_group === muscleGroup;
    return matchSearch && matchGroup;
  });

  const groups = Object.keys(MUSCLE_GROUP_LABELS);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#13131f] rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
          <h3 className="text-white font-semibold">Add Exercise</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            <button onClick={() => setMuscleGroup('')}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${!muscleGroup ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>All</button>
            {groups.map(g => (
              <button key={g} onClick={() => setMuscleGroup(g === muscleGroup ? '' : g)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${muscleGroup === g ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                {MUSCLE_GROUP_LABELS[g]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {filtered.map(ex => (
              <button key={ex.id} onClick={() => onSelect(ex)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-colors">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${MUSCLE_GROUP_COLORS[ex.muscle_group] || 'bg-gray-500/20 text-gray-400'}`}>
                  {MUSCLE_GROUP_LABELS[ex.muscle_group] || ex.muscle_group}
                </span>
                <span className="text-white text-sm flex-1 truncate">{ex.name}</span>
                <span className="text-gray-600 text-xs flex-shrink-0 capitalize">{ex.equipment?.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActiveWorkoutPage() {
  const navigate = useNavigate();
  const [session,    setSession]    = useState(null);
  const [sets,       setSets]       = useState([]);
  const [collapsed,  setCollapsed]  = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [summary,    setSummary]    = useState(null);
  const [finishing,  setFinishing]  = useState(false);
  const [loading,    setLoading]    = useState(true);

  const restTimer = useRestTimer();
  const workoutTimer = useWorkoutTimer(session?.started_at);

  useEffect(() => { loadCurrentSession(); }, []);

  const loadCurrentSession = async () => {
    try {
      const { data } = await axios.get('/active-workout/current/');
      if (data) {
        setSession(data);
        setSets(data.sets || []);
      } else {
        navigate('/templates');
      }
    } catch (e) {
      console.error(e);
      navigate('/templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSetUpdate = useCallback(async (setId, updates) => {
    setSets(prev => prev.map(s => s.id === setId ? { ...s, ...updates } : s));
    try {
      await axios.put(`/active-workout/${session.id}/sets/${setId}/`, updates);
      // Start rest timer if completing a set
      if (updates.is_completed === true) {
        const s = sets.find(s => s.id === setId);
        const restSecs = s?.rest_seconds_after || 90;
        restTimer.start(restSecs);
      }
    } catch (e) {
      console.error(e);
    }
  }, [session, sets, restTimer]);

  const handleAddSet = async (exerciseLibraryId, exerciseName) => {
    const exerciseSets = sets.filter(s => s.exercise_library_id === exerciseLibraryId);
    const nextSetNum   = exerciseSets.length + 1;
    const lastSet      = exerciseSets[exerciseSets.length - 1];
    try {
      const { data } = await axios.post(`/active-workout/${session.id}/sets/`, {
        exercise_library_id: exerciseLibraryId,
        exercise_name:       exerciseName,
        set_number:          nextSetNum,
        reps:                lastSet?.reps || 10,
        weight_kg:           lastSet?.weight_kg || 0,
        is_completed:        false,
        rest_seconds_after:  lastSet?.rest_seconds_after || 90,
      });
      setSets(prev => [...prev, data]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteSet = async (setId) => {
    setSets(prev => prev.filter(s => s.id !== setId));
    try { await axios.delete(`/active-workout/${session.id}/sets/${setId}/`); }
    catch (e) { console.error(e); }
  };

  const handleAddExercise = async (ex) => {
    setShowPicker(false);
    const nextSetNum = 1;
    try {
      const { data } = await axios.post(`/active-workout/${session.id}/sets/`, {
        exercise_library_id: ex.id,
        exercise_name:       ex.name,
        set_number:          nextSetNum,
        reps:                10,
        weight_kg:           0,
        is_completed:        false,
        rest_seconds_after:  90,
      });
      setSets(prev => [...prev, data]);
    } catch (e) { console.error(e); }
  };

  const handleFinish = async () => {
    setFinishing(true);
    try {
      const { data } = await axios.post(`/active-workout/${session.id}/finish/`);
      setSummary(data);
    } catch (e) {
      console.error(e);
      alert('Failed to save workout');
    } finally {
      setFinishing(false);
    }
  };

  const handleDiscard = async () => {
    if (!confirm('Discard this workout? All progress will be lost.')) return;
    try {
      await axios.delete(`/active-workout/${session.id}/`);
      navigate('/Home');
    } catch (e) { navigate('/Home'); }
  };

  const toggleCollapse = (exId) => {
    setCollapsed(prev => ({ ...prev, [exId]: !prev[exId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d17] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const exercises = groupSetsByExercise(sets);
  const completedSets = sets.filter(s => s.is_completed).length;

  return (
    <div className="min-h-screen bg-[#0d0d17]">
      <Navbar />
      <main className="lg:ml-60 pt-14 lg:pt-0 pb-32 lg:pb-24">
        <div className="max-w-2xl mx-auto px-4 py-4">

          {/* Sticky top bar */}
          <div className="sticky top-14 lg:top-0 z-30 -mx-4 px-4 py-3 bg-[#0d0d17]/95 backdrop-blur-sm border-b border-white/5 mb-4">
            <div className="flex items-center gap-3">
              <button onClick={handleDiscard} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-white font-bold truncate">{session?.workout_name || 'Workout'}</h1>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-mono text-purple-400 font-medium">{workoutTimer.formatted}</span>
                  <span>{completedSets} sets done</span>
                  <span>{exercises.length} exercises</span>
                </div>
              </div>
              <button
                onClick={handleFinish}
                disabled={finishing || completedSets === 0}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-sm
                  shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-violet-500 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {finishing && <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
                Finish
              </button>
            </div>
          </div>

          {/* Set columns header */}
          {exercises.length > 0 && (
            <div className="flex items-center gap-3 px-2 mb-2 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
              <span className="w-6 text-center">#</span>
              <span className="flex-1 text-center">kg</span>
              <span className="flex-1 text-center">reps</span>
              <span className="w-9" />
            </div>
          )}

          {/* Exercise cards */}
          <div className="space-y-3">
            {exercises.map(group => {
              const isCollapsed   = collapsed[group.exercise_library_id];
              const completedHere = group.sets.filter(s => s.is_completed).length;
              const allDone       = completedHere === group.sets.length && group.sets.length > 0;
              const lastSet       = group.sets[group.sets.length - 1];
              const prevWeight    = group.sets.find(s => s.is_completed)?.weight_kg || 0;

              return (
                <div key={group.exercise_library_id}
                  className={`bg-[#13131f] rounded-2xl border transition-colors
                    ${allDone ? 'border-green-500/20 bg-green-950/10' : 'border-white/5'}`}>

                  {/* Exercise header */}
                  <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => toggleCollapse(group.exercise_library_id)}>
                    <div className={`p-2 rounded-xl flex-shrink-0 ${allDone ? 'bg-green-500/20' : 'bg-purple-600/15'}`}>
                      <Dumbbell className={`w-4 h-4 ${allDone ? 'text-green-400' : 'text-purple-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{group.exercise_name}</p>
                      <p className="text-gray-500 text-xs">{completedHere}/{group.sets.length} sets done</p>
                    </div>
                    {isCollapsed
                      ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      : <ChevronUp   className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                  </div>

                  {!isCollapsed && (
                    <div className="px-3 pb-3 space-y-1">
                      {group.sets.map((s, idx) => (
                        <SetRow
                          key={s.id}
                          set={s}
                          setIndex={idx}
                          previousWeight={prevWeight}
                          onUpdate={handleSetUpdate}
                          onDelete={handleDeleteSet}
                        />
                      ))}
                      <button
                        onClick={() => handleAddSet(group.exercise_library_id, group.exercise_name)}
                        className="w-full py-2 mt-1 rounded-xl border border-dashed border-white/10 text-gray-500
                          hover:border-purple-500/40 hover:text-purple-400 text-xs font-medium transition-all"
                      >
                        + Add Set
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add exercise */}
          <button
            onClick={() => setShowPicker(true)}
            className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-white/10 text-gray-500
              hover:border-purple-500/40 hover:text-purple-400 flex items-center justify-center gap-2
              text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Exercise
          </button>

          {/* Empty state */}
          {exercises.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">No exercises yet. Tap "Add Exercise" to start.</p>
            </div>
          )}
        </div>
      </main>

      {/* Rest timer */}
      <RestTimerBanner
        seconds={restTimer.seconds}
        total={restTimer.total}
        isRunning={restTimer.isRunning}
        onSkip={restTimer.skip}
      />

      {/* Exercise picker */}
      {showPicker && <ExercisePickerModal onSelect={handleAddExercise} onClose={() => setShowPicker(false)} />}

      {/* Summary modal */}
      {summary && <WorkoutSummaryModal summary={summary} onClose={() => setSummary(null)} />}
    </div>
  );
}
